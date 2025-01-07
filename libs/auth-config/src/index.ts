import Mailgun from "next-auth/providers/mailgun";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { tables } from "@architect/functions";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { once } from "@/utils";
import { database } from "@/tables";
import { ExpressAuthConfig } from "@auth/express";

export const authConfig = once(async (): Promise<ExpressAuthConfig> => {
  // @ts-expect-error
  const client = await tables({
    awsSdkClient: true,
    awsjsonMarshall: { convertClassInstanceToMap: true },
    awsjsonUnmarshall: { convertWithoutMapWrapper: false },
  });
  const tableName = await client.name("next-auth");

  const clientDoc: DynamoDBDocument =
    client._doc as unknown as DynamoDBDocument;

  return {
    basePath: "/api/v1/auth",
    session: {
      strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    providers: [Mailgun({ name: "TT3", from: "info@tt3.app" })],
    adapter: DynamoDBAdapter(clientDoc, {
      tableName,
      indexPartitionKey: "pk",
      indexSortKey: "sk",
    }),
    callbacks: {
      async jwt({ token, account, user, profile }) {
        if (account?.type === "email" && account.providerAccountId) {
          token.email = account.providerAccountId;
          token.id = token.sub;
        }
        return token;
      },
      async session({ session, user, token }) {
        session.user.id = token.sub;
        return session;
      },
    },
    events: {
      signIn: async ({ user, isNewUser }) => {
        console.log("signIn", user, isNewUser);
        const { entity } = await database();
        const userPk = `users/${user.id}`;
        if (isNewUser) {
          await entity.create({
            pk: userPk,
            name: user.name ?? user.email ?? "Unknown",
            email: user.email,
            createdAt: new Date().toISOString(),
            createdBy: userPk,
            ...user,
          });
        }
      },
    },
  };
});
