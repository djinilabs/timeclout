# End-to-End Testing

This directory contains end-to-end tests for the TT3 application using Playwright.

## Setup

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed
2. **Playwright**: Install Playwright browsers: `pnpm test:e2e:install`
3. **Environment Variables**: Create a `.env` file in the `tests/e2e` directory

### Environment Variables

Create a `.env` file in the `tests/e2e` directory with the following variables:

```bash
# Testmail configuration
TESTMAIL_NAMESPACE=your_testmail_namespace

# Application configuration
BASE_URL=http://localhost:3000

# Test configuration
TEST_TIMEOUT=180000
ACTION_TIMEOUT=60000
CI=false
HEADLESS=true

# Browser configuration
BROWSER=chromium

# Recording configuration
SCREENSHOT=only-on-failure
VIDEO=retain-on-failure
TRACE=on-first-retry
```

### Testmail Setup

1. **Get a Testmail Namespace**:

   - Go to [testmail.app](https://testmail.app)
   - Sign up for a free account
   - Get your namespace from the dashboard

2. **Configure Environment**:

   - Set `TESTMAIL_NAMESPACE` in your `.env` file
   - The system will automatically generate unique tags for each test run

3. **How It Works**:
   - Test emails are sent to `{namespace}.{tag}@testmail.app`
   - Each test run gets a unique tag to avoid conflicts
   - Emails are automatically cleaned up after 24 hours

## Running Tests

### Basic Commands

```bash
# Run all e2e tests
pnpm test:e2e

# Run tests with UI
pnpm test:e2e:ui

# Run tests in headed mode (visible browser)
pnpm test:e2e:headed

# Run tests in debug mode
pnpm test:e2e:debug

# Test testmail integration
pnpm test:testmail
```

### Test Structure

- **Fixtures**: Common test utilities and user management
- **Utils**: Helper functions for common operations
- **Pages**: Page object models for different application pages
- **Auth**: Authentication-related test utilities

## User Management

The test suite includes a comprehensive user management system that handles:

- **User Creation**: Automatic creation of test users with unique emails
- **Magic Link Authentication**: Complete authentication workflow
- **Cleanup**: Automatic cleanup of test data

### Example Usage

```typescript
test("example test", async ({ page, userManagement }) => {
  // Create and login a new user
  const user = await userManagement.createAndLoginUser("Test User");

  // User is now authenticated and ready for testing
  console.log(`Logged in as: ${user.email}`);

  // Test logic here...
});
```

## Test Utilities

### Testmail Client

The `TestmailClient` class provides:

- **Email Address Generation**: Creates unique test email addresses
- **Message Polling**: Waits for and retrieves test emails
- **Automatic Cleanup**: Handles cleanup of test data

### User Management

The `UserManagement` class provides:

- **User Creation**: Creates test users with unique emails
- **Authentication Workflow**: Complete magic link login process
- **Verification**: Ensures users are properly authenticated

## Best Practices

1. **Unique Data**: Always use unique names/timestamps for test data
2. **Cleanup**: Tests automatically clean up after themselves
3. **Timeouts**: Use appropriate timeouts for email operations
4. **Error Handling**: Implement proper error handling for flaky operations

## Troubleshooting

### Common Issues

1. **Email Not Received**:

   - Check your `TESTMAIL_NAMESPACE` is correct
   - Verify the email was sent to the correct address
   - Check testmail.app dashboard for received emails

2. **Authentication Failures**:

   - Ensure the application is running and accessible
   - Check that magic link authentication is properly configured
   - Verify email templates are working correctly

3. **Test Timeouts**:
   - Increase timeout values in environment configuration
   - Check network connectivity to testmail.app
   - Verify application performance

### Debug Mode

Run tests in debug mode to see what's happening:

```bash
pnpm test:e2e:debug
```

This will open Playwright's debug UI where you can step through tests and inspect the browser state.
