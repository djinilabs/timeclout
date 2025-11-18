import { badRequest, forbidden, methodNotAllowed } from "@hapi/boom";
import type { APIGatewayProxyEventV2, Context } from "aws-lambda";

import { createUserCache } from "../../../../../../libs/graphql/src/resolverContext";
import { getSession } from "../../../../../../libs/graphql/src/session/getSession";

/**
 * Validates HTTP method and extracts/validates request body
 */
export function validateRequest(
  event: APIGatewayProxyEventV2
): { messages: unknown[] } {
  // Validate HTTP method
  if (event.requestContext.http.method !== "POST") {
    throw methodNotAllowed("Method not allowed. Only POST is supported.");
  }

  // Parse and validate request body
  let messages: unknown[] = [];
  if (event.body) {
    const bodyText = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString()
      : event.body;
    try {
      const body = JSON.parse(bodyText) as {
        messages?: unknown[];
      };
      messages = body.messages || [];
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw badRequest("Invalid JSON in request body");
      }
      throw error;
    }
  }

  if (!Array.isArray(messages)) {
    throw badRequest("messages must be an array");
  }

  // Ensure we have at least one message
  if (messages.length === 0) {
    throw badRequest("messages array must not be empty");
  }

  return { messages };
}

/**
 * Authenticates user using timeclout's session system
 */
export async function authenticateUser(
  event: APIGatewayProxyEventV2
): Promise<{
  userCache: Awaited<ReturnType<typeof createUserCache>>;
  session: Awaited<ReturnType<typeof getSession>>;
}> {
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

  return { userCache, session };
}

