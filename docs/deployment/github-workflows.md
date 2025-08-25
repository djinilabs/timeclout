# GitHub Workflows

This directory contains GitHub Actions workflows for the tt3 project.

## Workflows

### Test (`test.yml`)
Runs on every push to main and pull request. Executes:
- Type checking
- Linting
- Unit tests
- Build verification

### Deploy PR (`deploy-pr.yml`)
Runs on pull request events. Deploys the PR to a preview environment and triggers E2E tests.

### E2E Tests (`e2e-tests.yml`)
Runs end-to-end tests against the deployed PR environment. Can be triggered manually or automatically by the Deploy PR workflow.

### Deploy Production (`deploy-prod.yml`)
Deploys to production when changes are merged to main.

### PR Undeploy (`pr-undeploy.yml`)
Cleans up PR deployments when PRs are closed.

### Auto Merge (`auto-merge.yml`)
Automatically merges pull requests when all required checks pass.

## Auto-Merge Setup

To enable automatic merging of pull requests, follow these steps:

### 1. Branch Protection Rules

In your GitHub repository settings, go to **Settings > Branches** and add a branch protection rule for the `main` branch:

- **Require a pull request before merging**: ✅ Enabled
- **Require approvals**: Set to at least 1 (or your preferred number)
- **Dismiss stale PR approvals when new commits are pushed**: ✅ Enabled
- **Require status checks to pass before merging**: ✅ Enabled
- **Require branches to be up to date before merging**: ✅ Enabled

**Required status checks** (add these in order):
1. `Test` - The main test workflow
2. `Deploy PR` - The PR deployment workflow  
3. `E2E Tests` - The E2E testing workflow

### 2. Workflow Permissions

The auto-merge workflow requires these permissions:
- `contents: write` - To merge PRs
- `pull-requests: write` - To update PR status
- `checks: read` - To read check statuses
- `statuses: read` - To read commit statuses

### 3. How It Works

1. When a PR is opened, the `Test` workflow runs
2. If tests pass, the `Deploy PR` workflow runs and deploys the PR
3. The `Deploy PR` workflow triggers the `E2E Tests` workflow
4. When all three workflows pass, the `Auto Merge` workflow runs
5. The `Auto Merge` workflow waits for all required status checks to complete
6. If all checks pass and the PR is mergeable, it automatically merges the PR

### 4. Required Checks

The auto-merge workflow expects these status checks to pass:
- **Test**: Type checking, linting, unit tests, and build
- **Deploy PR**: PR deployment to preview environment
- **E2E Tests**: End-to-end tests against the deployed PR

### 5. Troubleshooting

If auto-merge isn't working:

1. **Check branch protection rules**: Ensure all required status checks are properly configured
2. **Verify workflow names**: The status check names must exactly match: "Test", "Deploy PR", "E2E Tests"
3. **Check permissions**: Ensure the workflow has the necessary permissions
4. **Review PR status**: The PR must be mergeable and have a clean merge state
5. **Check for conflicts**: The PR must not have merge conflicts

### 6. Manual Override

If you need to manually merge a PR that has passed all checks:
1. Go to the PR page
2. Click the merge button
3. The auto-merge workflow will not interfere with manual merges

## Workflow Dependencies

```
Pull Request → Test → Deploy PR → E2E Tests → Auto Merge
     ↓           ↓         ↓         ↓         ↓
   Opened    Typecheck  Deploy   Run Tests  Merge PR
             Lint       Preview  Validate   (if all pass)
             Test       PR       Functionality
             Build      Environment
```

## Security Considerations

- The auto-merge workflow only runs when all required checks pass
- It respects branch protection rules and required approvals
- It won't merge PRs with conflicts or failed checks
- The workflow logs all actions for audit purposes
