# E2E Tests

This directory contains end-to-end tests for the TT3 application using Playwright.

## Overview

The e2e tests have been significantly improved to reduce flakiness and improve reliability. Key improvements include:

- **Page Object Model**: Centralized selectors and common test patterns
- **Retry Logic**: Exponential backoff for flaky operations
- **Better Waiting Strategies**: Replaced `waitForTimeout` with proper element waiting
- **Accessibility-First Selectors**: Using ARIA labels and semantic selectors
- **Improved Error Handling**: Better error messages and recovery mechanisms

## Test Structure

```
tests/e2e/
├── auth/                    # Authentication tests
├── fixtures/               # Test fixtures and utilities
├── utils/                  # Test utilities and page objects
├── config/                 # Test configuration
├── global-setup.ts         # Global test setup
├── global-teardown.ts      # Global test cleanup
└── company-creation-workflow.spec.ts  # Main workflow test
```

## Key Components

### Page Objects (`utils/page-objects.ts`)

The Page Objects provide reliable selectors and common test patterns:

```typescript
const pageObjects = createPageObjects(page);

// Wait for forms to load
await pageObjects.waitForCompanyForm();
await pageObjects.waitForUnitForm();
await pageObjects.waitForTeamForm();

// Create entities
await pageObjects.createCompany("Company Name");
await pageObjects.createUnit("Unit Name");
await pageObjects.createTeam("Team Name");

// Navigate and wait
await pageObjects.waitForNavigation(/\/companies\/.*/);
```

### Test Helpers (`utils/test-helpers.ts`)

Enhanced test utilities with retry logic and better waiting strategies:

```typescript
const testHelpers = createTestHelpers(userManagement);

// Wait for conditions with retry
await testHelpers.waitForCondition(async () => {
  return await someCondition();
}, 30000);

// Retry operations with exponential backoff
await testHelpers.retryWithBackoff(
  async () => {
    return await flakyOperation();
  },
  3,
  1000
);
```

### User Management (`utils/user-management.ts`)

Improved user management with better waiting strategies:

```typescript
const userManagement = createUserManagement(page);

// Create and login user
const user = await userManagement.createAndLoginUser("Test User");

// Cleanup
await userManagement.cleanupUser(user);
```

## Running Tests

### Prerequisites

1. Install dependencies: `pnpm install`
2. Install Playwright browsers: `pnpm test:e2e:install`
3. Set up environment variables (see `.env.example`)

### Test Commands

```bash
# Run all e2e tests
pnpm test:e2e

# Run tests with UI
pnpm test:e2e:ui

# Run tests in headed mode
pnpm test:e2e:headed

# Run specific test file
pnpm test:e2e company-creation-workflow.spec.ts

# Debug tests
pnpm test:e2e:debug
```

## Test Configuration

### Playwright Config (`playwright.config.ts`)

- **Retries**: 2 retries in CI, 1 in development
- **Timeouts**: 3 minutes global timeout, 30 seconds navigation timeout
- **Browser**: Chromium with reliability-focused launch arguments
- **Workers**: Reduced to 1 in CI to avoid resource conflicts

### Environment Configuration (`config/env.ts`)

- **Testmail**: Email testing service configuration
- **Timeouts**: Configurable timeouts for different operations
- **Recording**: Screenshots, videos, and traces on failure

## Best Practices

### 1. Use Page Objects

Instead of direct selectors, use the page objects:

```typescript
// ❌ Bad - direct selector
await page.locator(".company-name-input").fill("Name");

// ✅ Good - page object
await pageObjects.createCompany("Name");
```

### 2. Wait for Elements Properly

Use proper waiting strategies instead of timeouts:

```typescript
// ❌ Bad - flaky timeout
await page.waitForTimeout(2000);

// ✅ Good - wait for element state
await element.waitFor({ state: "visible" });
await page.waitForLoadState("networkidle");
```

### 3. Use Accessibility Selectors

Prefer accessibility-focused selectors:

```typescript
// ❌ Bad - generic class selector
await page.locator(".button").click();

// ✅ Good - accessibility selector
await page.locator('button[aria-label="Create company"]').click();
```

### 4. Implement Retry Logic

Use retry logic for flaky operations:

```typescript
await testHelpers.retryWithBackoff(
  async () => {
    return await flakyOperation();
  },
  3,
  1000
);
```

### 5. Verify State Changes

Always verify that operations completed successfully:

```typescript
// Fill form field
await pageObjects.fillFormField(".input", "value");

// Verify the value was set
const actualValue = await pageObjects.input.inputValue();
expect(actualValue).toBe("value");
```

## Troubleshooting

### Common Issues

1. **Element Not Found**: Check if the selector matches the actual component structure
2. **Timeout Errors**: Increase timeouts or check for network issues
3. **Flaky Tests**: Use retry logic and better waiting strategies

### Debug Mode

Run tests in debug mode to step through execution:

```bash
pnpm test:e2e:debug
```

### Trace Viewer

View detailed test execution traces:

```bash
# Open trace file in browser
npx playwright show-trace test-results/trace.zip
```

## Adding New Tests

### 1. Create Test File

```typescript
import { testWithUserManagement } from "../fixtures/test-fixtures";

testWithUserManagement.describe("New Feature", () => {
  testWithUserManagement(
    "should work correctly",
    async ({ page, pageObjects }) => {
      // Test implementation
    }
  );
});
```

### 2. Add Page Objects

Extend the PageObjects class with new selectors:

```typescript
// In utils/page-objects.ts
get newFeatureButton() {
  return this.page.locator('button[aria-label="New Feature"]');
}
```

### 3. Add Test Helpers

Extend TestHelpers with new utility methods:

```typescript
// In utils/test-helpers.ts
async newFeatureHelper(): Promise<void> {
  // Helper implementation
}
```

## Performance Considerations

- **Parallel Execution**: Tests run in parallel by default
- **Resource Management**: Reduced workers in CI to avoid conflicts
- **Cleanup**: Proper cleanup after each test to prevent resource leaks
- **Timeouts**: Reasonable timeouts to prevent hanging tests

## CI/CD Integration

The tests are configured for CI/CD environments:

- **Retries**: Automatic retry of failed tests
- **Artifacts**: Screenshots, videos, and traces on failure
- **Reporting**: Multiple report formats (JSON, JUnit, HTML)
- **Resource Optimization**: Reduced workers and optimized browser settings
