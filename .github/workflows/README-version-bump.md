# Automatic Version Bumping

This repository includes automatic version bumping functionality that runs after PRs are auto-merged to the main branch.

## How It Works

1. **Auto-merge Workflow**: When a PR is auto-merged, it triggers the version bump workflow
2. **Version Analysis**: The workflow analyzes the PR title, body, and commit messages to determine the appropriate version bump type
3. **Version Update**: The `package.json` version is updated accordingly
4. **Git Operations**: The changes are committed and pushed back to main, and a git tag is created

## Version Bump Types

The system automatically determines the version bump type based on the following patterns:

### Major Version (X.0.0)

- **Keywords**: `breaking`, `major`, `!` (exclamation mark)
- **Conventional Commits**: `feat!`, `fix!`
- **Examples**:
  - "BREAKING CHANGE: Authentication API has changed"
  - "feat!: refactor auth system"
  - "Major refactor of user management"

### Minor Version (X.Y.0)

- **Keywords**: `feat`, `feature`, `new`, `enhancement`, `improvement`, `minor`, `perf`
- **Conventional Commits**: `feat:` (without exclamation)
- **Examples**:
  - "Add user dashboard"
  - "feat: implement new analytics"
  - "Enhance performance of data processing"

### Patch Version (X.Y.Z)

- **Keywords**: `fix`, `bug`, `patch`, `hotfix`, `security`, `refactor`, `style`, `test`, `docs`, `chore`
- **Conventional Commits**: `fix:`, `docs:`, `chore:`, etc.
- **Examples**:
  - "Fix login issue"
  - "security: fix xss vulnerability"
  - "docs: update readme"

## Priority Order

The system checks for version bump types in this order:

1. **Major** (highest priority)
2. **Minor** (medium priority)
3. **Patch** (lowest priority)

If no specific indicators are found, it defaults to a **patch** version bump.

## Testing

You can test the version bump logic locally:

```bash
pnpm test:version-bump
```

This will run through various test cases to verify the version bump detection works correctly.

## Workflow Files

- **`.github/workflows/version-bump.yml`**: Main version bump workflow
- **`.github/workflows/auto-merge.yml`**: Modified to trigger version bump after merge
- **`scripts/test-version-bump.js`**: Test script for validating the logic

## Git Tags

Each version bump creates a corresponding git tag in the format `vX.Y.Z` (e.g., `v1.7.0`).

## Discord Notifications

The version bump workflow sends Discord notifications about the version update, including:

- New version number
- Bump type (major/minor/patch)
- Associated PR information
