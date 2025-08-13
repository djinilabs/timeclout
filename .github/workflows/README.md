# GitHub Workflows

This directory contains GitHub Actions workflows for automated testing and deployment.

## E2E Tests Workflow

The `e2e-tests.yml` workflow automatically runs end-to-end tests on pull requests and pushes to main/develop branches.

### What it does

- **Triggers**: Runs on PR creation, updates, and pushes to main/develop branches
- **Environment**: Ubuntu latest with Node.js 20 and pnpm 8
- **Tests**: Executes Playwright e2e tests against the built frontend
- **Reporting**: Uploads test results and generates PR comments with test summaries

### Setup Requirements

#### 1. Repository Secrets

You need to add the following secret to your GitHub repository:

- **`MAILSLURP_API_KEY`**: Your Mailslurp API key for email testing
  - Get a free API key from [Mailslurp](https://www.mailslurp.com/)
  - This is required for magic link login tests

#### 2. Setting up the secret

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `MAILSLURP_API_KEY`
5. Value: Your Mailslurp API key
6. Click **Add secret**

### Workflow Features

#### Concurrency Control

- Cancels in-progress runs when new commits are pushed
- Prevents multiple test runs from conflicting

#### Caching

- Caches pnpm dependencies for faster builds
- Caches Playwright browsers between runs

#### Test Results

- Uploads test artifacts (screenshots, videos, traces)
- Generates detailed test reports
- Comments on PRs with test summaries

#### Environment Configuration

- Automatically sets up test environment variables
- Configures CI-specific settings (headless mode, timeouts, etc.)

### Workflow Steps

1. **Checkout**: Gets the latest code
2. **Setup**: Installs Node.js, pnpm, and dependencies
3. **Build**: Builds the frontend application
4. **Configure**: Sets up test environment variables
5. **Test**: Runs Playwright e2e tests
6. **Report**: Uploads results and comments on PRs

### Test Configuration

The workflow automatically configures:

- `CI=true` for CI-specific behavior
- `HEADLESS=true` for headless browser execution
- `BROWSER=chromium` for consistent testing
- Appropriate timeouts for CI environment
- Mailslurp API key from repository secrets

### Troubleshooting

#### Tests failing in CI

- Check that `MAILSLURP_API_KEY` secret is properly set
- Verify the frontend builds successfully
- Check test logs for specific error messages

#### Missing test results

- Ensure tests are completing (not timing out)
- Check that test output directories exist
- Verify Playwright configuration is correct

#### Performance issues

- The workflow uses caching to speed up builds
- Consider adjusting timeouts if tests are slow in CI
- Monitor resource usage on GitHub Actions runners

### Customization

You can modify the workflow to:

- Add more test environments (different browsers, OS)
- Include additional build steps
- Modify test execution parameters
- Add notifications (Slack, email, etc.)
- Change trigger conditions

### Security Notes

- Never commit API keys or sensitive data
- Use repository secrets for all sensitive configuration
- The workflow runs in isolated environments
- Test artifacts are automatically cleaned up after 30 days
