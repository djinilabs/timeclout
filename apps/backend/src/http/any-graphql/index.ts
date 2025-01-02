import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { createSchema, createYoga } from "graphql-yoga";
import { resolvers } from "../../../../../libs/graphql/src/resolvers.generated";
import schema from "../../../../../libs/graphql/src/schema.generated.graphqls";

// console.log("schema:", schema);

const yoga = createYoga<{
  event: APIGatewayEvent;
  lambdaContext: Context;
}>({
  // You need to specify the path to your lambda function
  graphqlEndpoint: "/graphql",
  schema: createSchema({
    typeDefs: schema,
    resolvers,
  }),
  logging: false,
});

export async function handler(
  event: APIGatewayEvent,
  lambdaContext: Context
): Promise<APIGatewayProxyResult> {
  const response = await yoga.fetch(
    event.path +
      "?" +
      new URLSearchParams(
        (event.queryStringParameters as Record<string, string>) || {}
      ).toString(),
    {
      method: event.httpMethod,
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
