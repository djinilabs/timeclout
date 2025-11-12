export interface SearchResult {
  text: string;
  score: number;
  metadata: {
    section: string;
    language: string;
    feature?: string;
    type: string;
  };
}

export interface WorkerSearchRequest {
  type: "search";
  query: string; // Changed from queryEmbedding to query text
  language: "en" | "pt";
  topK?: number;
}

export interface WorkerSearchResponse {
  type: "results";
  results: SearchResult[];
}

export interface WorkerErrorResponse {
  type: "error";
  error: string;
}

export interface WorkerInitRequest {
  type: "init";
  language: "en" | "pt";
}

export interface WorkerInitResponse {
  type: "init-complete";
  language: "en" | "pt";
}

export type WorkerRequest = WorkerSearchRequest | WorkerInitRequest;
export type WorkerResponse =
  | WorkerSearchResponse
  | WorkerErrorResponse
  | WorkerInitResponse;
