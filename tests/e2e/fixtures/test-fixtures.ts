import { test, expect } from "@playwright/test";

// Export the test object and expect
export { test, expect };

// Helper functions for common test operations
export async function setupTestEnvironment(): Promise<void> {
  console.log("Setting up test environment...");
  // No specific setup needed for magic link testing
}

export async function teardownTestEnvironment(): Promise<void> {
  console.log("Tearing down test environment...");
  // No specific cleanup needed for magic link testing
}
