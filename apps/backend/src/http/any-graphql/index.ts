import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { createSchema, createYoga, useLogger } from "graphql-yoga";
import { resolvers } from "../../../../../libs/graphql/src/resolvers.generated";
// @ts-ignore
import schema from "../../../../../libs/graphql/src/schema.generated.graphqls";
import { handlingErrors } from "../../utils/handlingErrors";
// force import because bundler doesn't include it
import client from "@aws-lite/client";
console.log("AWS lite client", client);

const yoga = createYoga({
  graphqlEndpoint: "/graphql",
  schema: createSchema({
    typeDefs: schema,
    resolvers,
  }),
  maskedErrors: false,
  landingPage: false,
  graphiql: false,
  plugins: [
    useSentry({
      includeRawResult: false,
      includeExecuteVariables: false,
    }),
    useLogger({
      logFn: (event, { args, result }) => {
        if (event == "execute-start") {
          console.log(
            `[graphql] [${event}] [${args.operationName}] %s`,
            JSON.stringify(args.variableValues, null, 2)
          );
        } else if (event == "execute-end") {
          console.log(
            `[graphql] [${event}] [${args.operationName}] %s`,
            JSON.stringify(
              { args: args.variableValues, result: result.data },
              null,
              2
            )
          );
        }
      },
    }),
  ],
});

export const handler = handlingErrors(
  async (
    event: APIGatewayProxyEventV2,
    lambdaContext: Context
  ): Promise<APIGatewayProxyResult> => {
    const response = await yoga.fetch(
      event.rawPath +
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
