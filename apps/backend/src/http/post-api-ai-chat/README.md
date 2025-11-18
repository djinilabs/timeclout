# AI Chat Backend Proxy - Synchronous Implementation

This endpoint provides a secure server-side proxy for AI chat functionality using synchronous API Gateway handlers.

## Architecture

- Uses API Gateway HTTP endpoints (standard Lambda functions)
- Synchronous JSON responses using `generateText` from AI SDK
- API key stored server-side only (environment variable)
- Supports tool calls that are executed on the frontend

## Endpoint

- `POST /api/ai/chat` - Handles AI chat requests via API Gateway

## Request Format

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how can I help you?"
    }
  ]
}
```

## Response Format

The response is returned as JSON with the complete AI message:

```json
{
  "id": "chat-1234567890",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gemini-2.5-flash-preview-05-20",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  }
}
```

If the AI requests tool calls, they are included in the response:

```json
{
  "tool_calls": [
    {
      "id": "call_123",
      "type": "function",
      "function": {
        "name": "describe_app_ui",
        "arguments": "{}"
      }
    }
  ]
}
```

## Key Implementation Details

### Backend Handler

```typescript
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  // Authentication and validation
  const session = await getSession(minimalContext);
  if (!session) {
    throw forbidden("Authentication required");
  }

  // Generate AI response
  const result = await generateText({
    model,
    system: systemPrompt,
    messages: convertToModelMessages(nonSystemMessages),
    tools,
    toolChoice: "auto",
  });

  // Return JSON response
  return {
    statusCode: 200,
    body: JSON.stringify(responseBody),
    headers: { "Content-Type": "application/json" },
  };
};
```

### Frontend Integration

The frontend uses `useChat` from `@ai-sdk/react` with `DefaultChatTransport`, which automatically handles both streaming and non-streaming responses. The transport will parse the JSON response and update the chat state accordingly.

## Deployment

This endpoint uses the standard `@http` directive in `app.arc`:

- Routes through API Gateway
- Standard Lambda function invocation
- Supports local development via Architect sandbox

## Local Development

Architect sandbox automatically handles the endpoint in local environment:

```bash
pnpm dev
```

## Security

- API key is stored server-side only (environment variable)
- No client has access to the Gemini API key
- Uses Vercel AI SDK for secure API communication
- Authentication required for all requests

## Environment Variables

- `GEMINI_API_KEY`: Google Gemini API key (required)

## Tool Execution

Tools are defined on the backend but executed on the frontend. When the AI requests a tool call, it's included in the response, and the frontend's `onToolCall` handler executes the tool and sends the result back in the next request.
