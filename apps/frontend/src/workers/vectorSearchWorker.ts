import type {
  WorkerRequest,
  WorkerResponse,
  WorkerSearchRequest,
  WorkerSearchResponse,
  WorkerErrorResponse,
  SearchResult,
} from "../lib/vectorSearch/types.js";
import init, { VectorSearch } from "../lib/vectorSearch/wasm/vector_search.js";

let vectorSearch: VectorSearch | null = null;
let currentLanguage: "en" | "pt" | null = null;
let embeddingPipeline: any = null;
let embeddingPipelinePromise: Promise<any> | null = null;

interface EmbeddingIndex {
  chunks: Array<{
    id: string;
    offset: number;
    length: number;
    metadata: {
      section: string;
      language: string;
      feature?: string;
      type: string;
    };
  }>;
  dimension: number;
  language: string;
}

async function loadEmbeddings(language: "en" | "pt"): Promise<{
  embeddings: Float32Array[];
  texts: string[];
  metadata: Array<SearchResult["metadata"]>;
}> {
  // Load index file
  const indexResponse = await fetch(`/embeddings/${language}-index.json`);
  if (!indexResponse.ok) {
    throw new Error(`Failed to load index for language ${language}`);
  }
  const index: EmbeddingIndex = await indexResponse.json();

  // Load binary embeddings file
  const binaryResponse = await fetch(`/embeddings/${language}.bin`);
  if (!binaryResponse.ok) {
    throw new Error(`Failed to load embeddings for language ${language}`);
  }
  const arrayBuffer = await binaryResponse.arrayBuffer();
  const dataView = new DataView(arrayBuffer);

  // Extract embeddings and metadata
  const embeddings: Float32Array[] = [];
  const texts: string[] = [];
  const metadata: Array<SearchResult["metadata"]> = [];

  // Load text index for texts
  const textIndexResponse = await fetch(
    `/embeddings/${language}-text-index.json`
  );
  if (!textIndexResponse.ok) {
    throw new Error(`Failed to load text index for language ${language}`);
  }
  const textIndex = await textIndexResponse.json();

  for (const chunk of index.chunks) {
    // Read embedding from binary data
    const embedding = new Float32Array(index.dimension);
    for (let i = 0; i < index.dimension; i++) {
      embedding[i] = dataView.getFloat32(chunk.offset + i * 4, true); // true = little-endian
    }
    embeddings.push(embedding);

    // Get text from text index
    const textChunk = textIndex.chunks.find(
      (c: { id: string }) => c.id === chunk.id
    );
    if (textChunk) {
      texts.push(textChunk.text);
    } else {
      texts.push(""); // Fallback if text not found
    }

    metadata.push(chunk.metadata);
  }

  return { embeddings, texts, metadata };
}

async function initializeWasm() {
  if (typeof init === "function") {
    await init();
  }
}

/**
 * Initialize the embedding pipeline in the worker
 * This loads @xenova/transformers model for generating embeddings
 */
async function initializeEmbeddingPipeline() {
  if (embeddingPipeline) {
    return embeddingPipeline;
  }

  if (embeddingPipelinePromise) {
    return embeddingPipelinePromise;
  }

  embeddingPipelinePromise = (async () => {
    // IMPORTANT: Set up interceptors BEFORE importing @xenova/transformers
    // This ensures our interceptors are in place before the library makes any requests

    // Override both fetch and XMLHttpRequest to intercept Hugging Face requests
    // In Web Workers, we need to override self.fetch, not just globalThis.fetch
    console.log("[VectorSearchWorker] Setting up request interceptors...");
    const originalFetch = self.fetch.bind(self);

    // Override fetch in multiple places to ensure we catch all requests
    const interceptedFetch = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.href
          : input instanceof Request
          ? input.url
          : String(input);

      // Log ALL fetch requests to see what the library is doing
      if (url && typeof url === "string") {
        console.log(`[VectorSearchWorker] 🔍 Fetch request: ${url}`);

        // If it's a Hugging Face URL, log it prominently
        if (url.includes("huggingface.co") || url.includes("hf.co")) {
          console.error(
            `[VectorSearchWorker] ⚠️ HUGGING FACE REQUEST DETECTED: ${url}`
          );
        }
      }

      // Intercept Hugging Face requests and redirect to local files
      // Try multiple URL patterns since the library might construct URLs differently
      if (
        url &&
        typeof url === "string" &&
        (url.includes("huggingface.co") || url.includes("hf.co"))
      ) {
        console.error(
          `[VectorSearchWorker] 🚨 INTERCEPTING HUGGING FACE REQUEST: ${url}`
        );

        // Try multiple patterns to match different URL formats
        const patterns = [
          // Pattern 1: https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/config.json
          /(?:Xenova\/)?all-MiniLM-L6-v2\/resolve\/main\/(.+)$/,
          // Pattern 2: https://huggingface.co/Xenova/all-MiniLM-L6-v2/raw/main/config.json
          /(?:Xenova\/)?all-MiniLM-L6-v2\/raw\/main\/(.+)$/,
          // Pattern 3: https://huggingface.co/Xenova/all-MiniLM-L6-v2/blob/main/config.json
          /(?:Xenova\/)?all-MiniLM-L6-v2\/blob\/main\/(.+)$/,
          // Pattern 4: Just match any path after the model name
          /all-MiniLM-L6-v2[^/]*\/(.+)$/,
        ];

        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match) {
            const filePath = match[1];
            const localUrl = `/models/Xenova/all-MiniLM-L6-v2/${filePath}`;
            console.log(
              `[VectorSearchWorker] ✓ Matched pattern, redirecting: ${url} -> ${localUrl}`
            );
            return originalFetch(localUrl, init);
          }
        }

        // If no pattern matched, log the URL so we can add a new pattern
        console.error(
          `[VectorSearchWorker] ⚠️ No pattern matched for URL: ${url}`
        );
      }

      // For all other requests, use the original fetch
      return originalFetch(input, init);
    };

    // Override fetch in all possible places using Object.defineProperty
    // This ensures the override can't be bypassed
    try {
      Object.defineProperty(self, "fetch", {
        value: interceptedFetch,
        writable: true,
        configurable: true,
      });
      console.log(
        "[VectorSearchWorker] ✓ Overrode self.fetch using defineProperty"
      );
    } catch (e) {
      self.fetch = interceptedFetch;
      console.log(
        "[VectorSearchWorker] ✓ Overrode self.fetch using assignment"
      );
    }

    try {
      Object.defineProperty(globalThis, "fetch", {
        value: interceptedFetch,
        writable: true,
        configurable: true,
      });
      console.log(
        "[VectorSearchWorker] ✓ Overrode globalThis.fetch using defineProperty"
      );
    } catch (e) {
      globalThis.fetch = interceptedFetch;
      console.log(
        "[VectorSearchWorker] ✓ Overrode globalThis.fetch using assignment"
      );
    }

    // Verify the override worked
    console.log(
      "[VectorSearchWorker] Verification - self.fetch === interceptedFetch:",
      self.fetch === interceptedFetch
    );
    console.log(
      "[VectorSearchWorker] Verification - globalThis.fetch === interceptedFetch:",
      globalThis.fetch === interceptedFetch
    );

    console.log(
      "[VectorSearchWorker] Fetch override complete. self.fetch:",
      typeof self.fetch
    );
    console.log(
      "[VectorSearchWorker] globalThis.fetch:",
      typeof globalThis.fetch
    );

    // Also intercept XMLHttpRequest (the library might use this instead)
    const OriginalXHR = globalThis.XMLHttpRequest;
    globalThis.XMLHttpRequest = class extends OriginalXHR {
      open(
        method: string,
        url: string | URL,
        async: boolean = true,
        username?: string | null,
        password?: string | null
      ): void {
        const urlString = typeof url === "string" ? url : url.href;

        // Log ALL XHR requests to see what the library is doing
        if (urlString) {
          console.log(
            `[VectorSearchWorker] XHR request: ${method} ${urlString}`
          );
        }

        // Intercept Hugging Face requests
        if (
          urlString &&
          (urlString.includes("huggingface.co") || urlString.includes("hf.co"))
        ) {
          if (
            urlString.includes("Xenova/all-MiniLM-L6-v2") ||
            urlString.includes("all-MiniLM-L6-v2")
          ) {
            const match = urlString.match(
              /(?:Xenova\/)?all-MiniLM-L6-v2\/resolve\/main\/(.+)$/
            );
            if (match) {
              const filePath = match[1];
              const localUrl = `/models/Xenova/all-MiniLM-L6-v2/${filePath}`;
              console.log(
                `[VectorSearchWorker] ✓ Intercepting XHR Hugging Face request: ${urlString}`
              );
              console.log(
                `[VectorSearchWorker] ✓ Redirecting to local file: ${localUrl}`
              );
              return super.open(
                method,
                localUrl,
                async ?? true,
                username,
                password
              );
            }
          }
        }

        return super.open(method, urlString, async ?? true, username, password);
      }
    } as typeof XMLHttpRequest;

    console.log(
      "[VectorSearchWorker] Request interceptors set up. Now importing @xenova/transformers..."
    );

    // Test that local files are accessible before importing the library
    console.log("[VectorSearchWorker] Testing local file access...");
    try {
      const testFiles = [
        "/models/Xenova/all-MiniLM-L6-v2/config.json",
        "/models/Xenova/all-MiniLM-L6-v2/tokenizer.json",
        "/models/Xenova/all-MiniLM-L6-v2/tokenizer_config.json",
      ];
      for (const file of testFiles) {
        const response = await originalFetch(file);
        if (response.ok) {
          console.log(`[VectorSearchWorker] ✓ Local file accessible: ${file}`);
        } else {
          console.error(
            `[VectorSearchWorker] ✗ Local file NOT accessible: ${file} (${response.status})`
          );
        }
      }
    } catch (e) {
      console.error("[VectorSearchWorker] Error testing local files:", e);
    }

    // NOW import the library after interceptors are set up
    // But first, let's also try to patch any HTTP clients the library might use
    console.log("[VectorSearchWorker] About to import @xenova/transformers...");
    console.log("[VectorSearchWorker] Current fetch references:", {
      selfFetch: typeof self.fetch,
      globalThisFetch: typeof globalThis.fetch,
      fetchEqual: self.fetch === globalThis.fetch,
      fetchIsIntercepted: self.fetch === interceptedFetch,
    });

    const { pipeline, env } = await import("@xenova/transformers");

    // After importing, check if the library has its own HTTP client
    console.log(
      "[VectorSearchWorker] Library imported. Checking for internal HTTP clients..."
    );
    // @ts-expect-error - library might have internal HTTP client
    if (env && typeof env === "object") {
      // @ts-expect-error
      console.log("[VectorSearchWorker] env object keys:", Object.keys(env));
      // @ts-expect-error
      if ("fetch" in env) {
        // @ts-expect-error
        console.log(
          "[VectorSearchWorker] Library has env.fetch, overriding it..."
        );
        // @ts-expect-error
        env.fetch = interceptedFetch;
      }
    }

    // Configure @xenova/transformers environment
    console.log(
      "[VectorSearchWorker] Configuring @xenova/transformers environment"
    );

    // Clear IndexedDB cache on first load to avoid corrupted cache issues
    // This only runs once per worker initialization
    try {
      const dbName = "transformers-cache";
      const deleteReq = indexedDB.deleteDatabase(dbName);
      await new Promise((resolve) => {
        deleteReq.onsuccess = () => {
          console.log(
            "[VectorSearchWorker] Cleared IndexedDB cache (if it existed)"
          );
          resolve(undefined);
        };
        deleteReq.onerror = () => {
          // No cache to clear or already cleared - not an error
          resolve(undefined);
        };
        deleteReq.onblocked = () => {
          // Cache is in use - will be cleared on next load
          resolve(undefined);
        };
      });
    } catch (e) {
      // IndexedDB might not be available - not critical
      console.log("[VectorSearchWorker] Could not clear IndexedDB:", e);
    }

    // Configure to use local model files (downloaded at build time)
    // This avoids CORS issues with Hugging Face redirects
    env.allowLocalModels = true;
    env.allowRemoteModels = false; // Disable remote models to force local loading
    env.useBrowserCache = true; // Enable cache for better performance
    env.useCustomCache = false;

    // Set localModelPath to point to the public models directory
    // Models are served from /models/Xenova/all-MiniLM-L6-v2/...
    // @xenova/transformers uses localModelPath to construct paths
    try {
      // @ts-expect-error - localModelPath property may exist at runtime
      env.localModelPath = "/models";
      console.log("[VectorSearchWorker] Set localModelPath to /models");
    } catch (e) {
      console.log("[VectorSearchWorker] Could not set localModelPath:", e);
    }

    // Also try localURL (alternative property name)
    try {
      // @ts-expect-error - localURL property may exist at runtime
      env.localURL = "/models";
      console.log("[VectorSearchWorker] Set localURL to /models");
    } catch (e) {
      console.log("[VectorSearchWorker] Could not set localURL:", e);
    }

    // Also try localPath (another alternative)
    try {
      // @ts-expect-error - localPath property may exist at runtime
      env.localPath = "/models";
      console.log("[VectorSearchWorker] Set localPath to /models");
    } catch (e) {
      console.log("[VectorSearchWorker] Could not set localPath:", e);
    }

    // Enable verbose logging to see what's happening
    try {
      // @ts-expect-error - logLevel might exist
      if (env.logLevel !== undefined) {
        // @ts-expect-error
        env.logLevel = "info";
      }
    } catch {
      // Property doesn't exist, that's okay
    }

    console.log("[VectorSearchWorker] Environment configured:", {
      allowLocalModels: env.allowLocalModels,
      allowRemoteModels: env.allowRemoteModels,
      useBrowserCache: env.useBrowserCache,
      // @ts-expect-error
      localModelPath: env.localModelPath,
      // @ts-expect-error
      localURL: env.localURL,
      // @ts-expect-error
      localPath: env.localPath,
    });

    // Use local model path (relative to localURL)
    // The library should construct URLs like: /models/Xenova/all-MiniLM-L6-v2/config.json
    const modelName = "Xenova/all-MiniLM-L6-v2";

    try {
      console.log("[VectorSearchWorker] Loading embedding model:", modelName);
      console.log("[VectorSearchWorker] Using local files from /models/");
      console.log(
        "[VectorSearchWorker] This may take a moment on first load..."
      );

      // Load from local files - the library should use localURL to construct paths
      // If allowRemoteModels is false, it should only try local files
      const extractor = await pipeline("feature-extraction", modelName, {
        quantized: true, // Use quantized model (model_quantized.onnx)
      });

      console.log("[VectorSearchWorker] Embedding model loaded successfully");
      embeddingPipeline = extractor;
      return extractor;
    } catch (error) {
      console.error(
        "[VectorSearchWorker] Error loading embedding model:",
        error
      );
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // If it's a JSON parse error with HTML, it's likely a redirect/CORS issue
      // Hugging Face uses 302 redirects, and the redirect target might not have CORS headers
      if (
        errorMessage.includes("not valid JSON") ||
        errorMessage.includes("<!doctype") ||
        errorMessage.includes("Unexpected token '<'")
      ) {
        console.error(
          "[VectorSearchWorker] Redirect/CORS error detected.",
          "Hugging Face returned a 302 redirect, but the final URL is returning HTML instead of JSON.",
          "This might be due to:",
          "1. The library not following redirects correctly in worker context",
          "2. CORS issue with the redirect target URL",
          "3. The redirect URL pointing to an HTML page (login/error page)",
          "4. Browser extension interfering with redirects"
        );

        // If local model loading fails, provide helpful error message
        throw new Error(
          `Failed to load embedding model from local files. ` +
            `The model files should be downloaded at build time. ` +
            `\n\nTroubleshooting steps:` +
            `\n1. Run 'pnpm download:embedding-model' to download the model files` +
            `\n2. Check that model files exist in apps/frontend/public/models/Xenova/all-MiniLM-L6-v2/` +
            `\n3. Check browser Network tab - look for 404 errors for model files` +
            `\n4. Ensure the build process includes the download step` +
            `\n\nOriginal error: ${errorMessage.substring(0, 300)}`
        );
      }

      // Re-throw the error with helpful message
      embeddingPipelinePromise = null;
      throw error;
    }
  })();

  return embeddingPipelinePromise;
}

/**
 * Generate embedding for a query string in the worker
 */
async function generateQueryEmbedding(query: string): Promise<number[]> {
  const extractor = await initializeEmbeddingPipeline();

  // Call extractor with options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (extractor as any)(query, {
    pooling: "mean",
    normalize: true,
  });

  // Convert to array
  if (result && typeof result === "object") {
    // Check if it has a data property (Tensor-like object)
    if ("data" in result) {
      const tensorData = (result as { data: unknown }).data;
      if (
        tensorData instanceof Float32Array ||
        tensorData instanceof Float64Array
      ) {
        return Array.from(tensorData);
      } else if (Array.isArray(tensorData)) {
        return tensorData as number[];
      }
    }
    // Check if it's an array-like object
    if (Array.isArray(result)) {
      return result as unknown as number[];
    }
  }

  // If we get here, the format is unexpected
  console.error("Unexpected embedding result format:", result);
  throw new Error(`Unexpected embedding format: ${typeof result}`);
}

async function initializeLanguage(language: "en" | "pt") {
  if (currentLanguage === language && vectorSearch !== null) {
    return; // Already initialized for this language
  }

  console.log(`[VectorSearchWorker] Initializing for language: ${language}`);

  // Load WASM module if not already loaded
  await initializeWasm();

  // Load embeddings
  const { embeddings, texts, metadata } = await loadEmbeddings(language);

  // Convert Float32Array[] to js_sys::Array for Rust
  // We need to convert each Float32Array to a js_sys::Array
  const embeddingsJsArray = new Array(embeddings.length);
  for (let i = 0; i < embeddings.length; i++) {
    const arr = new Array(embeddings[i].length);
    for (let j = 0; j < embeddings[i].length; j++) {
      arr[j] = embeddings[i][j];
    }
    embeddingsJsArray[i] = arr;
  }

  // Convert metadata to js_sys::Array
  const metadataJsArray = new Array(metadata.length);
  for (let i = 0; i < metadata.length; i++) {
    // Convert metadata object to plain object
    metadataJsArray[i] = JSON.parse(JSON.stringify(metadata[i]));
  }

  vectorSearch = new VectorSearch(
    embeddingsJsArray as any, // Will be converted to js_sys::Array by wasm-bindgen
    texts,
    metadataJsArray as any // Will be converted to js_sys::Array by wasm-bindgen
  );

  currentLanguage = language;
  console.log(
    `[VectorSearchWorker] Initialized with ${embeddings.length} embeddings`
  );
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  try {
    const request = event.data;

    if (request.type === "init") {
      await initializeLanguage(request.language);
      const response: WorkerResponse = {
        type: "init-complete",
        language: request.language,
      };
      self.postMessage(response);
      return;
    }

    if (request.type === "search") {
      const searchRequest = request as WorkerSearchRequest;

      // Ensure we're initialized for the correct language
      if (currentLanguage !== searchRequest.language || vectorSearch === null) {
        await initializeLanguage(searchRequest.language);
      }

      if (!vectorSearch) {
        throw new Error("VectorSearch not initialized");
      }

      // Generate query embedding in the worker
      console.log(
        `[VectorSearchWorker] Generating embedding for query: "${searchRequest.query}"`
      );
      const queryEmbedding = await generateQueryEmbedding(searchRequest.query);

      // Perform search with generated query embedding
      const topK = searchRequest.topK || 5;
      // Convert query embedding array to format expected by WASM
      const queryArray = new Array(queryEmbedding.length);
      for (let i = 0; i < queryEmbedding.length; i++) {
        queryArray[i] = queryEmbedding[i];
      }

      const resultsJsValue = vectorSearch.search(queryArray as any, topK);

      // Convert JsValue (which is a js_sys::Array) to regular array
      const resultsArray = Array.from(resultsJsValue as any) as any[];
      const results: SearchResult[] = resultsArray.map((result: any) => ({
        text: result.text || "",
        score: result.score || 0,
        metadata: result.metadata || {},
      }));

      const response: WorkerSearchResponse = {
        type: "results",
        results,
      };

      self.postMessage(response);
      return;
    }
  } catch (error) {
    const errorResponse: WorkerErrorResponse = {
      type: "error",
      error: error instanceof Error ? error.message : String(error),
    };
    self.postMessage(errorResponse);
  }
};

// Export for TypeScript
export {};
