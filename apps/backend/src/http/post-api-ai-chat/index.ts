import { forbidden } from "@hapi/boom";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { createUserCache } from "../../../../../libs/graphql/src/resolverContext";
import { getSession } from "../../../../../libs/graphql/src/session/getSession";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
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

    // Return simple payload
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "AI chat is disabled" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error in handler:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const statusCode =
      error && typeof error === "object" && "output" in error
        ? (error as { output?: { statusCode?: number } }).output?.statusCode ||
          500
        : 500;
    return {
      statusCode,
      body: JSON.stringify({ error: errorMessage }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
