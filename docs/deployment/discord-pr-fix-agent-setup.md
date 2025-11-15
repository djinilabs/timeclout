# Discord PR Fix Agent Setup Guide

This guide provides step-by-step instructions for setting up the Discord PR Fix Agent, which monitors Discord for failed CI workflow notifications and triggers Cursor agents to automatically fix Renovate PR failures.

## Overview

The Discord PR Fix Agent requires:
1. A Discord bot with Message Content Intent enabled
2. A Discord webhook for agent notifications
3. Cursor API key for Background Agents
4. GitHub token for fetching PR details
5. Environment variables configured

## Prerequisites

- Access to Discord Developer Portal
- Access to Cursor Dashboard
- GitHub personal access token with `repo` read scope
- Access to your deployment environment (for setting environment variables)

## Step 1: Create Discord Bot

### 1.1 Create Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Enter a name (e.g., "PR Fix Agent Bot")
4. Click **"Create"**

### 1.2 Get Public Key

1. In your application, go to **"General Information"**
2. Copy the **"Public Key"** value
3. Save this for later (you'll need it for `DISCORD_PUBLIC_KEY` environment variable)

### 1.3 Enable Message Content Intent

**CRITICAL**: This is required for the bot to read message content.

1. Go to **"Bot"** section in the left sidebar
2. Scroll down to **"Privileged Gateway Intents"**
3. Enable **"MESSAGE CONTENT INTENT"**
4. Click **"Save Changes"**

### 1.4 Create Bot

1. In the **"Bot"** section, click **"Add Bot"** (if not already created)
2. Optionally customize the bot name and avatar
3. Under **"Token"**, click **"Reset Token"** or **"Copy"** to get the bot token
4. **IMPORTANT**: Save this token securely (you may need it for Gateway bot setup, though webhooks don't require it)

### 1.5 Get Application ID

1. Go back to **"General Information"**
2. Copy the **"Application ID"**
3. Save this for reference

## Step 2: Create Discord Webhook

The webhook is used by the Cursor agent to send notifications about start and completion.

### 2.1 Create Webhook in Discord Channel

1. Go to your Discord server
2. Navigate to the channel where CI notifications are sent
3. Click the gear icon (⚙️) next to the channel name
4. Go to **"Integrations"** → **"Webhooks"**
5. Click **"New Webhook"**
6. Give it a name (e.g., "PR Fix Agent Notifications")
7. Optionally set an avatar
8. Click **"Copy Webhook URL"**
9. **IMPORTANT**: Save this URL securely - this is your `DISCORD_WEBHOOK_URL`

### 2.2 Test Webhook

You can test the webhook with curl:

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message from PR Fix Agent"}'
```

You should see the message appear in your Discord channel.

## Step 3: Add Bot to Discord Server

### 3.1 Generate OAuth2 URL

1. In Discord Developer Portal, go to **"OAuth2"** → **"URL Generator"**
2. Under **"Scopes"**, select:
   - `bot`
   - `applications.commands` (optional, for slash commands)
3. Under **"Bot Permissions"**, select:
   - `Read Messages/View Channels`
   - `Send Messages`
   - `Read Message History`
   - `Use External Emojis` (optional)
4. Copy the generated URL at the bottom

### 3.2 Invite Bot to Server

1. Open the generated URL in your browser
2. Select your Discord server
3. Click **"Authorize"**
4. Complete any CAPTCHA if prompted

### 3.3 Verify Bot is in Channel

1. Go to your Discord server
2. Navigate to the channel where CI notifications are sent
3. Verify the bot appears in the member list
4. The bot should have permission to read messages in this channel

## Step 4: Get Cursor API Key

### 4.1 Access Cursor Dashboard

1. Go to [Cursor Dashboard](https://cursor.com/dashboard) (or your Cursor instance)
2. Navigate to **"Integrations"** or **"Settings"** → **"API"**

### 4.2 Create API Key

1. Click **"Create API Key"** or **"Generate Key"**
2. Give it a descriptive name (e.g., "PR Fix Agent")
3. Copy the API key immediately
4. **IMPORTANT**: Save this securely - you won't be able to see it again
5. This is your `CURSOR_API_KEY`

### 4.3 Verify API Access

Ensure the API key has access to:
- Background Agents API
- Repository access (for the repositories you want to fix)

## Step 5: Get GitHub Token

### 5.1 Create Personal Access Token

1. Go to [GitHub Settings](https://github.com/settings/tokens) → **"Developer settings"** → **"Personal access tokens"** → **"Tokens (classic)"**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name (e.g., "PR Fix Agent")
4. Set expiration (recommended: 90 days or custom)
5. Under **"Select scopes"**, check:
   - `repo` (Full control of private repositories) - **Read access only is sufficient**
6. Click **"Generate token"**
7. **IMPORTANT**: Copy the token immediately - you won't be able to see it again
8. This is your `GITHUB_TOKEN`

### 5.2 Verify Token Permissions

The token needs:
- `repo` scope with read access (for fetching PR details)
- Access to the repositories you want to monitor

## Step 6: Configure Environment Variables

Add the following environment variables to your deployment:

### Required Variables

```bash
# Discord Bot Configuration
DISCORD_PUBLIC_KEY=your_discord_public_key_here

# Discord Webhook (for agent notifications)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_url_here

# GitHub Configuration
GITHUB_TOKEN=your_github_token_here

# Cursor API Configuration
CURSOR_API_KEY=your_cursor_api_key_here
CURSOR_API_URL=https://api.cursor.com/v1/background-agents  # Optional, defaults to this
```

### Setting in GitHub Secrets

If deploying via GitHub Actions:

1. Go to your repository → **"Settings"** → **"Secrets and variables"** → **"Actions"**
2. Click **"New repository secret"**
3. Add each variable:
   - `DISCORD_PUBLIC_KEY`
   - `DISCORD_WEBHOOK_URL`
   - `GITHUB_TOKEN`
   - `CURSOR_API_KEY`
   - `CURSOR_API_URL` (if different from default)

### Setting in AWS Lambda/Architect

If using Architect framework:

1. Add to your `.env` file for local development
2. For production, set in your deployment configuration or AWS Systems Manager Parameter Store

## Step 7: Configure Discord Message Format

The service expects Discord messages with embeds containing specific fields. Ensure your CI workflow notifications include:

### Required Embed Fields

- **PR/Event field**: Should contain PR number (e.g., "🔗 **PR #123**: [Title](URL)")
- **Branch field**: Should contain branch name
- **Status**: Embed title should indicate "FAILED" (e.g., "❌ Workflow Name - FAILED")
- **Repository field**: Should contain repository (e.g., "owner/repo")

### Example Discord Embed Format

```json
{
  "embeds": [{
    "title": "❌ Test Workflow - FAILED",
    "fields": [
      {
        "name": "PR/Event",
        "value": "🔗 **PR #123**: [Test PR](https://github.com/owner/repo/pull/123)"
      },
      {
        "name": "Branch",
        "value": "renovate/test-package"
      },
      {
        "name": "Repository",
        "value": "owner/repo"
      }
    ]
  }]
}
```

## Step 8: Test the Integration

### 8.1 Test Webhook Endpoint

Send a test message to your endpoint:

```bash
curl -X POST https://your-api.com/api/discord-messages \
  -H "Content-Type: application/json" \
  -H "x-signature-ed25519: <signature>" \
  -H "x-signature-timestamp: <timestamp>" \
  -d '{
    "embeds": [{
      "title": "❌ Test Workflow - FAILED",
      "fields": [
        {"name": "PR/Event", "value": "🔗 **PR #123**: [Test](https://github.com/owner/repo/pull/123)"},
        {"name": "Branch", "value": "renovate/test-package"},
        {"name": "Repository", "value": "owner/repo"}
      ]
    }]
  }'
```

### 8.2 Verify Agent Trigger

1. Check logs to see if agent was triggered
2. Check Discord channel for agent notification: "🤖 Starting to fix PR #123..."
3. Monitor Cursor agent progress
4. Wait for completion notification: "✅ Finished fixing PR #123"

## Troubleshooting

### Bot Not Receiving Messages

**Problem**: Bot doesn't see messages in channel

**Solutions**:
- Verify bot is added to the server
- Check bot has "Read Messages" permission
- Verify "Message Content Intent" is enabled in Developer Portal
- Check bot is in the correct channel

### Signature Verification Fails

**Problem**: `Invalid Discord signature` error

**Solutions**:
- Verify `DISCORD_PUBLIC_KEY` is set correctly
- Check signature headers are being sent (`x-signature-ed25519`, `x-signature-timestamp`)
- Ensure body is not modified before signature verification

### Agent Not Triggered

**Problem**: Message received but agent not triggered

**Solutions**:
- Check message format matches expected embed structure
- Verify PR number is extracted correctly
- Check if workflow status is "FAILED"
- Verify PR is from Renovate bot (check logs)
- Check `CURSOR_API_KEY` is set correctly

### Cursor API Errors

**Problem**: Cursor API returns errors

**Solutions**:
- Verify `CURSOR_API_KEY` is valid and not expired
- Check API key has Background Agents permission
- Verify `CURSOR_API_URL` is correct
- Check Cursor API rate limits

### Agent Not Sending Discord Notifications

**Problem**: Agent runs but doesn't send Discord notifications

**Solutions**:
- Verify `DISCORD_WEBHOOK_URL` is passed correctly to agent
- Check webhook URL is valid (test with curl)
- Verify agent has HTTP request capability
- Check Discord webhook rate limits

### GitHub API Errors

**Problem**: Failed to fetch PR details

**Solutions**:
- Verify `GITHUB_TOKEN` is valid and not expired
- Check token has `repo` read scope
- Verify repository format is correct (owner/repo)
- Check GitHub API rate limits

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Webhook URLs**: Keep webhook URLs secret (they allow posting to Discord)
3. **GitHub Token**: Use minimal required permissions (read-only for repo)
4. **Discord Public Key**: This is safe to store (it's a public key)
5. **Signature Verification**: Always verify Discord signatures to prevent unauthorized requests

## Monitoring

### Logs to Monitor

- Agent trigger events
- PR validation results
- Cursor API responses
- Error messages

### Metrics to Track

- Number of PRs processed
- Success rate of agent fixes
- Average time to fix
- Error rates by type

## Next Steps

After setup:

1. Monitor the first few PR fixes to ensure everything works
2. Adjust agent instructions if needed
3. Set up alerts for failures
4. Document any customizations

## Related Documentation

- [Discord Notifications](./discord-notifications.md)
- [Discord Setup](./discord-setup.md)
- [GitHub Workflows](./github-workflows.md)
