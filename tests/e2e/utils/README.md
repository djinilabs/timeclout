# User Management Utilities for E2E Tests

This directory contains utilities for managing test users in end-to-end tests, specifically for handling magic link authentication workflows.

## Overview

The `UserManagement` class provides a comprehensive set of methods to create, authenticate, and manage test users without duplicating the complex magic link login logic across different test files.

## Key Features

- **Automatic User Creation**: Creates unique email addresses using Mailslurp
- **Complete Login Workflow**: Handles the entire magic link authentication process
- **Flexible Options**: Configurable timeouts and professional names
- **Automatic Cleanup**: Cleans up test user inboxes after tests
- **Error Handling**: Comprehensive error handling and logging

## Usage

### Basic Usage

```typescript
import { testWithUserManagement } from "../fixtures/test-fixtures";

testWithUserManagement("my test", async ({ userManagement }) => {
  // Create and log in a user in one operation
  const user = await userManagement.createAndLoginUser("Test User");

  // User is now logged in and ready for testing
  console.log(
    `User ${user.professionalName} logged in with email ${user.email}`
  );
});
```

### Advanced Usage

```typescript
testWithUserManagement("advanced test", async ({ userManagement }) => {
  // Step 1: Create a test user
  const user = await userManagement.createTestUser("Manager User");

  // Step 2: Add custom logic between creation and login
  // (e.g., set up test data, configure environment)

  // Step 3: Complete the login workflow with custom options
  await userManagement.completeMagicLinkLoginWorkflow(user, {
    waitForEmailTimeout: 180000, // 3 minutes
  });

  // Step 4: Verify authentication
  await userManagement.verifyUserAuthenticated(user);
});
```

### Multiple Users

```typescript
testWithUserManagement("multi-user test", async ({ userManagement }) => {
  // Create multiple users for different roles
  const adminUser = await userManagement.createAndLoginUser("Admin User");
  const employeeUser = await userManagement.createAndLoginUser("Employee User");
  const managerUser = await userManagement.createAndLoginUser("Manager User");

  // All users are now logged in and ready for testing
  // Test different user interactions, permissions, etc.
});
```

## API Reference

### UserManagement Class

#### Methods

- `createTestUser(professionalName: string): Promise<TestUser>`

  - Creates a new test user with a unique email address
  - Returns a `TestUser` object

- `createAndLoginUser(professionalName: string, options?: LoginOptions): Promise<TestUser>`

  - Creates and logs in a user in one operation
  - Most convenient method for most use cases

- `initiateMagicLinkLogin(email: string): Promise<void>`

  - Initiates the magic link login process
  - Fills and submits the email form

- `waitForMagicLink(user: TestUser, timeout?: number): Promise<string>`

  - Waits for and extracts the magic link from email
  - Default timeout: 120 seconds

- `completeMagicLinkAuth(user: TestUser): Promise<void>`

  - Completes the magic link authentication process
  - Handles terms acceptance and professional name forms

- `verifyUserAuthenticated(user: TestUser): Promise<void>`

  - Verifies that the user is successfully authenticated
  - Checks for user menu and name display

- `completeMagicLinkLoginWorkflow(user: TestUser, options?: LoginOptions): Promise<void>`

  - Completes the entire login workflow from start to finish

- `cleanupUser(user: TestUser): Promise<void>`
  - Cleans up the test user's Mailslurp inbox

#### Options

```typescript
interface LoginOptions {
  waitForEmailTimeout?: number; // Email wait timeout in milliseconds
  professionalName?: string; // Professional name for the user
}
```

### TestUser Interface

```typescript
interface TestUser {
  email: string; // Unique email address
  professionalName: string; // Display name for the user
  magicLink?: string; // Magic link URL (set after email processing)
}
```

## Test Fixtures

The utilities are integrated into Playwright test fixtures for easy access:

```typescript
// Use the enhanced test fixture
export const testWithUserManagement = test.extend<{
  userManagement: UserManagement;
}>({
  userManagement: async ({ page }, use) => {
    const userManagement = createUserManagement(page);
    await use(userManagement);
  },
});
```

## Best Practices

1. **Always Clean Up**: Use `afterEach` to clean up test users
2. **Meaningful Names**: Use descriptive professional names for different user roles
3. **Error Handling**: The utilities include comprehensive error handling
4. **Logging**: All operations are logged for debugging purposes
5. **Reusability**: Create users once and reuse them across multiple test steps

## Example Test Structure

```typescript
testWithUserManagement.describe("Feature Tests", () => {
  let testUser: TestUser;
  let managerUser: TestUser;

  testWithUserManagement(
    "should test feature with regular user",
    async ({ userManagement }) => {
      testUser = await userManagement.createAndLoginUser("Regular User");
      // Test logic here
    }
  );

  testWithUserManagement(
    "should test feature with manager",
    async ({ userManagement }) => {
      managerUser = await userManagement.createAndLoginUser("Manager User");
      // Test logic here
    }
  );

  testWithUserManagement.afterEach(async ({ userManagement }) => {
    // Clean up all users
    if (testUser) await userManagement.cleanupUser(testUser);
    if (managerUser) await userManagement.cleanupUser(managerUser);
  });
});
```

## Dependencies

- `@playwright/test` - Test framework
- `mailslurp` - Email testing service
- `@/utils` - Project utilities (getDefined function)

## Troubleshooting

- **Email Timeouts**: Increase `waitForEmailTimeout` for slower email delivery
- **Authentication Failures**: Check that the magic link extraction is working correctly
- **Cleanup Issues**: Ensure all users are properly stored for cleanup in `afterEach`
