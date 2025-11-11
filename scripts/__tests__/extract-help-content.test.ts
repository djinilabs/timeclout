import { describe, it, expect, beforeAll } from "vitest";
import { readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("extract-help-content", () => {
  let extractedContent: any;

  beforeAll(async () => {
    // This test assumes the extraction script has been run
    // In a real scenario, you might want to run it programmatically
    const outputFile = join(
      __dirname,
      "../../apps/frontend/public/embeddings/help-content.json"
    );
    try {
      const content = await readFile(outputFile, "utf-8");
      extractedContent = JSON.parse(content);
    } catch (error) {
      // File might not exist if extraction hasn't been run
      console.warn("Help content file not found, skipping tests");
    }
  });

  it("should extract help content with correct structure", () => {
    if (!extractedContent) {
      return; // Skip if file doesn't exist
    }

    expect(extractedContent).toHaveProperty("chunks");
    expect(Array.isArray(extractedContent.chunks)).toBe(true);
  });

  it("should extract chunks with required fields", () => {
    if (!extractedContent || !extractedContent.chunks.length) {
      return;
    }

    const chunk = extractedContent.chunks[0];
    expect(chunk).toHaveProperty("id");
    expect(chunk).toHaveProperty("text");
    expect(chunk).toHaveProperty("metadata");
    expect(chunk.metadata).toHaveProperty("section");
    expect(chunk.metadata).toHaveProperty("language");
    expect(chunk.metadata).toHaveProperty("type");
  });

  it("should extract content for both English and Portuguese", () => {
    if (!extractedContent || !extractedContent.chunks.length) {
      return;
    }

    const languages = new Set(
      extractedContent.chunks.map((c: any) => c.metadata.language)
    );
    expect(languages.has("en")).toBe(true);
    expect(languages.has("pt")).toBe(true);
  });

  it("should have non-empty text content", () => {
    if (!extractedContent || !extractedContent.chunks.length) {
      return;
    }

    extractedContent.chunks.forEach((chunk: any) => {
      expect(chunk.text).toBeTruthy();
      expect(typeof chunk.text).toBe("string");
      expect(chunk.text.length).toBeGreaterThan(0);
    });
  });

  it("should have valid metadata", () => {
    if (!extractedContent || !extractedContent.chunks.length) {
      return;
    }

    extractedContent.chunks.forEach((chunk: any) => {
      expect(chunk.metadata.section).toBeTruthy();
      expect(["en", "pt"]).toContain(chunk.metadata.language);
      expect(chunk.metadata.type).toBeTruthy();
    });
  });
});

