# AI Chat Backend Proxy

This endpoint provides a secure server-side proxy for AI chat functionality. The API key is kept secure on the backend and never exposed to clients.

## Endpoint

- `POST /api/ai/chat` - Handles AI chat requests

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

```json
{
  "message": "Full AI response text",
  "usage": {
    "promptTokens": 10,
    "completionTokens": 20
  },
  "finishReason": "stop"
}
```

## Security

- API key is stored server-side only (environment variable)
- No client has access to the Gemini API key
- Uses Vercel AI SDK for secure API communication
- Supports CORS for frontend integration

## Environment Variables

- `GEMINI_API_KEY`: Google Gemini API key (required)
