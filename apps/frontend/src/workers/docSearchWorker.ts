// Import marketing docs as raw text
import docMarketing01ProductOverview from "@/docs/marketing/01-product-overview.md?raw";
import docMarketing02CoreFeatures from "@/docs/marketing/02-core-features.md?raw";
import docMarketing03UseCases from "@/docs/marketing/03-use-cases-and-industries.md?raw";
import docMarketing04CompetitiveAdvantages from "@/docs/marketing/04-competitive-advantages.md?raw";
import docMarketing05UserWorkflows from "@/docs/marketing/05-user-workflows.md?raw";
import docMarketing06BenefitsAndROI from "@/docs/marketing/06-benefits-and-roi.md?raw";
import docMarketingREADME from "@/docs/marketing/README.md?raw";
// Import product docs as raw text
import docProduct01ProductOverview from "@/docs/product/01-product-overview.md?raw";
import docProduct02KeyFeatures from "@/docs/product/02-key-features.md?raw";
import docProduct03CommonQuestions from "@/docs/product/03-common-questions.md?raw";
import docProduct04UserWorkflows from "@/docs/product/04-user-workflows.md?raw";
import docProduct05Troubleshooting from "@/docs/product/05-troubleshooting.md?raw";
import docProduct06AccountManagement from "@/docs/product/06-account-management.md?raw";
import docProductREADME from "@/docs/product/README.md?raw";

// Default chunk size for splitting documents.
// 2000 characters is chosen to balance context and granularity: it fits comfortably within the input limits of most embedding models,
// provides enough context for semantic search, and avoids excessive fragmentation of the document.
const DEFAULT_CHUNK_SIZE = 2000;

// Minimum acceptable chunk size as a percentage when breaking at sentence boundaries
const MIN_CHUNK_RATIO = 0.5;

// Length of paragraph separator ("\n\n")
const PARAGRAPH_SEPARATOR_LENGTH = 2;

// IndexedDB configuration
const DB_NAME = "docSearchCache";
const DB_VERSION = 1;
const STORE_EMBEDDINGS = "embeddings";
const STORE_DOCUMENTS = "documents";
const STORE_SNIPPETS = "snippets"; // Pre-built array of all snippets with embeddings

// Check if IndexedDB is available
const INDEXEDDB_AVAILABLE = typeof self !== "undefined" && "indexedDB" in self;

// In-memory cache for embeddings (fallback if IndexedDB unavailable)
// Key format: `${documentId}:${snippetHash}`
// Value: embedding vector (number[])
const embeddingCache = new Map<string, number[]>();

// Cache for document content and snippets
// Key format: `${documentId}`
// Value: { content: string, snippets: string[], snippetHashes: string[], lastModified: number }
interface DocumentCacheEntry {
  content: string;
  snippets: string[];
  snippetHashes: string[]; // Pre-computed hashes to avoid recomputation
  lastModified: number;
}
const documentCache = new Map<string, DocumentCacheEntry>();

// Pre-built array of all snippets with embeddings for fast search
// Built once during indexing, stored in IndexedDB
interface SnippetWithEmbedding {
  hash: string;
  text: string;
  documentId: string;
  documentName: string;
  embedding: number[];
}
let allSnippetsWithEmbeddings: SnippetWithEmbedding[] = [];

// Promise-based locking mechanism to prevent concurrent indexing
let indexingPromise: Promise<void> | null = null;

// IndexedDB database instance
let db: IDBDatabase | null = null;

/**
 * Generate a hash for a snippet to use as cache key
 */
async function hashSnippet(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 16);
}

/**
 * Get cache key for a document snippet
 */
function getSnippetCacheKey(documentId: string, snippetHash: string): string {
  return `${documentId}:${snippetHash}`;
}

/**
 * Get cache key for a document
 */
function getDocumentCacheKey(documentId: string): string {
  return documentId;
}

/**
 * Initialize IndexedDB database
 */
async function initIndexedDB(): Promise<IDBDatabase> {
  if (!INDEXEDDB_AVAILABLE) {
    throw new Error("IndexedDB is not available");
  }

  if (db) {
    return db;
  }

  return new Promise((resolve, reject) => {
    const request = self.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error}`));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create embeddings store if it doesn't exist
      if (!database.objectStoreNames.contains(STORE_EMBEDDINGS)) {
        const embeddingStore = database.createObjectStore(STORE_EMBEDDINGS, {
          keyPath: "key",
        });
        embeddingStore.createIndex("documentId", "documentId", {
          unique: false,
        });
      }

      // Create documents store if it doesn't exist
      if (!database.objectStoreNames.contains(STORE_DOCUMENTS)) {
        database.createObjectStore(STORE_DOCUMENTS, { keyPath: "documentId" });
      }

      // Create snippets array store if it doesn't exist
      if (!database.objectStoreNames.contains(STORE_SNIPPETS)) {
        database.createObjectStore(STORE_SNIPPETS, { keyPath: "id" });
      }
    };
  });
}

/**
 * Load embeddings from IndexedDB
 */
async function loadEmbeddingsFromIndexedDB(): Promise<void> {
  if (!INDEXEDDB_AVAILABLE) {
    return;
  }

  try {
    const database = await initIndexedDB();
    const transaction = database.transaction([STORE_EMBEDDINGS], "readonly");
    const store = transaction.objectStore(STORE_EMBEDDINGS);
    const request = store.getAll();

    await new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {
        const results = request.result as Array<{
          key: string;
          embedding: number[];
        }>;
        for (const result of results) {
          embeddingCache.set(result.key, result.embedding);
        }
        resolve();
      };
      request.onerror = () => {
        reject(new Error(`Failed to load embeddings: ${request.error}`));
      };
    });
  } catch (error) {
    console.warn(
      "[loadEmbeddingsFromIndexedDB] Failed to load embeddings:",
      error
    );
  }
}

/**
 * Save embedding to IndexedDB
 */
async function saveEmbeddingToIndexedDB(
  key: string,
  embedding: number[],
  documentId: string
): Promise<void> {
  if (!INDEXEDDB_AVAILABLE) {
    return;
  }

  try {
    const database = await initIndexedDB();
    const transaction = database.transaction([STORE_EMBEDDINGS], "readwrite");
    const store = transaction.objectStore(STORE_EMBEDDINGS);
    store.put({ key, embedding, documentId });
  } catch (error) {
    console.warn("[saveEmbeddingToIndexedDB] Failed to save embedding:", error);
  }
}

/**
 * Load document cache from IndexedDB
 */
async function loadDocumentCacheFromIndexedDB(): Promise<void> {
  if (!INDEXEDDB_AVAILABLE) {
    return;
  }

  try {
    const database = await initIndexedDB();
    const transaction = database.transaction([STORE_DOCUMENTS], "readonly");
    const store = transaction.objectStore(STORE_DOCUMENTS);
    const request = store.getAll();

    await new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {
        const results = request.result as Array<{
          documentId: string;
          content: string;
          snippets: string[];
          snippetHashes: string[];
          lastModified: number;
        }>;
        for (const result of results) {
          documentCache.set(result.documentId, {
            content: result.content,
            snippets: result.snippets,
            snippetHashes: result.snippetHashes || [],
            lastModified: result.lastModified,
          });
        }
        resolve();
      };
      request.onerror = () => {
        reject(new Error(`Failed to load document cache: ${request.error}`));
      };
    });
  } catch (error) {
    console.warn(
      "[loadDocumentCacheFromIndexedDB] Failed to load document cache:",
      error
    );
  }
}

/**
 * Save document cache to IndexedDB
 */
async function saveDocumentCacheToIndexedDB(
  documentId: string,
  entry: DocumentCacheEntry
): Promise<void> {
  if (!INDEXEDDB_AVAILABLE) {
    return;
  }

  try {
    const database = await initIndexedDB();
    const transaction = database.transaction([STORE_DOCUMENTS], "readwrite");
    const store = transaction.objectStore(STORE_DOCUMENTS);
    store.put({
      documentId,
      ...entry,
    });
  } catch (error) {
    console.warn(
      "[saveDocumentCacheToIndexedDB] Failed to save document cache:",
      error
    );
  }
}

/**
 * Load pre-built snippets array from IndexedDB
 */
async function loadSnippetsArrayFromIndexedDB(): Promise<void> {
  if (!INDEXEDDB_AVAILABLE) {
    return;
  }

  try {
    const database = await initIndexedDB();
    const transaction = database.transaction([STORE_SNIPPETS], "readonly");
    const store = transaction.objectStore(STORE_SNIPPETS);
    const request = store.get("all");

    await new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result as
          | { id: string; snippets: SnippetWithEmbedding[] }
          | undefined;
        if (result?.snippets) {
          allSnippetsWithEmbeddings = result.snippets;
        }
        resolve();
      };
      request.onerror = () => {
        reject(new Error(`Failed to load snippets array: ${request.error}`));
      };
    });
  } catch (error) {
    console.warn(
      "[loadSnippetsArrayFromIndexedDB] Failed to load snippets array:",
      error
    );
  }
}

/**
 * Save pre-built snippets array to IndexedDB
 */
async function saveSnippetsArrayToIndexedDB(
  snippets: SnippetWithEmbedding[]
): Promise<void> {
  if (!INDEXEDDB_AVAILABLE) {
    return;
  }

  try {
    const database = await initIndexedDB();
    const transaction = database.transaction([STORE_SNIPPETS], "readwrite");
    const store = transaction.objectStore(STORE_SNIPPETS);
    store.put({ id: "all", snippets });
  } catch (error) {
    console.warn(
      "[saveSnippetsArrayToIndexedDB] Failed to save snippets array:",
      error
    );
  }
}

export interface DocumentSnippet {
  text: string;
  documentId: string;
  documentName: string;
}

export interface SearchResult {
  snippet: string;
  documentName: string;
  documentId: string;
  similarity: number;
}

/**
 * Split document content into text snippets
 * Combines multiple paragraphs together to create larger snippets (up to chunkSize)
 * Only splits if a single paragraph exceeds chunkSize
 */
export function splitDocumentIntoSnippets(
  content: string,
  chunkSize: number = DEFAULT_CHUNK_SIZE
): string[] {
  if (!content || content.trim().length === 0) {
    return [];
  }

  const snippets: string[] = [];

  // Split by paragraphs (double newlines or single newline followed by content)
  // This captures both markdown-style paragraphs and regular text paragraphs
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) {
    // If no paragraphs found, split by character count
    let start = 0;
    while (start < content.length) {
      const end = Math.min(start + chunkSize, content.length);
      const chunk = content.slice(start, end).trim();
      if (chunk.length > 0) {
        snippets.push(chunk);
      }
      start = end;
    }
    return snippets;
  }

  // Combine paragraphs into chunks
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const paragraph of paragraphs) {
    const paragraphLength = paragraph.length;

    // If a single paragraph exceeds chunkSize, split it first
    if (paragraphLength > chunkSize) {
      // Save current chunk if it has content
      if (currentChunk.length > 0) {
        snippets.push(currentChunk.join("\n\n"));
        currentChunk = [];
        currentLength = 0;
      }

      // Split the large paragraph
      let start = 0;
      while (start < paragraphLength) {
        let end = start + chunkSize;

        // Try to break at sentence boundaries if possible
        if (end < paragraphLength) {
          const lastPeriod = paragraph.lastIndexOf(".", end);
          const lastNewline = paragraph.lastIndexOf("\n", end);
          const breakPoint = Math.max(lastPeriod, lastNewline);

          if (breakPoint > start + chunkSize * MIN_CHUNK_RATIO) {
            // Use sentence/line break if it's not too early
            end = breakPoint + 1;
          }
        }

        const chunk = paragraph.slice(start, end).trim();
        if (chunk.length > 0) {
          snippets.push(chunk);
        }
        start = end;
      }
      continue;
    }

    // Check if adding this paragraph would exceed chunkSize
    const separatorLength =
      currentChunk.length > 0 ? PARAGRAPH_SEPARATOR_LENGTH : 0;
    if (
      currentLength + separatorLength + paragraphLength > chunkSize &&
      currentChunk.length > 0
    ) {
      // Save current chunk and start a new one
      snippets.push(currentChunk.join("\n\n"));
      currentChunk = [paragraph];
      currentLength = paragraphLength;
    } else {
      // Add paragraph to current chunk
      currentChunk.push(paragraph);
      currentLength += separatorLength + paragraphLength;
    }
  }

  // Add the last chunk if it has content
  if (currentChunk.length > 0) {
    snippets.push(currentChunk.join("\n\n"));
  }

  return snippets.filter((s) => s.length > 0);
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Generate embedding for text using lambda function
 */
async function generateEmbedding(
  text: string,
  apiUrl: string
): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error("Text cannot be empty");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
    body: JSON.stringify({ text: text.trim() }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to generate embedding: ${response.status} ${errorText}`
    );
  }

  const data = (await response.json()) as { embedding?: number[] };

  if (!data.embedding) {
    throw new Error("Invalid embedding response format");
  }

  return data.embedding;
}

/**
 * Document definitions
 */
const documents = [
  // Marketing docs
  {
    id: "marketing-01-product-overview",
    name: "Marketing: Product Overview",
    content: docMarketing01ProductOverview,
  },
  {
    id: "marketing-02-core-features",
    name: "Marketing: Core Features",
    content: docMarketing02CoreFeatures,
  },
  {
    id: "marketing-03-use-cases-and-industries",
    name: "Marketing: Use Cases and Industries",
    content: docMarketing03UseCases,
  },
  {
    id: "marketing-04-competitive-advantages",
    name: "Marketing: Competitive Advantages",
    content: docMarketing04CompetitiveAdvantages,
  },
  {
    id: "marketing-05-user-workflows",
    name: "Marketing: User Workflows",
    content: docMarketing05UserWorkflows,
  },
  {
    id: "marketing-06-benefits-and-roi",
    name: "Marketing: Benefits and ROI",
    content: docMarketing06BenefitsAndROI,
  },
  {
    id: "marketing-README",
    name: "Marketing Documentation",
    content: docMarketingREADME,
  },
  // Product docs
  {
    id: "product-01-product-overview",
    name: "Product: Product Overview",
    content: docProduct01ProductOverview,
  },
  {
    id: "product-02-key-features",
    name: "Product: Key Features",
    content: docProduct02KeyFeatures,
  },
  {
    id: "product-03-common-questions",
    name: "Product: Common Questions",
    content: docProduct03CommonQuestions,
  },
  {
    id: "product-04-user-workflows",
    name: "Product: User Workflows",
    content: docProduct04UserWorkflows,
  },
  {
    id: "product-05-troubleshooting",
    name: "Product: Troubleshooting",
    content: docProduct05Troubleshooting,
  },
  {
    id: "product-06-account-management",
    name: "Product: Account Management",
    content: docProduct06AccountManagement,
  },
  {
    id: "product-README",
    name: "Product Documentation",
    content: docProductREADME,
  },
];

/**
 * Process a single document: split into snippets and collect snippets that need embeddings
 */
async function processDocument(doc: {
  id: string;
  name: string;
  content: string;
}): Promise<
  Array<{
    documentId: string;
    documentName: string;
    snippetText: string;
    snippetHash: string;
    snippetIndex: number;
  }>
> {
  const documentSnippets: Array<{
    documentId: string;
    documentName: string;
    snippetText: string;
    snippetHash: string;
    snippetIndex: number;
  }> = [];

  // Check document cache first
  const docCacheKey = getDocumentCacheKey(doc.id);
  const cachedDoc = documentCache.get(docCacheKey);
  let snippets: string[];
  let snippetHashes: string[];

  if (cachedDoc && cachedDoc.snippetHashes.length > 0) {
    // Use cached snippets and hashes
    snippets = cachedDoc.snippets;
    snippetHashes = cachedDoc.snippetHashes;
  } else {
    const contentText = doc.content;
    snippets = splitDocumentIntoSnippets(contentText);

    // Pre-compute all hashes in parallel
    snippetHashes = await Promise.all(
      snippets.map((snippetText) => hashSnippet(snippetText))
    );

    // Cache the document content, snippets, and hashes
    const cacheEntry: DocumentCacheEntry = {
      content: contentText,
      snippets,
      snippetHashes,
      lastModified: Date.now(),
    };
    documentCache.set(docCacheKey, cacheEntry);
    await saveDocumentCacheToIndexedDB(doc.id, cacheEntry);
  }

  // Collect all snippets that need embeddings
  for (let snippetIndex = 0; snippetIndex < snippets.length; snippetIndex++) {
    const snippetText = snippets[snippetIndex];
    const snippetHash = snippetHashes[snippetIndex];
    const snippetCacheKey = getSnippetCacheKey(doc.id, snippetHash);

    // Check both in-memory cache and IndexedDB
    if (embeddingCache.has(snippetCacheKey)) {
      continue;
    }

    documentSnippets.push({
      documentId: doc.id,
      documentName: doc.name,
      snippetText,
      snippetHash,
      snippetIndex,
    });
  }

  return documentSnippets;
}

/**
 * Generate embedding with timeout and error handling
 */
async function generateEmbeddingWithRetry(
  snippetText: string,
  snippetHash: string,
  documentId: string,
  documentName: string,
  apiUrl: string,
  timeoutMs: number = 30000
): Promise<{
  success: boolean;
  documentId?: string;
  documentName?: string;
  snippetText?: string;
  snippetHash?: string;
  embedding?: number[];
  error?: unknown;
}> {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(`Embedding generation timed out after ${timeoutMs}ms`)
        );
      }, timeoutMs);
    });

    // Race between embedding generation and timeout
    const snippetCacheKey = getSnippetCacheKey(documentId, snippetHash);
    const embedding = await Promise.race([
      generateEmbedding(snippetText, apiUrl),
      timeoutPromise,
    ]);

    // Save to both in-memory cache and IndexedDB
    embeddingCache.set(snippetCacheKey, embedding);
    await saveEmbeddingToIndexedDB(snippetCacheKey, embedding, documentId);

    return {
      success: true,
      documentId,
      documentName,
      snippetText,
      snippetHash,
      embedding,
    };
  } catch (error) {
    console.error(
      `[generateEmbeddingWithRetry] Failed to generate embedding for snippet in document ${documentName}:`,
      error
    );
    return { success: false, documentName, error };
  }
}

/**
 * Process embeddings with concurrency control using a semaphore pattern
 */
async function processEmbeddingsWithConcurrency(
  documentSnippets: Array<{
    documentId: string;
    documentName: string;
    snippetText: string;
    snippetHash: string;
    snippetIndex: number;
  }>,
  apiUrl: string,
  concurrency: number = 20
): Promise<
  Array<{
    documentId: string;
    documentName: string;
    snippetText: string;
    snippetHash: string;
    embedding: number[];
  }>
> {
  const results: Array<{
    documentId: string;
    documentName: string;
    snippetText: string;
    snippetHash: string;
    embedding: number[];
  }> = [];

  if (documentSnippets.length === 0) {
    return results;
  }

  // Semaphore to control concurrency
  let active = 0;
  let index = 0;
  let completed = 0;

  return new Promise((resolve) => {
    const processNext = () => {
      // Process items while we have capacity and items remaining
      while (active < concurrency && index < documentSnippets.length) {
        const snippet = documentSnippets[index++];
        active++;

        generateEmbeddingWithRetry(
          snippet.snippetText,
          snippet.snippetHash,
          snippet.documentId,
          snippet.documentName,
          apiUrl
        )
          .then((result) => {
            if (result.success && result.embedding) {
              results.push({
                documentId: result.documentId!,
                documentName: result.documentName!,
                snippetText: result.snippetText!,
                snippetHash: result.snippetHash!,
                embedding: result.embedding,
              });
            }
          })
          .catch((error) => {
            console.error(
              `[processEmbeddingsWithConcurrency] Error processing embedding:`,
              error
            );
          })
          .finally(() => {
            active--;
            completed++;
            // If all items are processed, resolve
            if (completed === documentSnippets.length) {
              resolve(results);
            } else {
              // Process next item
              processNext();
            }
          });
      }
    };

    // Start processing
    processNext();
  });
}

/**
 * Perform indexing: split documents into snippets and generate embeddings
 */
async function performIndexing(apiUrl: string): Promise<void> {
  // Process all documents in parallel
  const documentSnippetsArrays = await Promise.all(
    documents.map((doc) => processDocument(doc))
  );

  // Flatten all snippets that need embeddings
  const documentSnippets = documentSnippetsArrays.flat();

  // Process all embeddings in parallel with concurrency control
  // Backend handles throttling/backoff, so we can use higher concurrency
  const CONCURRENCY = 20; // Process up to 20 embeddings concurrently
  await processEmbeddingsWithConcurrency(documentSnippets, apiUrl, CONCURRENCY);

  // Build the pre-computed snippets array for fast search
  allSnippetsWithEmbeddings = [];

  for (const doc of documents) {
    const docCacheKey = getDocumentCacheKey(doc.id);
    const cachedDoc = documentCache.get(docCacheKey);

    if (cachedDoc) {
      for (let i = 0; i < cachedDoc.snippets.length; i++) {
        const snippetText = cachedDoc.snippets[i];
        const snippetHash = cachedDoc.snippetHashes[i];
        const snippetCacheKey = getSnippetCacheKey(doc.id, snippetHash);
        const embedding = embeddingCache.get(snippetCacheKey);

        if (embedding) {
          allSnippetsWithEmbeddings.push({
            hash: snippetHash,
            text: snippetText,
            documentId: doc.id,
            documentName: doc.name,
            embedding,
          });
        }
      }
    }
  }

  // Save the pre-built array to IndexedDB
  await saveSnippetsArrayToIndexedDB(allSnippetsWithEmbeddings);
}

/**
 * Perform the actual search using cached embeddings
 */
async function performSearch(
  _query: string,
  queryEmbedding: number[],
  topN: number,
  apiUrl: string
): Promise<SearchResult[]> {
  // Ensure indexing is complete - all searches wait for indexing
  if (indexingPromise) {
    await indexingPromise;
  } else {
    // Start indexing if not already done
    indexingPromise = performIndexing(apiUrl);
    await indexingPromise;
  }

  // Use pre-built array for fast search (no hash computation needed)
  if (allSnippetsWithEmbeddings.length === 0) {
    return [];
  }

  // Calculate similarity scores using pre-built array
  const results: SearchResult[] = allSnippetsWithEmbeddings.map(
    ({ text, documentName, documentId, embedding }) => {
      const similarity = cosineSimilarity(queryEmbedding, embedding);
      return {
        snippet: text,
        documentName,
        documentId,
        similarity,
      };
    }
  );

  // Sort by similarity (descending) and return top N
  results.sort((a, b) => b.similarity - a.similarity);
  const topResults = results.slice(0, topN);

  return topResults;
}

/**
 * Worker message types
 */
interface SearchMessage {
  type: "search";
  query: string;
  topN?: number;
  apiUrl: string;
  requestId: string;
}

interface IndexMessage {
  type: "index";
  apiUrl: string;
  requestId: string;
}

type WorkerMessage = SearchMessage | IndexMessage;

interface SearchResponse {
  type: "search-response";
  results: SearchResult[];
  requestId: string;
}

interface ErrorResponse {
  type: "error";
  error: string;
  requestId: string;
}

type WorkerResponse = SearchResponse | ErrorResponse;

/**
 * Initialize worker: load cached data from IndexedDB and start indexing
 */
async function initializeWorker(apiUrl: string): Promise<void> {
  // Load cached data from IndexedDB in parallel
  await Promise.all([
    loadEmbeddingsFromIndexedDB(),
    loadDocumentCacheFromIndexedDB(),
    loadSnippetsArrayFromIndexedDB(),
  ]);

  // Start indexing in background if not already started
  if (!indexingPromise) {
    indexingPromise = performIndexing(apiUrl);
    // Don't await - let it run in background
    indexingPromise.catch((error) => {
      console.error("[initializeWorker] Indexing failed:", error);
    });
  }
}

/**
 * Handle messages from main thread
 */
self.addEventListener("message", async (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  try {
    if (message.type === "search") {
      // Ensure worker is initialized and indexing has started
      if (!indexingPromise) {
        // Initialize worker and start indexing
        await initializeWorker(message.apiUrl);
      }

      // Generate query embedding (can happen in parallel with indexing)
      const queryEmbedding = await generateEmbedding(
        message.query,
        message.apiUrl
      );

      // Perform search (will wait for indexing to complete)
      const results = await performSearch(
        message.query,
        queryEmbedding,
        message.topN || 5,
        message.apiUrl
      );

      const response: SearchResponse = {
        type: "search-response",
        results,
        requestId: message.requestId,
      };

      self.postMessage(response);
    } else if (message.type === "index") {
      // Initialize worker if needed
      if (!indexingPromise) {
        await initializeWorker(message.apiUrl);
      }

      // Wait for indexing to complete
      if (indexingPromise) {
        await indexingPromise;
      }

      const response: WorkerResponse = {
        type: "search-response",
        results: [],
        requestId: message.requestId,
      };

      self.postMessage(response);
    }
  } catch (error) {
    const errorResponse: ErrorResponse = {
      type: "error",
      error: error instanceof Error ? error.message : String(error),
      requestId: message.requestId,
    };

    self.postMessage(errorResponse);
  }
});
