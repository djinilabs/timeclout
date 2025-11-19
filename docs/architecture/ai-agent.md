# AI Agent Architecture

This document provides a technical overview of how the TimeClout AI Agent works, including its architecture, components, and implementation details.

## Overview

The TimeClout AI Agent is an intelligent assistant that helps users navigate the application, answer questions, and perform tasks. It uses Google's Gemini 2.5 Flash model and can interact with the application UI through a set of tools, making it capable of both answering questions and performing actions.

## Architecture

The AI Agent follows a client-server architecture with tool execution on the frontend:

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │────────▶│   Backend    │────────▶│  Gemini API │
│  (Browser)  │         │  (Lambda)    │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │
      │                        │
      ▼                        ▼
┌─────────────┐         ┌──────────────┐
│   Tools     │         │  Embedding   │
│ (Frontend)  │         │   Endpoint   │
└─────────────┘         └──────────────┘
```

### Key Components

1. **Backend API** (`apps/backend/src/http/post-api-ai-chat/index.ts`): Handles AI requests, manages authentication, and communicates with Gemini API
2. **Frontend Hook** (`apps/frontend/src/components/ai/useAIAgentChat.tsx`): Manages chat state, message flow, and tool execution
3. **UI Components** (`apps/frontend/src/components/ai/AIChatPanel.tsx`): Provides the chat interface
4. **Tools**: Frontend-executed functions that allow the AI to interact with the application
5. **Embedding Service** (`apps/backend/src/http/post-api-ai-embedding/index.ts`): Generates embeddings for document search

## Backend Implementation

### API Endpoint

The main AI chat endpoint is located at [`apps/backend/src/http/post-api-ai-chat/index.ts`](../../apps/backend/src/http/post-api-ai-chat/index.ts).

**Key Features:**
- **Authentication**: Requires authenticated user session
- **Internationalization**: Supports English and Portuguese based on `Accept-Language` header
- **Model**: Uses Gemini 2.5 Flash (`gemini-2.5-flash`)
- **Tool Definitions**: Defines available tools for the AI (execution happens on frontend)

### API Key Management

The Gemini API key is securely stored server-side and never exposed to the client. See [AI API Key Flow](../development/ai-api-key-flow.md) for details on how the key flows from GitHub Secrets to the Lambda environment.

**Key Configuration:**
```typescript
const apiKey = process.env.GEMINI_API_KEY || "";
const googleClient = createGoogleGenerativeAI({
  apiKey,
  fetch: customFetch,
});
```

### System Prompts

The backend defines system prompts in both English and Portuguese that instruct the AI on:
- Its role as TimeClout AI Assistant
- Available tools and how to use them
- Best practices for tool usage

See [system prompts](../../apps/backend/src/http/post-api-ai-chat/index.ts#L48-L90) for the full prompt definitions.

### Request/Response Format

**Request:**
```typescript
{
  messages: Array<{
    role: "user" | "assistant" | "system" | "tool";
    content: string | unknown[];
  }>;
}
```

**Response:**
```typescript
{
  text: string;
  toolCalls?: Array<{
    toolCallId: string;
    toolName: string;
    args: unknown;
  }>;
  toolResults?: unknown[];
  finishReason?: string;
}
```

## Frontend Implementation

### Chat Hook

The main chat logic is in [`apps/frontend/src/components/ai/useAIAgentChat.tsx`](../../apps/frontend/src/components/ai/useAIAgentChat.tsx).

**Responsibilities:**
- Managing chat message state
- Sending messages to backend API
- Executing tools when AI requests them
- Handling tool call iterations (with safety limit of 10)
- Persisting chat history

### Message Flow

1. User submits a message
2. Message is saved and sent to backend
3. Backend returns AI response (may include tool calls)
4. If tool calls are present:
   - Tools are executed on the frontend
   - Tool results are sent back to backend
   - Process repeats until AI provides final text response
5. Final response is displayed to user

### Tool Execution Loop

The frontend implements a tool execution loop with safety limits:

```typescript
const MAX_TOOL_CALL_ITERATIONS = 10;

while (
  response.toolCalls &&
  response.toolCalls.length > 0 &&
  toolCallIterations < MAX_TOOL_CALL_ITERATIONS
) {
  // Execute tools and send results back
  // Continue until AI provides final response
}
```

This prevents infinite loops while allowing the AI to perform multi-step tasks.

## Tool System

The AI Agent has access to four tools that execute on the frontend:

### 1. describe_app_ui

**Purpose**: Describes the current application UI state by scanning the DOM.

**Implementation**: [`apps/frontend/src/components/ai/useAIAgentChat.tsx#L60-L64`](../../apps/frontend/src/components/ai/useAIAgentChat.tsx#L60-L64)

**How it works:**
- Generates an Accessibility Object Model (AOM) from the DOM
- Returns a structured text description of all accessible elements
- Used by AI to understand what's on screen before taking actions

**Related Code:**
- AOM Generation: [`apps/frontend/src/accessibility/generateAOM.ts`](../../apps/frontend/src/accessibility/generateAOM.ts)
- AOM Printing: [`apps/frontend/src/accessibility/printAOM.ts`](../../apps/frontend/src/accessibility/printAOM.ts)

### 2. click_element

**Purpose**: Clicks on UI elements to navigate or interact.

**Implementation**: [`apps/frontend/src/components/ai/useAIAgentChat.tsx#L66-L110`](../../apps/frontend/src/components/ai/useAIAgentChat.tsx#L66-L110)

**Parameters:**
- `role`: The ARIA role of the element
- `description`: The element's description (from `describe_app_ui`)

**How it works:**
1. Generates AOM with DOM elements included
2. Finds element matching role and description
3. Verifies element is clickable
4. Simulates click event
5. Waits for UI to update (debounce activity)

### 3. fill_form_element

**Purpose**: Fills in form fields with values.

**Implementation**: [`apps/frontend/src/components/ai/useAIAgentChat.tsx#L112-L191`](../../apps/frontend/src/components/ai/useAIAgentChat.tsx#L112-L191)

**Parameters:**
- `role`: The ARIA role of the form element
- `description`: The element's description
- `value`: The value to fill

**How it works:**
- Supports multiple input types:
  - Text inputs and textareas
  - Checkboxes (value: "true"/"false")
  - Radio buttons
  - Select dropdowns
  - Comboboxes (opens dropdown first)
- Triggers React change/input events to ensure framework detects changes
- Waits for UI to update after filling

### 4. search_documents

**Purpose**: Performs semantic search through product documentation.

**Implementation**: [`apps/frontend/src/components/ai/useAIAgentChat.tsx#L193-L220`](../../apps/frontend/src/components/ai/useAIAgentChat.tsx#L193-L220)

**Parameters:**
- `query`: Search query string
- `topN`: Number of results (default: 5)

**How it works:**
1. Uses document search manager to perform vector search
2. Returns formatted results with relevant documentation snippets
3. Helps AI answer questions about features and workflows

**Related Code:**
- Document Search Manager: [`apps/frontend/src/utils/docSearchManager.ts`](../../apps/frontend/src/utils/docSearchManager.ts)
- Embedding Endpoint: [`apps/backend/src/http/post-api-ai-embedding/index.ts`](../../apps/backend/src/http/post-api-ai-embedding/index.ts)

## Accessibility Object Model (AOM)

The AOM is a structured representation of the DOM that focuses on accessible elements. It's used by the AI tools to understand and interact with the UI.

**Key Features:**
- Only includes elements with both a role and description
- Preserves ARIA attributes
- Can optionally include DOM element references for interaction
- Filters out hidden elements

**Implementation:**
- Generation: [`apps/frontend/src/accessibility/generateAOM.ts`](../../apps/frontend/src/accessibility/generateAOM.ts)
- Element Finding: [`apps/frontend/src/accessibility/findFirstElement.ts`](../../apps/frontend/src/accessibility/findFirstElement.ts)
- Types: [`apps/frontend/src/accessibility/types.ts`](../../apps/frontend/src/accessibility/types.ts)

## Document Search

The document search feature uses semantic vector search to find relevant documentation snippets.

### Embedding Generation

The backend provides an endpoint at [`apps/backend/src/http/post-api-ai-embedding/index.ts`](../../apps/backend/src/http/post-api-ai-embedding/index.ts) that:
- Generates embeddings using Google's `text-embedding-004` model
- Implements exponential backoff retry logic for rate limiting
- Requires authentication
- Handles referrer restrictions gracefully

### Search Process

1. Documents are indexed in a web worker (background process)
2. User query is converted to embedding
3. Vector similarity search finds relevant snippets
4. Results are formatted and returned to AI

**Document Search Manager**: [`apps/frontend/src/utils/docSearchManager.ts`](../../apps/frontend/src/utils/docSearchManager.ts)

## Security

### API Key Protection

The Gemini API key is never exposed to the client:
- Stored in AWS Systems Manager Parameter Store
- Injected as Lambda environment variable
- Only accessible server-side

See [AI Backend Proxy](../development/ai-backend-proxy.md) for security implementation details.

### Authentication

Both endpoints require authenticated user sessions:
- Chat endpoint: [`apps/backend/src/http/post-api-ai-chat/index.ts#L195-L205`](../../apps/backend/src/http/post-api-ai-chat/index.ts#L195-L205)
- Embedding endpoint: [`apps/backend/src/http/post-api-ai-embedding/index.ts#L62-L72`](../../apps/backend/src/http/post-api-ai-embedding/index.ts#L62-L72)

### Tool Execution Safety

- Tool execution happens on frontend (user's browser)
- Tools can only interact with the current page
- No direct access to backend systems
- Activity debouncing prevents rapid-fire actions

## Internationalization

The AI Agent supports multiple languages:
- **English**: Default system prompt
- **Portuguese**: Portuguese system prompt

Language is determined from the `Accept-Language` header sent by the frontend.

**Implementation**: [`apps/backend/src/http/post-api-ai-chat/index.ts#L212-L221`](../../apps/backend/src/http/post-api-ai-chat/index.ts#L212-L221)

## Error Handling

### Backend Errors

The backend uses Boom error handling and returns appropriate HTTP status codes:
- `400`: Bad request (invalid JSON, missing fields)
- `401`: Unauthorized (authentication required)
- `405`: Method not allowed
- `500`: Internal server error

**Error Handling**: [`apps/backend/src/http/post-api-ai-chat/index.ts#L345-L369`](../../apps/backend/src/http/post-api-ai-chat/index.ts#L345-L369)

### Frontend Errors

Frontend errors are caught and displayed as error messages in the chat:
- Network errors
- Tool execution errors
- API errors

**Error Handling**: [`apps/frontend/src/components/ai/useAIAgentChat.tsx#L508-L525`](../../apps/frontend/src/components/ai/useAIAgentChat.tsx#L508-L525)

## Chat History

Chat messages are persisted using the `useAIChatHistory` hook, allowing users to:
- View previous conversations
- Continue conversations across sessions
- Clear chat history

**Implementation**: Referenced in [`apps/frontend/src/components/ai/useAIAgentChat.tsx#L246`](../../apps/frontend/src/components/ai/useAIAgentChat.tsx#L246)

## UI Components

### AIChatPanel

The main chat interface component: [`apps/frontend/src/components/ai/AIChatPanel.tsx`](../../apps/frontend/src/components/ai/AIChatPanel.tsx)

**Features:**
- Message display
- Input textarea with auto-resize
- Submit button
- Clear history button
- Close button

### AIChatMessagePanel

Displays individual messages with Markdown rendering: [`apps/frontend/src/components/ai/AIChatMessagePanel.tsx`](../../apps/frontend/src/components/ai/AIChatMessagePanel.tsx)

## Configuration

### Environment Variables

**Backend:**
- `GEMINI_API_KEY`: Google Gemini API key (required)
- `GEMINI_REFERER`: Referer header for API calls (optional)

**Frontend:**
- `VITE_BACKEND_URL`: Backend API URL (for embedding endpoint)

### Model Configuration

- **Model**: `gemini-2.5-flash`
- **Embedding Model**: `text-embedding-004`

## Related Documentation

- [AI Backend Proxy](../development/ai-backend-proxy.md) - Security implementation
- [AI API Key Flow](../development/ai-api-key-flow.md) - API key management
- [Backend README](../../apps/backend/src/http/post-api-ai-chat/README.md) - Endpoint documentation

## Future Enhancements

Potential improvements:
- Server-side streaming for real-time token delivery
- Rate limiting per user
- Usage tracking and analytics
- Additional tools for more complex interactions
- Conversation context management
- Multi-modal support (images, files)

