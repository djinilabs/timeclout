import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { pipeline } from "@xenova/transformers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface HelpChunk {
  id: string;
  text: string;
  metadata: {
    section: string;
    language: string;
    feature?: string;
    type: string;
  };
}

interface ExtractedContent {
  chunks: HelpChunk[];
}

interface EmbeddingIndex {
  chunks: Array<{
    id: string;
    offset: number;
    length: number;
    metadata: HelpChunk["metadata"];
  }>;
  dimension: number;
  language: string;
}

/**
 * Convert array to binary format (little-endian float32)
 */
function embeddingsToBinary(embeddings: number[][]): ArrayBuffer {
  const numVectors = embeddings.length;
  const dimension = embeddings[0]?.length || 0;
  const buffer = new ArrayBuffer(numVectors * dimension * 4); // 4 bytes per float32
  const view = new DataView(buffer);

  let offset = 0;
  for (const embedding of embeddings) {
    for (const value of embedding) {
      view.setFloat32(offset, value, true); // true = little-endian
      offset += 4;
    }
  }

  return buffer;
}

/**
 * Generate embeddings for help content chunks
 */
async function generateEmbeddings() {
  const embeddingsDir = join(__dirname, "../apps/frontend/public/embeddings");
  const inputFile = join(embeddingsDir, "help-content.json");
  const outputDir = embeddingsDir;

  console.log("Loading help content...");
  const content: ExtractedContent = JSON.parse(
    await readFile(inputFile, "utf-8")
  );

  console.log(`Found ${content.chunks.length} chunks`);

  // Initialize the embedding model
  console.log("Loading embedding model (this may take a moment on first run)...");
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  const dimension = 384; // all-MiniLM-L6-v2 produces 384-dimensional embeddings

  // Group chunks by language
  const chunksByLanguage: Record<string, HelpChunk[]> = {};
  for (const chunk of content.chunks) {
    const lang = chunk.metadata.language;
    if (!chunksByLanguage[lang]) {
      chunksByLanguage[lang] = [];
    }
    chunksByLanguage[lang].push(chunk);
  }

  // Process each language separately
  for (const [language, chunks] of Object.entries(chunksByLanguage)) {
    console.log(`\nProcessing ${chunks.length} chunks for language: ${language}`);

    const texts = chunks.map((chunk) => chunk.text);
    const embeddings: number[][] = [];

      // Generate embeddings in batches to avoid memory issues
      const batchSize = 32;
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        console.log(
          `  Generating embeddings for batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}...`
        );

        const batchEmbeddings = await extractor(batch, {
          pooling: "mean",
          normalize: true,
        });

        // Convert tensor-like output to arrays
        // @xenova/transformers returns a Tensor object with .data property
        if (Array.isArray(batchEmbeddings)) {
          for (const embedding of batchEmbeddings) {
            if (Array.isArray(embedding)) {
              embeddings.push(embedding);
            } else if (embedding && typeof embedding === "object" && "data" in embedding) {
              embeddings.push(Array.from(embedding.data as number[]));
            } else {
              throw new Error("Unexpected embedding format");
            }
          }
        } else if (batchEmbeddings && typeof batchEmbeddings === "object" && "data" in batchEmbeddings) {
          // Single tensor result - split by batch size
          const data = Array.from(batchEmbeddings.data as number[]);
          const dim = dimension;
          for (let j = 0; j < batch.length; j++) {
            embeddings.push(data.slice(j * dim, (j + 1) * dim));
          }
        } else {
          throw new Error("Unexpected embedding format");
        }
      }

    // Verify all embeddings have correct dimension
    for (let i = 0; i < embeddings.length; i++) {
      if (embeddings[i].length !== dimension) {
        throw new Error(
          `Embedding ${i} has dimension ${embeddings[i].length}, expected ${dimension}`
        );
      }
    }

    console.log(`  Generated ${embeddings.length} embeddings`);

    // Convert to binary format
    const binaryData = embeddingsToBinary(embeddings);
    const outputFile = join(outputDir, `${language}.bin`);

    // Write binary file
    await writeFile(outputFile, Buffer.from(binaryData));

    // Create index file
    const index: EmbeddingIndex = {
      chunks: chunks.map((chunk, idx) => ({
        id: chunk.id,
        offset: idx * dimension * 4, // Offset in bytes
        length: dimension * 4, // Length in bytes
        metadata: chunk.metadata,
      })),
      dimension,
      language,
    };

    const indexFile = join(outputDir, `${language}-index.json`);
    await writeFile(indexFile, JSON.stringify(index, null, 2));

    // Also create a text index for easier debugging
    const textIndex = {
      chunks: chunks.map((chunk, idx) => ({
        id: chunk.id,
        text: chunk.text,
        metadata: chunk.metadata,
        embeddingIndex: idx,
      })),
      language,
    };

    const textIndexFile = join(outputDir, `${language}-text-index.json`);
    await writeFile(textIndexFile, JSON.stringify(textIndex, null, 2));

    console.log(`  Written ${outputFile} (${binaryData.byteLength} bytes)`);
    console.log(`  Written ${indexFile}`);
    console.log(`  Written ${textIndexFile}`);
  }

  console.log("\nEmbedding generation complete!");
}

// Run generation
generateEmbeddings().catch((error) => {
  console.error("Embedding generation failed:", error);
  process.exit(1);
});

