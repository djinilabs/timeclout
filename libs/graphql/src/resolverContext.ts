import { APIGatewayProxyEventV2, Context } from "aws-lambda";

export type ResolverContext = {
  event: APIGatewayProxyEventV2;
  lambdaContext: Context;
};
