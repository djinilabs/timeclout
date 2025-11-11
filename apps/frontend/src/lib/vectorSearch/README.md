# Vector Search Client

TypeScript client for vector search functionality, providing semantic search over help content.

## Usage

```typescript
import { getVectorSearchClient } from "./vectorSearchClient";

const client = getVectorSearchClient();
await client.initialize("en"); // or "pt"

const results = await client.search("how to create shifts", "en", 5);
// Returns array of SearchResult with text, score, and metadata
```

## Architecture

- **VectorSearchClient**: Main client class managing worker lifecycle
- **vectorSearchWorker**: Web Worker that loads WASM module and performs searches
- **WASM Module**: Rust-compiled vector search library

## Integration

The client is integrated into the AI tools system via `search_help_content` tool, allowing the AI agent to search help documentation on-demand.

