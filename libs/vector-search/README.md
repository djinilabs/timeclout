# Vector Search Library

A Rust/WASM-based vector search library for semantic search over help content.

## Overview

This library provides efficient cosine similarity search over vector embeddings, compiled to WebAssembly for use in browser Web Workers.

## Building

```bash
# Install wasm-pack if not already installed
# curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Build WASM module
cd libs/vector-search
wasm-pack build --target web --out-dir ../../apps/frontend/src/lib/vectorSearch/wasm
```

Or use the npm script:

```bash
pnpm build:vector-search
```

## Testing

```bash
# Run Rust unit tests
cd libs/vector-search
cargo test

# Run WASM tests (requires wasm-pack)
wasm-pack test --headless --firefox
```

## Usage

The library is used through the TypeScript client wrapper (`apps/frontend/src/lib/vectorSearch/vectorSearchClient.ts`), which manages the Web Worker and WASM module loading.

## Architecture

- **Rust Core**: Vector search implementation with cosine similarity
- **WASM Bindings**: Exposes Rust functions to JavaScript via wasm-bindgen
- **Web Worker**: Runs WASM module in background thread
- **TypeScript Client**: Provides type-safe API for frontend use

## Performance

- Optimized for size with `opt-level = "z"` and LTO
- Efficient binary embedding storage
- Batch processing support

