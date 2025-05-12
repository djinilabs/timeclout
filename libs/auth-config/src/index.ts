import Mailgun from "next-auth/providers/mailgun";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { tables } from "@architect/functions";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { getDefined, once, resourceRef } from "@/utils";
import { database, EntityRecord } from "@/tables";
import { ExpressAuthConfig } from "@auth/express";

const acceptableEmailAddresses = new Set([
  "i@pgte.me",
  "pedro.teixeira@gmail.com",
  "susana.g.chaves@gmail.com",
  "carinagouveia@hotmail.com",
]);

export const authConfig = once(async (): Promise<ExpressAuthConfig> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const client = await tables({
    awsSdkClient: true,
    awsjsonMarshall: { convertClassInstanceToMap: true },
    awsjsonUnmarshall: { convertWithoutMapWrapper: false },
  });
  const tableName = await client.name("next-auth");
  const clientDoc: DynamoDBDocument =
    client._doc as unknown as DynamoDBDocument;

  const databaseAdapter = DynamoDBAdapter(clientDoc, {
    tableName,
    indexPartitionKey: "pk",
    indexSortKey: "sk",
  });

  return {
    basePath: "/api/v1/auth",
    session: {
      strategy: "jwt",
    },
    theme: {
      colorScheme: "light",
      logo: "/images/tt3-logo.svg",
      brandColor: "#008080",
      buttonText: "Sign in",
    },
    providers: [Mailgun({ name: "TT3", from: "info@tt3.app" })],
    adapter: databaseAdapter,
    callbacks: {
      async signIn({ user, account }) {
        console.log("signIn", user, account);
        return acceptableEmailAddresses.has(user.email ?? "");
      },
      async jwt({ token, account }) {
        if (account?.type === "email" && account.providerAccountId) {
          token.email = account.providerAccountId;
          token.id = token.sub;
          const userRef = resourceRef("users", token.id as string);
          const { entity } = await database();
          const user = await entity.get(userRef);
          if (user) {
            token.name = user.name;
          }
        }
        return token;
      },
      async session({ session, token }) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
    },
    events: {
      session: async ({ session, token }) => {
        const userRef = resourceRef("users", token.id as string);
        const { entity } = await database();
        const user = await entity.get(userRef);
        if (user) {
          session.user = {
            ...session.user,
            name: user.name,
          };
        }
      },
      signIn: async ({ user, isNewUser }) => {
        console.log("signIn", user, isNewUser);
        const { entity } = await database();
        const userRef = resourceRef("users", getDefined(user.id));
        if (isNewUser) {
          const newUser = {
            pk: userRef,
            name: user.name || user.email || "Unknown",
            email: user.email,
            createdAt: new Date().toISOString(),
            createdBy: userRef,
            ...user,
          };
          console.log("creating new user", newUser);
          await entity.create(newUser as EntityRecord);
        } else {
          console.log("updating user", user);
          const officialUser = await entity.get(userRef);
          console.log("officialUser", officialUser);
          if (officialUser && officialUser.name !== user.name && user.id) {
            console.log("updating user name", officialUser);
            await databaseAdapter.updateUser?.({
              id: user.id,
              name: officialUser.name,
            });
          }
        }
      },
    },
  };
});
