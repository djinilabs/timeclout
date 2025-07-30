import Mailgun from "next-auth/providers/mailgun";
import Google from "next-auth/providers/google";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { tables } from "@architect/functions";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { getDefined, once, resourceRef } from "@/utils";
import { database, EntityRecord } from "@/tables";
import { ExpressAuthConfig } from "@auth/express";

// Remove hardcoded email list
// const acceptableEmailAddresses = new Set([
//   "i@pgte.me",
//   "pedro.teixeira@gmail.com",
//   "susana.g.chaves@gmail.com",
//   "carinagouveia@hotmail.com",
// ]);

// Function to check if user is allowed to sign in
async function isUserAllowedToSignIn(email: string): Promise<boolean> {
  if (!email) return false;

  const { entity, invitation } = await database();

  // Check if user already exists in the system
  const userRef = resourceRef("users", email);
  const existingUser = await entity.get(userRef);
  if (existingUser) {
    console.log("User already exists, allowing sign in:", email);
    return true;
  }

  // Check if user has an active invitation
  const { items: invitations } = await invitation.query({
    IndexName: "bySecret",
    KeyConditionExpression: "sk = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  });

  if (invitations.length > 0) {
    console.log("User has active invitation, allowing sign in:", email);
    return true;
  }

  // Optional: Fallback to environment variable during transition
  const fallbackEmails =
    process.env.FALLBACK_ALLOWED_EMAILS?.split(",").map((e) => e.trim()) || [];
  if (fallbackEmails.includes(email)) {
    console.log("User in fallback list, allowing sign in:", email);
    return true;
  }

  console.log(
    "User not found and no active invitation, denying sign in:",
    email
  );
  return false;
}

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
    providers: [
      Mailgun({
        name: "TT3",
        from: "info@tt3.app",
        // Ensure email provider can handle existing users
        normalizeIdentifier: (identifier) => identifier.toLowerCase(),
      }),
      Google({
        clientId: getDefined(
          process.env.GOOGLE_CLIENT_ID,
          "GOOGLE_CLIENT_ID is required"
        ),
        clientSecret: getDefined(
          process.env.GOOGLE_CLIENT_SECRET,
          "GOOGLE_CLIENT_SECRET is required"
        ),
        allowDangerousEmailAccountLinking: true,
      }),
    ],
    adapter: databaseAdapter,
    callbacks: {
      async signIn({ user, account, profile }) {
        console.log("signIn", user, account, profile);

        // Check if user is allowed to sign in using database
        const isEmailAllowed = await isUserAllowedToSignIn(user.email ?? "");
        if (!isEmailAllowed) {
          console.log("Email not allowed to sign in:", user.email);
          return false;
        }

        // For email authentication - always allow if email is in database/whitelist
        if (account?.type === "email") {
          console.log("Email authentication allowed for:", user.email);
          return true;
        }

        // For Google OAuth - always allow if email is in database/whitelist
        if (account?.provider === "google") {
          console.log("Google OAuth allowed for:", user.email);
          return true;
        }

        console.log("Unknown authentication method:", account);
        return false;
      },
      async jwt({ token, account, user }) {
        // Handle email authentication
        if (account?.type === "email" && account.providerAccountId) {
          token.email = account.providerAccountId;
          token.id = token.sub;

          // Try to get existing user data
          const userRef = resourceRef("users", token.id as string);
          const { entity } = await database();
          const userRecord = await entity.get(userRef);
          if (userRecord) {
            token.name = userRecord.name;
            // Note: image property is not available in EntityRecord type
            // Profile pictures are handled by NextAuth session
          }
        }

        // Handle Google OAuth
        if (account?.provider === "google" && user) {
          token.email = user.email;
          token.id = user.id;
          token.name = user.name;
          token.picture = user.image;
        }

        return token;
      },
      async session({ session, token }) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.email) {
          session.user.email = token.email;
        }
        if (token.name) {
          session.user.name = token.name;
        }
        if (token.picture) {
          session.user.image = token.picture;
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
      signIn: async ({ user, isNewUser, account }) => {
        console.log("signIn event", { user, isNewUser, account });
        const { entity } = await database();
        const userRef = resourceRef("users", getDefined(user.id));

        if (isNewUser) {
          const newUser = {
            pk: userRef,
            name: user.name || user.email || "Unknown",
            email: user.email,
            createdAt: new Date().toISOString(),
            createdBy: userRef,
            // Add provider-specific data as additional properties
            ...user,
          };
          console.log("creating new user", newUser);
          await entity.create(newUser as unknown as EntityRecord);
        } else {
          console.log("updating user", user);
          const officialUser = await entity.get(userRef);
          console.log("officialUser", officialUser);

          // Update user data if it has changed
          if (officialUser && user.id) {
            const updates: Partial<EntityRecord> = {};
            let hasUpdates = false;

            if (officialUser.name !== user.name && user.name) {
              updates.name = user.name;
              hasUpdates = true;
            }

            if (officialUser.email !== user.email && user.email) {
              updates.email = user.email;
              hasUpdates = true;
            }

            // Note: image property is not supported in EntityRecord type
            // User profile images are handled by NextAuth session

            if (hasUpdates) {
              console.log("updating user data", updates);
              await entity.update({
                ...officialUser,
                ...updates,
              });
            }
          }
        }
      },
    },
  };
});
