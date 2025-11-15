/**
 * Cursor Background Agents API client
 * Triggers Cursor agent to fix PR issues
 */

export interface CursorAgentTask {
  prNumber: number;
  branchName: string;
  repository: string;
  errorDetails?: string;
}

export interface CursorAgentResponse {
  agentId: string;
  status: string;
  message?: string;
}

/**
 * Trigger Cursor Background Agent to fix PR
 * Returns immediately after triggering (fire-and-forget pattern)
 */
export async function triggerCursorAgent(
  task: CursorAgentTask
): Promise<CursorAgentResponse> {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    throw new Error("CURSOR_API_KEY environment variable is not set");
  }

  const apiUrl =
    process.env.CURSOR_API_URL || "https://api.cursor.com/v1/background-agents";

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("DISCORD_WEBHOOK_URL environment variable is not set");
  }

  // Note: We don't pass the webhook URL directly in the task description for security.
  // Instead, we instruct the agent to use the DISCORD_WEBHOOK_URL environment variable.
  // We pass it via the environment field in the API request (if supported by Cursor API).

  // Build task description for the agent
  const taskDescription = buildTaskDescription(task);

  try {
    const response = await fetch(`${apiUrl}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        task: taskDescription,
        repository: task.repository,
        branch: task.branchName,
        metadata: {
          prNumber: task.prNumber,
          source: "discord-pr-fix-agent",
        },
        // Pass webhook URL as environment variable for the agent
        // Note: This depends on Cursor API supporting environment variables
        // If not supported, the agent will need to be configured with DISCORD_WEBHOOK_URL separately
        environment: {
          DISCORD_WEBHOOK_URL: webhookUrl,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Cursor API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    return {
      agentId: data.agentId || data.id || "unknown",
      status: data.status || "created",
      message: data.message,
    };
  } catch (error) {
    console.error("Error triggering Cursor agent:", error);
    throw error;
  }
}

/**
 * Build task description for Cursor agent
 * Includes instructions to send Discord notifications using environment variable
 */
function buildTaskDescription(task: CursorAgentTask): string {
  const errorContext = task.errorDetails
    ? `\n\nError details:\n${task.errorDetails}`
    : "";

  return `You are tasked with fixing a failing pull request from an upgrade bot (Renovate).

PR Information:
- PR Number: #${task.prNumber}
- Branch: ${task.branchName}
- Repository: ${task.repository}${errorContext}

Instructions:
1. First, send a Discord notification using the configured Discord webhook URL with a POST request containing this JSON payload:
   {"content": "🤖 Starting to fix PR #${task.prNumber}..."}
   
   The Discord webhook URL is available via the DISCORD_WEBHOOK_URL environment variable.
   
   You can do this using curl:
   curl -X POST "$DISCORD_WEBHOOK_URL" \\
     -H "Content-Type: application/json" \\
     -d '{"content": "🤖 Starting to fix PR #${task.prNumber}..."}'
   
   Or using Node.js fetch:
   await fetch(process.env.DISCORD_WEBHOOK_URL, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ content: "🤖 Starting to fix PR #${task.prNumber}..." })
   })
   
   Note: The Discord webhook URL should be provided via environment variable or secure configuration. Do NOT hardcode or expose the webhook URL in logs or code. Discord webhooks do NOT require signatures or authentication - just the webhook URL.

2. Checkout the PR branch: ${task.branchName}

3. Run diagnostics to identify errors:
   - Run: pnpm typecheck (capture TypeScript errors)
   - Run: pnpm lint (capture linting errors)
   - Run: pnpm test (capture test failures)
   - Run: pnpm test:e2e (capture e2e test failures)
   - Run: pnpm build (capture build errors)

4. Fix all identified errors:
   - Fix TypeScript type errors
   - Fix linting errors
   - Fix failing tests
   - Fix failing e2e tests
   - Fix build errors

5. Verify fixes by running the diagnostics again (typecheck, lint, test, test:e2e, build)

6. Commit your changes with message: "fix: resolve CI failures (auto-fix by Cursor agent)"

7. Push the changes to the PR branch: ${task.branchName}

8. Finally, send a Discord notification using the DISCORD_WEBHOOK_URL environment variable with a POST request containing this JSON payload:
   {"content": "✅ Finished fixing PR #${task.prNumber}"}
   
   Using curl:
   curl -X POST "$DISCORD_WEBHOOK_URL" \\
     -H "Content-Type: application/json" \\
     -d '{"content": "✅ Finished fixing PR #${task.prNumber}"}'
   
   Or using Node.js fetch:
   await fetch(process.env.DISCORD_WEBHOOK_URL, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ content: "✅ Finished fixing PR #${task.prNumber}" })
   })

If you encounter any errors that cannot be fixed, send a Discord notification with:
   {"content": "❌ Failed to fix PR #${task.prNumber}: {brief error description}"}
   
   Using curl:
   curl -X POST "$DISCORD_WEBHOOK_URL" \\
     -H "Content-Type: application/json" \\
     -d '{"content": "❌ Failed to fix PR #${task.prNumber}: {brief error description}"}'
   
   Or using Node.js fetch:
   await fetch(process.env.DISCORD_WEBHOOK_URL, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ content: "❌ Failed to fix PR #${task.prNumber}: {brief error description}" })
   })

Important:
- Discord webhooks are simple HTTP POST endpoints - no signatures or authentication needed
- Use curl, fetch, or any HTTP client to send POST requests
- The webhook URL is the only credential needed
- Make sure all fixes are correct and the code passes all checks
- Only commit and push if all diagnostics pass`;
}
