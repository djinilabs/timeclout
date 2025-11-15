# Discord PR Fix Agent

This service monitors Discord for failed CI workflow notifications, identifies Renovate PR failures, and triggers Cursor's Background Agents API to automatically fix errors.

## Overview

The service listens to Discord messages about failed CI workflows. When it detects a failed PR from Renovate bot, it triggers a Cursor Background Agent to:

1. Send a Discord notification that it's starting
2. Fix TypeScript, linting, test, and build errors
3. Commit and push fixes to the PR branch
4. Send a Discord notification when finished

## Architecture

- **Fire-and-Forget Pattern**: The Lambda function triggers the Cursor agent and returns immediately. It does NOT wait for the agent to complete.
- **Agent Autonomy**: The Cursor agent runs independently and handles all fixes and notifications.

## Endpoint

- `POST /api/discord-messages` - Receives Discord message events

## Environment Variables

Required environment variables:

- `DISCORD_PUBLIC_KEY` - Discord application public key for signature verification (reuse existing)
- `DISCORD_WEBHOOK_URL` - Discord webhook URL for agent notifications (passed to Cursor agent)
- `GITHUB_TOKEN` - Personal access token with repo read access (for fetching PR details)
- `CURSOR_API_KEY` - API key from Cursor Dashboard for Background Agents API
- `CURSOR_API_URL` - (Optional) Cursor API base URL (default: `https://api.cursor.com/v1/background-agents`)

## How It Works

1. **Discord Message Received**: Service receives a Discord message about a failed CI workflow
2. **Message Parsing**: Extracts PR number, branch name, repository, and workflow status from Discord embed
3. **Validation**: Checks if:
   - Workflow status is "FAILED"
   - PR is from Renovate bot
4. **Agent Trigger**: Calls Cursor Background Agents API with:
   - Task description including Discord webhook URL
   - Instructions to send start/finish notifications
   - PR details
5. **Immediate Return**: Lambda returns immediately after triggering agent (fire-and-forget)
6. **Agent Execution**: Cursor agent:
   - Sends Discord notification: "🤖 Starting to fix PR #X..."
   - Checks out PR branch
   - Runs diagnostics (typecheck, lint, test, test:e2e, build)
   - Fixes errors
   - Commits and pushes fixes
   - Sends Discord notification: "✅ Finished fixing PR #X" or "❌ Failed..."

## Message Format

The service expects Discord messages with embeds containing:

- **PR/Event field**: Contains PR number (e.g., "🔗 **PR #123**: [Title](URL)")
- **Branch field**: Contains branch name
- **Status**: Embed title or fields indicating "FAILED" status
- **Repository field**: Contains repository (e.g., "owner/repo")

## Discord Webhooks (How Cursor Agent Sends Notifications)

**Important**: The Cursor agent uses Discord **webhooks** (not the Discord API) to send notifications. 

### Key Points:
- **No signatures required**: Discord webhooks are simple HTTP POST endpoints
- **No authentication needed**: The webhook URL itself is the only credential
- **Simple HTTP requests**: The agent can use `curl`, `fetch`, or any HTTP client

### How It Works:
The Cursor agent receives the webhook URL in the task description and makes simple POST requests:

**Using curl**:
```bash
curl -X POST "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "🤖 Starting to fix PR #123..."}'
```

**Using Node.js fetch**:
```javascript
await fetch("https://discord.com/api/webhooks/YOUR_WEBHOOK_URL", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ content: "🤖 Starting to fix PR #123..." })
});
```

**Note**: This is different from receiving messages (which requires signature verification). Sending messages via webhooks is much simpler - no special tools or authentication needed.

## Error Handling

- Invalid messages are logged and ignored
- Non-Renovate PRs are skipped
- Non-failed workflows are skipped
- API errors are logged and returned to caller
- Cursor agent handles its own errors and notifies Discord

## Limitations

- Lambda execution time: Not a concern (returns immediately)
- Cursor API rate limits: May need to handle rate limiting
- Agent execution time: Not a concern (runs asynchronously)
- Discord webhook rate limits: Agent must respect Discord rate limits

## Setup

See `docs/deployment/discord-pr-fix-agent-setup.md` for detailed setup instructions.

## Testing

To test the endpoint:

```bash
curl -X POST https://your-api.com/api/discord-messages \
  -H "Content-Type: application/json" \
  -H "x-signature-ed25519: <signature>" \
  -H "x-signature-timestamp: <timestamp>" \
  -d '{
    "embeds": [{
      "title": "❌ Test Workflow - FAILED",
      "fields": [
        {"name": "PR/Event", "value": "🔗 **PR #123**: [Test PR](https://github.com/owner/repo/pull/123)"},
        {"name": "Branch", "value": "renovate/test-package"},
        {"name": "Repository", "value": "owner/repo"}
      ]
    }]
  }'
```

## Related Documentation

- [Discord Setup Guide](../../../../docs/deployment/discord-pr-fix-agent-setup.md)
- [Discord Notifications](../../../../docs/deployment/discord-notifications.md)
