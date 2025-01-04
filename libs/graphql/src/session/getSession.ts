import { APIGatewayEvent } from "aws-lambda";
import { getSession as getExpressSession } from "@auth/express";
import { Request } from "express";
import { ResolverContext } from "../resolverContext";
import { authConfig } from "@/auth-config";

const eventToRequest = (event: APIGatewayEvent): Request => {
  const headers = new Headers(event.headers);
  if (event.cookies?.length) {
    headers.set("cookie", event.cookies.join("; "));
  }
  headers.set("accept", "application/json");
  return {
    protocol: event.headers.host?.split(":")[0],
    url: `${event.headers.host}/api/v1/auth/session`,
    method: "GET",
    headers,
    cookies: event.cookies,
  };
};

export const getSession = async (ctx: ResolverContext) => {
  const request = eventToRequest(ctx.event);
  return getExpressSession(request, await authConfig());
};
