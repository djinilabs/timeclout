import { test,  } from "@playwright/test";

import { PageObjects, createPageObjects } from "../utils/page-objects";
import { TestHelpers, createTestHelpers } from "../utils/test-helpers";
import {
  UserManagement,
  createUserManagement,
  
} from "../utils/user-management";

// Export the test object and expect


// Export user management types and utilities



// Export test helpers


// Export page objects


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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(userManagement);
  },
  testHelpers: async ({ userManagement }, use) => {
    const testHelpers = createTestHelpers(userManagement);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(testHelpers);
  },
  pageObjects: async ({ page }, use) => {
    const pageObjects = createPageObjects(page);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(pageObjects);
  },
});

export {expect, test} from "@playwright/test";
export {type TestUser, UserManagement, createUserManagement} from "../utils/user-management";
export {TestHelpers, createTestHelpers} from "../utils/test-helpers";
export {PageObjects, createPageObjects} from "../utils/page-objects";