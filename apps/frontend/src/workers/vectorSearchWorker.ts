import init, { VectorSearch } from "../lib/vectorSearch/wasm/vector_search.js";
import type {
  WorkerRequest,
  WorkerResponse,
  WorkerSearchRequest,
  WorkerSearchResponse,
  WorkerErrorResponse,
  SearchResult,
} from "../lib/vectorSearch/types.js";

let vectorSearch: VectorSearch | null = null;
let currentLanguage: "en" | "pt" | null = null;

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
  const textIndexResponse = await fetch(`/embeddings/${language}-text-index.json`);
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
    const textChunk = textIndex.chunks.find((c: { id: string }) => c.id === chunk.id);
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

      // Perform search with provided query embedding
      const topK = searchRequest.topK || 5;
      // Convert query embedding array to format expected by WASM
      const queryArray = new Array(searchRequest.queryEmbedding.length);
      for (let i = 0; i < searchRequest.queryEmbedding.length; i++) {
        queryArray[i] = searchRequest.queryEmbedding[i];
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

