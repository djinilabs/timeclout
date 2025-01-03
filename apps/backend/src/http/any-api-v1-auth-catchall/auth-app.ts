import { ExpressAuth } from "@auth/express";
import express from "express";
import { tables } from "@architect/functions";
import Mailgun from "next-auth/providers/mailgun";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { database } from "@/tables";

export const createApp = async () => {
  const app = express();
  app.set("trust proxy", true);
  // @ts-expect-error
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
      session: {
        strategy: "jwt",
      },
      providers: [Mailgun({ name: "TT3", from: "info@tt3.app" })],
      adapter: DynamoDBAdapter(clientDoc, {
        tableName,
        indexPartitionKey: "pk",
        indexSortKey: "sk",
      }),
      callbacks: {
        async jwt({ token, user, account, profile }) {
          if (account?.type === "email" && account.providerAccountId) {
            token.email = account.providerAccountId;
          }
          return token;
        },
      },
      events: {
        signIn: async ({ user, account, profile }) => {
          const { entity } = await database();
          const userPk = `users/${user.id}`;
          await entity.update({
            pk: userPk,
            updatedBy: userPk,
            ...user,
          });
        },
      },
    })
  );

  return app;
};
