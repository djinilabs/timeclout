import { vi } from "vitest";

// Mock URL.createObjectURL since it's not available in the test environment
globalThis.URL.createObjectURL = vi.fn(() => "mock-url");
globalThis.URL.revokeObjectURL = vi.fn();
