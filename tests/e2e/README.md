# E2E Testing Foundation with Playwright

This directory contains the foundation for end-to-end (e2e) testing using Playwright. The tests are designed to validate the user interface and user experience without requiring a full backend setup.

## Project Structure

```
tests/e2e/
├── auth/                    # Authentication-related tests
│   └── login.spec.ts       # Magic link login workflow tests
├── pages/                   # Page Object Model (POM) classes
│   ├── base-page.ts        # Base page with common methods
│   └── login-page.ts       # Login page interactions
├── utils/                   # Utility functions and helpers
│   └── tigrmail.ts         # Mock email service for testing
├── fixtures/                # Test fixtures and setup
│   └── test-fixtures.ts    # Common test utilities
├── global-setup.ts          # Global test setup
├── global-teardown.ts       # Global test cleanup
└── README.md               # This file
```

## Current Test Coverage

### Magic Link Login Workflow

- ✅ Shows email form when email link button is clicked
- ✅ Allows filling email address
- ✅ Shows enabled submit button when email is entered
- ✅ Handles empty email submission (button disabled)
- ✅ Handles invalid email format

## Getting Started

### Prerequisites

- Node.js and pnpm installed
- Frontend development server running on port 3000

### Running Tests

```bash
# Run all e2e tests
pnpm test:e2e

# Run tests with UI (for debugging)
pnpm test:e2e:ui

# Run tests in headed mode (see browser)
pnpm test:e2e:headed

# Run tests in debug mode
pnpm test:e2e:debug

# Install Playwright browsers
pnpm test:e2e:install
```

### Test Configuration

The tests are configured in `playwright.config.ts` at the project root:

- Uses Chromium browser
- Runs against `http://localhost:3000`
- Automatically starts the frontend dev server
- Generates reports in `test-results/` directory
- Uses list reporter for stdout output (no HTML server)

## Test Architecture

### Page Object Model (POM)

Each page has a corresponding class that encapsulates:

- Element locators
- Page-specific actions
- Verification methods

### Mock Email Service

The `TigrMailClient` provides a mock implementation for testing email flows:

- Creates test email addresses
- Simulates receiving emails
- Manages mock inbox state

### Test Structure

Tests follow a clear pattern:

1. **Setup**: Navigate to page and initialize components
2. **Action**: Perform user interactions
3. **Verification**: Assert expected outcomes
4. **Cleanup**: Reset state for next test

## Writing New Tests

### 1. Create Page Object

```typescript
// tests/e2e/pages/my-page.ts
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

export class MyPage extends BasePage {
  readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = page.locator('[data-testid="my-element"]');
  }

  async doSomething(): Promise<void> {
    await this.clickElement(this.myElement);
  }
}
```

### 2. Write Test

```typescript
// tests/e2e/my-feature/my-feature.spec.ts
import { test, expect } from "@playwright/test";
import { MyPage } from "../pages/my-page";

test.describe("My Feature", () => {
  let myPage: MyPage;

  test.beforeEach(async ({ page }) => {
    myPage = new MyPage(page);
  });

  test("should do something", async () => {
    await myPage.goto("/my-page");
    await myPage.doSomething();
    // Add assertions
  });
});
```

## Best Practices

### Element Locators

- Use `data-testid` attributes when possible
- Provide fallback selectors for flexibility
- Avoid brittle selectors (class names, text content)

### Test Isolation

- Each test should be independent
- Use `beforeEach` for setup, `afterEach` for cleanup
- Avoid test dependencies

### Error Handling

- Use descriptive error messages
- Handle async operations gracefully
- Provide meaningful test failure information

### Performance

- Keep tests focused and fast
- Avoid unnecessary waits
- Use appropriate timeouts

## Configuration

### Environment Variables

- `TIGRMAIL_TOKEN`: Token for email service (optional, uses default for testing)

### Browser Configuration

- Currently configured for Chromium only
- Can be extended to support other browsers

### Test Timeouts

- Default test timeout: 30 seconds
- Element wait timeout: 5 seconds
- Navigation timeout: 120 seconds

## Troubleshooting

### Common Issues

1. **Frontend not running**

   - Ensure `pnpm dev:frontend` is running on port 3000
   - Check for port conflicts

2. **Element not found**

   - Verify element selectors are correct
   - Check if page has fully loaded
   - Ensure element is visible (not hidden by CSS)

3. **Test timeouts**
   - Increase timeout values if needed
   - Check for slow operations
   - Verify network conditions

### Debug Mode

Use `pnpm test:e2e:debug` to:

- Run tests step by step
- Inspect page state
- Debug element interactions

### Screenshots and Videos

Failed tests automatically generate:

- Screenshots in `test-results/` directory
- Video recordings for debugging
- Error context information

## Future Enhancements

### Backend Integration

When backend services are available:

- Replace mock email service with real TigrMail integration
- Add authentication flow tests
- Test API interactions

### Additional Test Scenarios

- User registration flows
- Dashboard functionality
- Team management features
- Leave request workflows

### Browser Support

- Add Firefox and Safari testing
- Mobile device testing
- Cross-browser compatibility validation

### Performance Testing

- Load time measurements
- User interaction responsiveness
- Memory usage monitoring

## Contributing

When adding new tests:

1. Follow the existing POM pattern
2. Use descriptive test names
3. Add appropriate assertions
4. Include error handling
5. Update this README if needed

## Support

For issues with the e2e testing framework:

1. Check the troubleshooting section
2. Review test output and screenshots
3. Use debug mode for detailed investigation
4. Consult Playwright documentation
