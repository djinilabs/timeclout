# Discord Workflow Notification Action

This reusable GitHub Action sends workflow status notifications to Discord via webhook.

## Usage

```yaml
- name: Send Discord notification
  if: always()
  uses: ./.github/actions/discord-notification
  with:
    webhook_url: ${{ secrets.DISCORD_CI_WEBHOOK_URL }}
    workflow_name: ${{ github.workflow }}
    job_status: ${{ job.status }}
    run_id: ${{ github.run_id }}
    repository: ${{ github.repository }}
    sha: ${{ github.sha }}
    ref_name: ${{ github.ref_name }}
    event_name: ${{ github.event_name }}
    head_commit_message: ${{ github.event.head_commit.message || github.event.pull_request.title || 'Workflow execution' }}
    pull_request_number: ${{ github.event.pull_request.number || '' }}
    pull_request_title: ${{ github.event.pull_request.title || '' }}
    pull_request_url: ${{ github.event.pull_request.html_url || '' }}
    workflow_run_name: ${{ github.event.workflow_run.name || '' }}
```

## Inputs

| Input                 | Description                                                     | Required | Default |
| --------------------- | --------------------------------------------------------------- | -------- | ------- |
| `webhook_url`         | Discord webhook URL                                             | Yes      | -       |
| `workflow_name`       | Name of the workflow                                            | Yes      | -       |
| `job_status`          | Status of the job (success, failure, cancelled, etc.)           | Yes      | -       |
| `run_id`              | GitHub run ID                                                   | Yes      | -       |
| `repository`          | Repository name (owner/repo)                                    | Yes      | -       |
| `sha`                 | Commit SHA                                                      | Yes      | -       |
| `ref_name`            | Branch or ref name                                              | Yes      | -       |
| `event_name`          | GitHub event name (push, pull_request, workflow_dispatch, etc.) | Yes      | -       |
| `head_commit_message` | Commit message or PR title                                      | No       | ''      |
| `pull_request_number` | Pull request number (if applicable)                             | No       | ''      |
| `pull_request_title`  | Pull request title (if applicable)                              | No       | ''      |
| `pull_request_url`    | Pull request URL (if applicable)                                | No       | ''      |
| `workflow_run_name`   | Workflow run name (for workflow_run events)                     | No       | ''      |

## Features

- **Automatic Status Detection**: Automatically detects workflow status and applies appropriate colors and emojis
- **PR Information**: Intelligently extracts and displays PR information when available
- **Event Context**: Provides context about the type of event that triggered the workflow
- **Rich Embeds**: Creates beautiful Discord embeds with relevant workflow information
- **Always Runs**: Uses `if: always()` to ensure notifications are sent regardless of workflow success/failure

## Status Colors

- ✅ **Success**: Green (#3066993)
- ❌ **Failure**: Red (#15158332)
- ⏹️ **Cancelled**: Gray (#7506394)
- 🔄 **Other**: Blue (#3447003)

## Event Types Supported

- `push` - Direct commits to branches
- `pull_request` - PR events (opened, synchronized, closed)
- `workflow_dispatch` - Manual workflow triggers
- `workflow_run` - Workflows triggered by other workflows

## Example Output

The action creates a Discord embed with:

- Workflow name and status
- Run ID with link to GitHub Actions
- PR information (when applicable)
- Commit details
- Repository and branch information
- Timestamp

## Setup

1. Create a Discord webhook in your Discord server
2. Add the webhook URL as a secret named `DISCORD_CI_WEBHOOK_URL`
3. Use this action in your workflows as shown in the usage example

## Integration

This action is already integrated into all main workflows:

- `e2e-tests.yml`
- `deploy-pr.yml`
- `deploy-prod.yml`
- `test.yml`
- `pr-undeploy.yml`
