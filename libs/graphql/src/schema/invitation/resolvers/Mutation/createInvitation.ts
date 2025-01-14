import { notFound } from "@hapi/boom";
import { nanoid } from "nanoid";
import { database, PERMISSION_LEVELS, permissionLevelToName } from "@/tables";
import { authConfig } from "@/auth-config";
import { getDefined } from "@/utils";
import type {
  MutationResolvers,
  ResolversTypes,
} from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { ResolverContext } from "../../../../resolverContext";
import { sendEmail } from "@/send-email";

export async function createHash(message: string) {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
}

export const createInvitation: NonNullable<
  MutationResolvers["createInvitation"]
> = async (_parent, arg, ctx) => {
  const actingUserPk = await ensureAuthorized(
    ctx,
    arg.toEntityPk,
    PERMISSION_LEVELS.WRITE
  );
  const { entity, invitation } = await database();
  const invitedTo = await entity.get(arg.toEntityPk);
  if (!invitedTo) {
    throw notFound("Invited to entity not found");
  }
  const secret = nanoid();
  const createdInvitation = await invitation.create({
    pk: invitedTo.pk,
    sk: arg.invitedUserEmail,
    secret,
    permissionType: arg.permissionType,
    createdBy: actingUserPk,
  });

  const auth = await authConfig();

  const token = await createHash(`${secret}${auth.secret}`);

  await getDefined(
    getDefined(auth.adapter, "Auth adapter is required")
      ?.createVerificationToken,
    "Auth adapter createVerificationToken is required"
  )({
    identifier: arg.invitedUserEmail,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    token,
  });

  const provider = "mailgun"; // CHANGE HERE IF PROVIDER CHANGES
  const context = ctx as ResolverContext;
  const origin = context.event.headers["origin"];
  const callbackUrl = origin + "/invites/accept?secret=" + secret;
  const verificationUrl =
    origin +
    `${getDefined(auth.basePath)}/callback/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}&token=${secret}&email=${arg.invitedUserEmail}`;

  await sendEmail({
    to: arg.invitedUserEmail,
    subject: "You've been invited to join a team",
    text: `You've been invited to join ${invitedTo.name} as a ${permissionLevelToName(
      arg.permissionType
    )}. Click here to accept the invitation: ${verificationUrl}`,
  });

  return createdInvitation as unknown as ResolversTypes["Invitation"];
};
