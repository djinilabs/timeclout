// @ts-ignore
import asap from "@architect/asap";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";

const spaHandler = asap({
  spa: true,
});

export const handler = async (
  event: APIGatewayProxyEventV2,
  lambdaContext: Context
) => {
  console.error("ANY CATCH ALL");
  const path = event.rawPath;
  console.error("path", path);
  if (path === "/" || path === "/homepage") {
    return spaHandler(
      { ...event, rawPath: "/homepage/index.html" },
      lambdaContext
    );
  }
  return spaHandler(event, lambdaContext);
};
