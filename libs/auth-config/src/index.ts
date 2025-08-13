import Google from "next-auth/providers/google";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { tables } from "@architect/functions";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { getDefined, once, resourceRef } from "@/utils";
import { database, EntityRecord } from "@/tables";
import { ExpressAuthConfig } from "@auth/express";

// Remove hardcoded email list
const acceptableEmailAddresses = new Set([
  "i@pgte.me",
  "pedro.teixeira@gmail.com",
  "susana.g.chaves@gmail.com",
  "carinagouveia@hotmail.com",
]);

// Function to check if user is allowed to sign in
async function isUserAllowedToSignIn(email: string): Promise<boolean> {
  if (!email) return false;

  // Allow any TigrMail email addresses (check for common TigrMail domains)
  // TigrMail typically uses domains like tigrmail.com, tigrmail.net, etc.
  // and subdomains like den.tigrmail.com, etc.
  const emailDomain = email.split("@")[1];
  if (emailDomain && emailDomain.includes("tigrmail")) {
    console.log("TigrMail email detected, allowing sign in:", email);
    return true;
  }

  if (acceptableEmailAddresses.has(email)) {
    console.log("User in whitelist, allowing sign in:", email);
    return true;
  }

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

  // Custom email template functions with proper charset handling
  const createHtmlEmail = ({
    host,
    url,
    theme,
  }: {
    host: string;
    url: string;
    theme: { brandColor?: string; buttonText?: string };
  }) => {
    const brandColor = theme.brandColor || "#008080";

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Sign in to ${host}</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Sign in to ${host}</h1>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" 
               style="background-color: ${brandColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">
                Sign in
            </a>
        </div>
        
        <p style="color: #666; text-align: center; font-size: 14px; line-height: 1.5;">
            If you did not request this email, you can safely ignore it.
        </p>
    </div>
</body>
</html>`;
  };

  const createTextEmail = ({ host, url }: { host: string; url: string }) => {
    return `Sign in to ${host}\n\n${url}\n\nIf you did not request this email you can safely ignore it.`;
  };

  // Create a completely custom email provider instead of using Mailgun
  const customEmailProvider = {
    id: "email",
    type: "email" as const,
    name: "Email",
    from: "info@tt3.app",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(req: {
      identifier: string;
      url: string;
      theme: { brandColor?: string; buttonText?: string };
    }) {
      console.log("sendVerificationRequest", req);

      const { identifier: to, url, theme } = req;
      const { host } = new URL(url);
      const domain = "tt3.app"; // Use your domain directly

      const form = new FormData();
      form.append("from", `TT3 <info@${domain}>`);
      form.append("to", to);
      form.append("subject", `Sign in to ${host}`);

      // Use custom email templates with proper charset handling
      const htmlContent = createHtmlEmail({ host, url, theme });
      const textContent = createTextEmail({ host, url });

      console.log("Email content:", {
        htmlContent,
        textContent,
        to,
        host,
        domain,
      });

      // For TigrMail, try a very simple HTML first to test
      const simpleHtmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sign in to ${host}</title>
</head>
<body>
    <h1>Sign in to ${host}</h1>
    <p><a href="${url}">Click here to sign in</a></p>
</body>
</html>`;

      form.append("html", simpleHtmlContent);
      form.append("text", textContent);

      // Add explicit charset headers for TigrMail compatibility
      form.append("h:Content-Type", "text/html; charset=UTF-8");
      form.append("h:Content-Transfer-Encoding", "8bit");
      form.append("h:MIME-Version", "1.0");
      form.append("h:X-Mailer", "TT3-Auth-System");
      form.append(
        "h:Message-ID",
        `<${Date.now()}.${Math.random().toString(36).substr(2, 9)}@${domain}>`
      );
      form.append("h:Accept-Charset", "UTF-8");

      console.log("Form data entries:");
      for (const [key, value] of form.entries()) {
        console.log(`${key}: ${value}`);
      }

      const res = await fetch(
        `https://api.eu.mailgun.net/v3/${domain}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${getDefined(
                process.env.AUTH_MAILGUN_KEY,
                "AUTH_MAILGUN_KEY is required"
              )}`
            ).toString("base64")}`,
          },
          body: form,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Mailgun error:", errorText);
        console.error("Response status:", res.status);
        console.error(
          "Response headers:",
          Object.fromEntries(res.headers.entries())
        );
        throw new Error("Mailgun error: " + errorText);
      }

      const responseText = await res.text();
      console.log("Mailgun response:", responseText);
      console.log(
        "Response headers:",
        Object.fromEntries(res.headers.entries())
      );
      console.log("sendVerificationRequest response: success");
    },
    normalizeIdentifier: (identifier: string) => identifier.toLowerCase(),
  };

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
      customEmailProvider,
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
          console.log("Email authentication details:", { account, user });
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
      // Add email verification event for debugging
      createUser: async ({ user }) => {
        console.log("createUser event", { user });
      },
      linkAccount: async ({ user, account }) => {
        console.log("linkAccount event", { user, account });
      },
    },
  };
});
