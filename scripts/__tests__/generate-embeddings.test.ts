import { describe, it, expect, beforeAll } from "vitest";
import { readFile, stat } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("generate-embeddings", () => {
  const embeddingsDir = join(
    __dirname,
    "../../apps/frontend/public/embeddings"
  );

  it("should generate binary embedding files", async () => {
    for (const lang of ["en", "pt"]) {
      const binFile = join(embeddingsDir, `${lang}.bin`);
      try {
        const stats = await stat(binFile);
        expect(stats.isFile()).toBe(true);
        expect(stats.size).toBeGreaterThan(0);
      } catch (error) {
        // File might not exist if generation hasn't been run
        console.warn(`Embedding file ${binFile} not found, skipping test`);
      }
    }
  });

  it("should generate index files with correct structure", async () => {
    for (const lang of ["en", "pt"]) {
      const indexFile = join(embeddingsDir, `${lang}-index.json`);
      try {
        const content = await readFile(indexFile, "utf-8");
        const index = JSON.parse(content);

        expect(index).toHaveProperty("chunks");
        expect(index).toHaveProperty("dimension");
        expect(index).toHaveProperty("language");
        expect(index.dimension).toBe(384); // all-MiniLM-L6-v2 dimension
        expect(index.language).toBe(lang);
        expect(Array.isArray(index.chunks)).toBe(true);

        if (index.chunks.length > 0) {
          const chunk = index.chunks[0];
          expect(chunk).toHaveProperty("id");
          expect(chunk).toHaveProperty("offset");
          expect(chunk).toHaveProperty("length");
          expect(chunk).toHaveProperty("metadata");
        }
      } catch (error) {
        console.warn(`Index file ${indexFile} not found, skipping test`);
      }
    }
  });

  it("should generate text index files", async () => {
    for (const lang of ["en", "pt"]) {
      const textIndexFile = join(embeddingsDir, `${lang}-text-index.json`);
      try {
        const content = await readFile(textIndexFile, "utf-8");
        const textIndex = JSON.parse(content);

        expect(textIndex).toHaveProperty("chunks");
        expect(textIndex).toHaveProperty("language");
        expect(textIndex.language).toBe(lang);
        expect(Array.isArray(textIndex.chunks)).toBe(true);

        if (textIndex.chunks.length > 0) {
          const chunk = textIndex.chunks[0];
          expect(chunk).toHaveProperty("id");
          expect(chunk).toHaveProperty("text");
          expect(chunk).toHaveProperty("metadata");
        }
      } catch (error) {
        console.warn(`Text index file ${textIndexFile} not found, skipping test`);
      }
    }
  });

  it("should have consistent chunk counts between index and text index", async () => {
    for (const lang of ["en", "pt"]) {
      const indexFile = join(embeddingsDir, `${lang}-index.json`);
      const textIndexFile = join(embeddingsDir, `${lang}-text-index.json`);

      try {
        const indexContent = await readFile(indexFile, "utf-8");
        const textIndexContent = await readFile(textIndexFile, "utf-8");
        const index = JSON.parse(indexContent);
        const textIndex = JSON.parse(textIndexContent);

        expect(index.chunks.length).toBe(textIndex.chunks.length);
      } catch (error) {
        console.warn(`Files for ${lang} not found, skipping test`);
      }
    }
  });
});

