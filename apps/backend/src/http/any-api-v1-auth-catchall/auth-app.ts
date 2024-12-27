import { ExpressAuth } from "@auth/express";
import express from "express";
import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import Mailgun from "next-auth/providers/mailgun";

const config: DynamoDBClientConfig = {
  // region: process.env.AUTH_DYNAMODB_REGION,
  endpoint: process.env.AUTH_DYNAMODB_ENDPOINT,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});
const app = express();
app.set("trust proxy", true);

app.use(
  "/api/v1/auth/*",
  ExpressAuth({
    providers: [Mailgun({ name: "Email" })],
    adapter: DynamoDBAdapter(client),
    debug: true,
  })
);

export { app };
