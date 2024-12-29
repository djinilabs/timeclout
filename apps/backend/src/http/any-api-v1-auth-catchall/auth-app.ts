import { ExpressAuth } from "@auth/express";
import express from "express";
import { tables } from "@architect/functions";
import Mailgun from "next-auth/providers/mailgun";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export const createApp = async () => {
  const app = express();
  app.set("trust proxy", true);
  const client = await tables({
    awsSdkClient: true,
    awsjsonMarshall: { convertClassInstanceToMap: true },
    awsjsonUnmarshall: { convertWithoutMapWrapper: false },
  });

  const tableName = await client.name("next-auth");

  const clientDoc: DynamoDBDocument =
    client._doc as unknown as DynamoDBDocument;
  app.use(
    "/api/v1/auth/*",
    ExpressAuth({
      providers: [Mailgun({ name: "Email", from: "info@tt3.app" })],
      adapter: DynamoDBAdapter(clientDoc, {
        tableName,
        indexPartitionKey: "pk",
        indexSortKey: "sk",
      }),
      debug: true,
    })
  );

  return app;
};
