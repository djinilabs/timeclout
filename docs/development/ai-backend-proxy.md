# AI Backend Proxy - Security Implementation

This document explains the secure backend proxy implementation for AI chat functionality.

## Problem

Initially, the Gemini API key was **hardcoded in the frontend** (`apps/frontend/src/components/ai/useAIAgentChat.tsx`), which is a critical security vulnerability:

- ✅ **Exposed to everyone** - Anyone can view the JavaScript bundle
- ✅ **Risks** - Malicious users can abuse your API key
- ✅ **Costs** - Attackers can rack up charges on your account
- ✅ **No security** - No way to restrict usage

## Solution

We've implemented a **server-side backend proxy** that keeps the API key secure:

### Architecture

```
Frontend (Browser) → Backend API → Gemini API
                         ↑
                   API Key Secure
                   (Never in browser)
```

### Backend Implementation

**Location**: `apps/backend/src/http/post-api-ai-chat/index.ts`

```typescript
// API key is now on the backend, never exposed
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "", // Server-side only!
});
```

**Endpoint**: `POST /api/ai/chat`

### Frontend Changes

**Before**: Frontend directly called Gemini API with hardcoded key

```typescript
const google = createGoogleGenerativeAI({
  apiKey: "AIzaSy...", // 🚨 EXPOSED!
});
```

**After**: Frontend calls our backend proxy

```typescript
const response = await fetch(`${BACKEND_API_URL}/api/ai/chat`, {
  method: "POST",
  body: JSON.stringify({ messages }),
});
```

## Security Benefits

1. **API Key Protection**: Key is stored server-side in environment variables
2. **No Client Exposure**: Users never see the key in browser DevTools
3. **Controlled Access**: You can add authentication, rate limiting, etc.
4. **Usage Monitoring**: Track and control API usage server-side
5. **Cost Control**: Set budget limits and alerts

## Environment Setup

### GitHub Secrets

Add this secret to your GitHub repository:

- **Name**: `GEMINI_API_KEY`
- **Value**: Your Gemini API key from [Google Cloud Console](https://console.cloud.google.com/)

### Local Development

Add to `apps/backend/.env`:

```bash
GEMINI_API_KEY=your_key_here
```

## Deployment

The environment variable is automatically set in both production and PR previews via GitHub Actions.

## References

This implementation is based on the article: [Building Real-Time AI Streaming Services with AWS Lambda](https://metaduck.com/building-real-time-ai-streaming-services/)

## Next Steps

### Immediate Actions Required

1. ✅ **Revoke the exposed API key** in Google Cloud Console
2. ✅ **Create a new API key**
3. ✅ **Set API restrictions** on the new key:
   - HTTP referrers: `https://app.timeclout.com/*`
   - Or IP restrictions for extra security
4. ✅ **Add the new key** to GitHub Secrets as `GEMINI_API_KEY`
5. ✅ **Deploy** the changes

### Future Enhancements

- Add user authentication to the endpoint
- Implement rate limiting per user
- Add usage tracking and alerts
- Consider implementing true server-side streaming
- Add request logging for debugging

## Testing

Test the endpoint locally:

```bash
# Start backend
cd apps/backend && pnpm arc sandbox

# Test the endpoint
curl -X POST http://localhost:3333/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```
