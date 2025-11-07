import { test, expect } from "@playwright/test";

import { PageObjects, createPageObjects } from "../utils/page-objects";
import { TestHelpers, createTestHelpers } from "../utils/test-helpers";
import {
  UserManagement,
  createUserManagement,
  TestUser,
} from "../utils/user-management";

// Export the test object and expect
export { test, expect };

// Export user management types and utilities
export { UserManagement, createUserManagement };
export type { TestUser };

// Export test helpers
export { TestHelpers, createTestHelpers };

// Export page objects
export { PageObjects, createPageObjects };

// Helper functions for common test operations
export async function setupTestEnvironment(): Promise<void> {
  console.log("Setting up test environment...");
  // No specific setup needed for magic link testing
}

export async function teardownTestEnvironment(): Promise<void> {
  console.log("Tearing down test environment...");
  // No specific cleanup needed for magic link testing
}

// Enhanced test fixture that includes user management, test helpers, and page objects
export const testWithUserManagement = test.extend<{
  userManagement: UserManagement;
  testHelpers: TestHelpers;
  pageObjects: PageObjects;
}>({
  userManagement: async ({ page }, use) => {
    const userManagement = createUserManagement(page);

    await use(userManagement);
  },
  testHelpers: async ({ userManagement }, use) => {
    const testHelpers = createTestHelpers(userManagement);

    await use(testHelpers);
  },
  pageObjects: async ({ page }, use) => {
    const pageObjects = createPageObjects(page);

    await use(pageObjects);
  },
});
