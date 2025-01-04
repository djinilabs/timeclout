import { APIGatewayEvent, Context } from "aws-lambda";

export type ResolverContext = {
  event: APIGatewayEvent;
  lambdaContext: Context;
};
