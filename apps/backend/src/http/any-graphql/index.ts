/* eslint-disable react-hooks/rules-of-hooks */
import { useSentry } from "@envelop/sentry";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  createSchema,
  createYoga,
  useLogger,
  useErrorHandler,
} from "graphql-yoga";

import { createUserCache } from "../../../../../libs/graphql/src/resolverContext";
import { resolvers } from "../../../../../libs/graphql/src/resolvers.generated";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import schema from "../../../../../libs/graphql/src/schema.generated.graphqls";
import {
  getLocaleFromHeaders,
  initI18n,
} from "../../../../../libs/locales/src";
import { handlingErrors } from "../../utils/handlingErrors";

const yoga = createYoga({
  graphqlEndpoint: "/graphql",
  schema: createSchema({
    typeDefs: schema,
    resolvers,
  }),
  maskedErrors: false,
  landingPage: false,
  graphiql: false,
  context: async ({ request }) => {
    const userCache = await createUserCache();

    // Extract locale from accept-language header
    const acceptLanguage = request.headers.get("accept-language");
    const locale = getLocaleFromHeaders(acceptLanguage || undefined);

    // Initialize i18n for this request
    await initI18n(locale);

    return {
      userCache,
      locale,
    };
  },
  plugins: [
    useSentry({
      includeRawResult: false,
      includeExecuteVariables: false,
    }),
    useLogger({
      logFn: (event, { args, result }) => {
        if (!process.env.DEBUG_GRAPHQL) {
          return;
        }
        if (event == "execute-start") {
          console.log(
            `[graphql] [${event}] [${args.operationName}] %s`,
            JSON.stringify(args.variableValues, undefined, 2)
          );
        } else if (event == "execute-end") {
          console.log(
            `[graphql] [${event}] [${args.operationName}] %s`,
            JSON.stringify(
              { args: args.variableValues, result: result.data },
              undefined,
              2
            )
          );
        }
      },
    }),
    useErrorHandler(({ errors, phase }) => {
      for (const error of errors) {
        console.error(`[graphql] [error in phase ${phase}]`, error);
      }
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
