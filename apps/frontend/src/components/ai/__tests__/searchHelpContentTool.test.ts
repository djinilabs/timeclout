import { describe, it, expect, vi, beforeEach } from "vitest";
import { tools } from "../tools";
import { getVectorSearchClient } from "../../../lib/vectorSearch/vectorSearchClient";

// Mock the vector search client
vi.mock("../../../lib/vectorSearch/vectorSearchClient", () => ({
  getVectorSearchClient: vi.fn(),
}));

describe("search_help_content tool", () => {
  const mockClient = {
    search: vi.fn(),
    initialize: vi.fn(),
    terminate: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(getVectorSearchClient).mockReturnValue(mockClient as any);
    mockClient.search.mockResolvedValue([
      {
        text: "Test help content about shifts",
        score: 0.95,
        metadata: {
          section: "shifts-calendar",
          language: "en",
          type: "feature",
        },
      },
    ]);
  });

  it("should be registered in tools", () => {
    const toolSet = tools(() => Promise.resolve(), "en");
    expect(toolSet).toHaveProperty("search_help_content");
  });

  it("should have correct description", () => {
    const toolSet = tools(() => Promise.resolve(), "en");
    const tool = toolSet.search_help_content;
    expect(tool.description).toContain("help documentation");
  });

  it("should execute search and return formatted results", async () => {
    const toolSet = tools(() => Promise.resolve(), "en");
    const tool = toolSet.search_help_content;

    if (!tool.execute) {
      throw new Error("Tool execute function not found");
    }

    const result = await tool.execute({ query: "how to create shifts" });

    expect(mockClient.search).toHaveBeenCalledWith(
      "how to create shifts",
      "en",
      5
    );
    expect(result).toHaveProperty("success");
    if (result && typeof result === "object" && "success" in result) {
      expect(result.success).toBe(true);
    }
  });

  it("should handle empty results", async () => {
    mockClient.search.mockResolvedValueOnce([]);
    const toolSet = tools(() => Promise.resolve(), "en");
    const tool = toolSet.search_help_content;

    if (!tool.execute) {
      throw new Error("Tool execute function not found");
    }

    const result = await tool.execute({ query: "nonexistent query" });

    expect(result).toHaveProperty("success");
    if (result && typeof result === "object" && "success" in result) {
      expect(result.success).toBe(false);
    }
  });

  it("should handle errors gracefully", async () => {
    mockClient.search.mockRejectedValueOnce(new Error("Search failed"));
    const toolSet = tools(() => Promise.resolve(), "en");
    const tool = toolSet.search_help_content;

    if (!tool.execute) {
      throw new Error("Tool execute function not found");
    }

    const result = await tool.execute({ query: "test" });

    expect(result).toHaveProperty("success");
    if (result && typeof result === "object" && "success" in result) {
      expect(result.success).toBe(false);
      expect(result).toHaveProperty("error");
    }
  });

  it("should use provided language parameter", async () => {
    const toolSet = tools(() => Promise.resolve(), "en");
    const tool = toolSet.search_help_content;

    if (!tool.execute) {
      throw new Error("Tool execute function not found");
    }

    await tool.execute({ query: "test", language: "pt" });

    expect(mockClient.search).toHaveBeenCalledWith("test", "pt", 5);
  });

  it("should format results correctly", async () => {
    mockClient.search.mockResolvedValueOnce([
      {
        text: "First result",
        score: 0.95,
        metadata: { section: "test1", language: "en", type: "feature" },
      },
      {
        text: "Second result",
        score: 0.85,
        metadata: { section: "test2", language: "en", type: "section" },
      },
    ]);

    const toolSet = tools(() => Promise.resolve(), "en");
    const tool = toolSet.search_help_content;

    if (!tool.execute) {
      throw new Error("Tool execute function not found");
    }

    const result = await tool.execute({ query: "test" });

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success &&
      "results" in result
    ) {
      expect(result.results).toContain("First result");
      expect(result.results).toContain("Second result");
      expect(result.results).toContain("Section: test1");
      expect(result.results).toContain("Section: test2");
    }
  });
});

