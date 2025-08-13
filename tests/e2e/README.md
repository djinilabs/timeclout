# E2E Test Environment Configuration

This directory contains end-to-end tests for the TT3 application. The tests use environment variables to configure various aspects of the testing environment.

## Environment Setup

### 1. Create Environment File

Copy the example environment file and configure it with your values:

```bash
cp tests/e2e/env.example tests/e2e/.env
```

### 2. Configure Required Variables

Edit `tests/e2e/.env` and set the following required variables:

#### Required Variables

- **`MAILSLURP_API_KEY`**: Your Mailslurp API key for email testing
  - Get a free API key from [Mailslurp](https://www.mailslurp.com/)
  - This is required for magic link login tests

#### Optional Variables

- **`BASE_URL`**: Base URL for the application under test (default: `http://localhost:3000`)
- **`TEST_TIMEOUT`**: Global test timeout in milliseconds (default: `180000` - 3 minutes)
- **`ACTION_TIMEOUT`**: Action timeout in milliseconds (default: `60000` - 1 minute)
- **`CI`**: Set to `true` when running in CI/CD pipeline (default: `false`)
- **`BROWSER`**: Browser to use for tests (default: `chromium`)
- **`HEADLESS`**: Run tests without opening browser windows (default: `false`)
- **`SCREENSHOT`**: Screenshot recording mode (default: `only-on-failure`)
- **`VIDEO`**: Video recording mode (default: `retain-on-failure`)
- **`TRACE`**: Trace recording mode (default: `on-first-retry`)

## Running Tests

### Install Dependencies

```bash
pnpm test:e2e:install
```

### Run Tests

```bash
# Run all e2e tests
pnpm test:e2e

# Run tests with UI
pnpm test:e2e:ui

# Run tests in headed mode (shows browser)
pnpm test:e2e:headed

# Run tests in debug mode
pnpm test:e2e:debug
```

## Environment Validation

The test suite automatically validates required environment variables before running tests. If any required variables are missing, the tests will fail with a clear error message indicating what needs to be configured.

## Configuration Files

- **`config/env.ts`**: Environment configuration loader and validator
- **`env.example`**: Example environment file with all available options
- **`.env`**: Your local environment configuration (not committed to git)

## Troubleshooting

### Missing Mailslurp API Key

If you see an error about missing `MAILSLURP_API_KEY`:

1. Sign up for a free account at [Mailslurp](https://www.mailslurp.com/)
2. Get your API key from the dashboard
3. Add it to your `tests/e2e/.env` file

### Environment Variables Not Loading

Make sure your `.env` file is in the correct location: `tests/e2e/.env`

The configuration automatically loads from this location relative to the test files.

### Test Timeouts

If tests are timing out, you can increase the timeout values in your `.env` file:

```bash
TEST_TIMEOUT=300000  # 5 minutes
ACTION_TIMEOUT=120000 # 2 minutes
```
