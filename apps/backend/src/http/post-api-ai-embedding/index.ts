import { forbidden } from "@hapi/boom";
import { Context } from "aws-lambda";

import { createUserCache } from "../../../../../libs/graphql/src/resolverContext";
import { getSession } from "../../../../../libs/graphql/src/session/getSession";

import { getDefined } from "@/utils";

const EMBEDDING_MODEL = "text-embedding-004";

// Exponential backoff configuration
const BACKOFF_INITIAL_DELAY_MS = 1000; // 1 second
const BACKOFF_MAX_RETRIES = 5;
const BACKOFF_MAX_DELAY_MS = 60000; // 60 seconds
const BACKOFF_MULTIPLIER = 2;

/**
 * Check if an error is a throttling/rate limit error
 */
function isThrottlingError(status: number, errorText: string): boolean {
  return (
    status === 429 ||
    errorText.toLowerCase().includes("quota") ||
    errorText.toLowerCase().includes("rate limit") ||
    errorText.toLowerCase().includes("throttle") ||
    errorText.toLowerCase().includes("too many requests")
  );
}

/**
 * Sleep for a given duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface EmbeddingRequest {
  text: string;
}

export interface EmbeddingResponse {
  embedding: number[];
}

export const handler = async (event: {
  requestContext: { http: { method: string } };
  body?: string;
  isBase64Encoded?: boolean;
}): Promise<{
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}> => {
  try {
    // Only handle POST requests
    if (event.requestContext.http.method !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Check authentication - user must be authenticated to use this endpoint
    const userCache = await createUserCache();
    const minimalContext = {
      event,
      lambdaContext: {} as Context,
      userCache,
    };
    const session = await getSession(minimalContext);
    if (!session) {
      throw forbidden("Authentication required to access this endpoint");
    }

    // Parse request body
    let body: EmbeddingRequest;
    if (event.body) {
      body = JSON.parse(
        event.isBase64Encoded
          ? Buffer.from(event.body, "base64").toString()
          : event.body
      );
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is required" }),
      };
    }

    // Validate text
    if (!body.text || typeof body.text !== "string" || body.text.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Text parameter is required and cannot be empty" }),
      };
    }

    const apiKey = getDefined(
      process.env.GEMINI_API_KEY,
      "GEMINI_API_KEY is not set"
    );

    // Generate embedding with retry logic
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= BACKOFF_MAX_RETRIES; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;

        const requestBody = {
          content: {
            parts: [{ text: body.text.trim() }],
          },
        };

        const referer =
          process.env.GEMINI_REFERER || "http://localhost:3000/api/ai/embedding";

        const headers: HeadersInit = {
          "Content-Type": "application/json",
          Referer: referer,
          referer: referer, // lowercase version
        };

        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          referrer: referer,
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[generateEmbedding] API error response: ${errorText}`);

          // Check if it's a referrer restriction error (don't retry this)
          if (
            (response.status === 403 && errorText.includes("referer")) ||
            errorText.includes("referrer")
          ) {
            const errorMsg = `API key referrer restriction error. For server-side API calls, the GEMINI_API_KEY should be configured WITHOUT HTTP referrer restrictions in Google Cloud Console. Instead, use IP address restrictions or no application restrictions. Current error: ${errorText}`;
            console.error(`[generateEmbedding] ${errorMsg}`);
            return {
              statusCode: 500,
              body: JSON.stringify({ error: errorMsg }),
            };
          }

          // Check if it's a throttling error and we have retries left
          if (
            isThrottlingError(response.status, errorText) &&
            attempt < BACKOFF_MAX_RETRIES
          ) {
            // Calculate delay with exponential backoff and jitter
            const baseDelay = Math.min(
              BACKOFF_INITIAL_DELAY_MS * Math.pow(BACKOFF_MULTIPLIER, attempt),
              BACKOFF_MAX_DELAY_MS
            );
            // Add jitter: random value between 0 and 20% of base delay
            const jitter = Math.random() * baseDelay * 0.2;
            const delay = baseDelay + jitter;

            await sleep(delay);
            lastError = new Error(
              `Failed to generate embedding: ${response.status} ${errorText}`
            );
            continue;
          }

          // Not a throttling error or no retries left, return error
          return {
            statusCode: response.status,
            body: JSON.stringify({
              error: `Failed to generate embedding: ${response.status} ${errorText}`,
            }),
          };
        }

        const data = (await response.json()) as {
          embedding?: { values?: number[] };
        };

        if (!data.embedding?.values) {
          console.error(
            `[generateEmbedding] Invalid response format:`,
            JSON.stringify(data).substring(0, 200)
          );
          return {
            statusCode: 500,
            body: JSON.stringify({ error: "Invalid embedding response format" }),
          };
        }

        const responseBody: EmbeddingResponse = {
          embedding: data.embedding.values,
        };

        return {
          statusCode: 200,
          body: JSON.stringify(responseBody),
          headers: {
            "Content-Type": "application/json",
          },
        };
      } catch (error) {
        // Check if it's a network/fetch error that might be retryable
        if (
          error instanceof TypeError &&
          (error.message.includes("fetch") || error.message.includes("network"))
        ) {
          if (attempt < BACKOFF_MAX_RETRIES) {
            const baseDelay = Math.min(
              BACKOFF_INITIAL_DELAY_MS * Math.pow(BACKOFF_MULTIPLIER, attempt),
              BACKOFF_MAX_DELAY_MS
            );
            const jitter = Math.random() * baseDelay * 0.2;
            const delay = baseDelay + jitter;

            await sleep(delay);
            lastError = error as Error;
            continue;
          }
        }

        // If we've exhausted retries or it's a non-retryable error, throw
        if (
          attempt === BACKOFF_MAX_RETRIES ||
          !isThrottlingError(
            0,
            error instanceof Error ? error.message : String(error)
          )
        ) {
          console.error(`[generateEmbedding] Error generating embedding:`, error);
          return {
            statusCode: 500,
            body: JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : `Failed to generate embedding: ${String(error)}`,
            }),
          };
        }

        lastError = error as Error;
      }
    }

    // If we get here, all retries were exhausted
    if (lastError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: lastError.message || "Failed to generate embedding: Unknown error",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate embedding: Unknown error" }),
    };
  } catch (error) {
    console.error("Error in embedding handler:", error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      statusCode: error instanceof Error && "output" in error
        ? (error as { output?: { statusCode?: number } }).output?.statusCode || 500
        : 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

