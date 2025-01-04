import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { createSchema, createYoga } from "graphql-yoga";
import { resolvers } from "../../../../../libs/graphql/src/resolvers.generated";
// @ts-ignore
import schema from "../../../../../libs/graphql/src/schema.generated.graphqls";
import { handlingErrors } from "../../utils/handlingErrors";
import { ResolverContext } from "@/graphql";

// console.log("schema:", schema);

const yoga = createYoga<ResolverContext>({
  // You need to specify the path to your lambda function
  graphqlEndpoint: "/graphql",
  schema: createSchema({
    typeDefs: schema,
    resolvers,
  }),
  logging: true,
});

export const handler = handlingErrors(
  async (
    event: APIGatewayEvent,
    lambdaContext: Context
  ): Promise<APIGatewayProxyResult> => {
    const response = await yoga.fetch(
      (event.path ?? event.rawPath) +
        "?" +
        new URLSearchParams(
          (event.queryStringParameters as Record<string, string>) || {}
        ).toString(),
      {
        method: event.requestContext.http.method,
        headers: event.headers as HeadersInit,
        body: event.body
          ? Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8")
          : undefined,
      },
      {
        event,
        lambdaContext,
      }
    );

    const responseHeaders = Object.fromEntries(response.headers.entries());

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: await response.text(),
      isBase64Encoded: false,
    };
  }
);
