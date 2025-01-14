import { APIGatewayEvent, APIGatewayProxyEventV2 } from "aws-lambda";
import { getSession as getExpressSession } from "@auth/express";
import { Request } from "express";
import { ResolverContext } from "../resolverContext";
import { authConfig } from "@/auth-config";
import { getDefined } from "@/utils";

const eventToRequest = (event: APIGatewayProxyEventV2): Request => {
  const headers = new Headers(
    Object.fromEntries(
      Object.entries(event.headers).filter(([_, v]) => v !== undefined)
    ) as Record<string, string>
  );
  if (event.cookies?.length) {
    headers.set("cookie", event.cookies.join("; "));
  }
  headers.set("accept", "application/json");
  return {
    protocol: getDefined(event.headers.host?.split(":")[0]),
    url: `${event.headers.host}/api/v1/auth/session`,
    method: "GET",
    headers: Object.fromEntries(headers.entries()),
    cookies: event.cookies,
  };
};

export const getSession = async (ctx: ResolverContext) => {
  const request = eventToRequest(ctx.event);
  return getExpressSession(request, await authConfig());
};
