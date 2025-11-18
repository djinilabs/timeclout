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

// In-memory cache for embeddings
// Key format: `${documentId}:${snippetHash}`
// Value: embedding vector (number[])
const embeddingCache = new Map<string, number[]>();

// Cache for document content and snippets
// Key format: `${documentId}`
// Value: { content: string, snippets: string[], lastModified: number }
interface DocumentCacheEntry {
  content: string;
  snippets: string[];
  lastModified: number;
}
const documentCache = new Map<string, DocumentCacheEntry>();

// Promise-based locking mechanism to prevent concurrent indexing
let indexingPromise: Promise<void> | null = null;

/**
 * Generate a hash for a snippet to use as cache key
 */
async function hashSnippet(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, 16);
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
    const separatorLength = currentChunk.length > 0 ? PARAGRAPH_SEPARATOR_LENGTH : 0;
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
 * Perform indexing: split documents into snippets and generate embeddings
 */
async function performIndexing(apiUrl: string): Promise<void> {
  // Process all documents: split into snippets
  const documentSnippets: Array<{
    documentId: string;
    documentName: string;
    snippetText: string;
    snippetHash: string;
    snippetIndex: number;
  }> = [];

  for (const doc of documents) {
    // Check document cache first
    const docCacheKey = getDocumentCacheKey(doc.id);
    const cachedDoc = documentCache.get(docCacheKey);
    let snippets: string[];

    if (cachedDoc) {
      snippets = cachedDoc.snippets;
    } else {
      const contentText = doc.content;
      snippets = splitDocumentIntoSnippets(contentText);

      // Cache the document content and snippets
      documentCache.set(docCacheKey, {
        content: contentText,
        snippets,
        lastModified: Date.now(),
      });
    }

    // Collect all snippets that need embeddings
    for (let snippetIndex = 0; snippetIndex < snippets.length; snippetIndex++) {
      const snippetText = snippets[snippetIndex];
      const snippetHash = await hashSnippet(snippetText);
      const snippetCacheKey = getSnippetCacheKey(doc.id, snippetHash);

      // Skip if embedding is already cached
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
  }

  // Generate embeddings in parallel
  const embeddingPromises = documentSnippets.map(
    async ({ documentName, snippetText, snippetHash, documentId }) => {
      try {
        const snippetCacheKey = getSnippetCacheKey(documentId, snippetHash);
        const embedding = await generateEmbedding(snippetText, apiUrl);
        embeddingCache.set(snippetCacheKey, embedding);
        return { success: true, documentName };
      } catch (error) {
        console.error(
          `[performIndexing] Failed to generate embedding for snippet in document ${documentName}:`,
          error
        );
        return { success: false, documentName, error };
      }
    }
  );

  // Wait for all embeddings to complete (or fail)
  await Promise.allSettled(embeddingPromises);
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
  // Ensure indexing is complete
  if (indexingPromise) {
    await indexingPromise;
  } else {
    // Start indexing if not already done
    indexingPromise = performIndexing(apiUrl);
    await indexingPromise;
  }

  // Get all cached embeddings
  const snippetEmbeddings: Array<{
    snippet: DocumentSnippet;
    embedding: number[];
  }> = [];

  // Reconstruct embeddings from cache
  for (const doc of documents) {
    const docCacheKey = getDocumentCacheKey(doc.id);
    const cachedDoc = documentCache.get(docCacheKey);

    if (cachedDoc) {
      for (const snippetText of cachedDoc.snippets) {
        const snippetHash = await hashSnippet(snippetText);
        const snippetCacheKey = getSnippetCacheKey(doc.id, snippetHash);
        const embedding = embeddingCache.get(snippetCacheKey);

        if (embedding) {
          snippetEmbeddings.push({
            snippet: {
              text: snippetText,
              documentId: doc.id,
              documentName: doc.name,
            },
            embedding,
          });
        }
      }
    }
  }

  if (snippetEmbeddings.length === 0) {
    return [];
  }

  // Calculate similarity scores
  const results: SearchResult[] = snippetEmbeddings.map(
    ({ snippet, embedding }) => {
      const similarity = cosineSimilarity(queryEmbedding, embedding);
      return {
        snippet: snippet.text,
        documentName: snippet.documentName,
        documentId: snippet.documentId,
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
 * Handle messages from main thread
 */
self.addEventListener("message", async (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  try {
    if (message.type === "search") {
      // Generate query embedding
      const queryEmbedding = await generateEmbedding(message.query, message.apiUrl);

      // Perform search
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
      // Perform indexing
      await performIndexing(message.apiUrl);

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

