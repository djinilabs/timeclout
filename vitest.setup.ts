import { vi } from "vitest";

// Mock URL.createObjectURL since it's not available in the test environment
global.URL.createObjectURL = vi.fn(() => "mock-url");
global.URL.revokeObjectURL = vi.fn();
