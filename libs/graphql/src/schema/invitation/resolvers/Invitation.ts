import { database } from "@/tables";
import crypto from "crypto";
import { getResourceRef } from "@/utils";
import type {
  InvitationResolvers,
  ResolversTypes,
  ResolversUnionTypes,
  User,
} from "./../../../types.generated";
import { notFound } from "@hapi/boom";

const entityTypeToGraphQlEntityType = {
  companies: "Company",
  teams: "Team",
  units: "Unit",
  users: "User",
};

export const Invitation: InvitationResolvers = {
  email: (parent) => {
    return parent.sk;
  },
  emailMd5: (parent) => {
    return crypto.createHash("md5").update(parent.sk).digest("hex");
  },
  createdBy: async (parent, _args, ctx) => {
    // Cast to access the raw database field where createdBy is a string
    const userRef = (parent as unknown as { createdBy: string }).createdBy;
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User;
  },
  updatedBy: async (parent, _args, ctx) => {
    // Cast to access the raw database field where updatedBy is a string
    const userRef = (parent as unknown as { updatedBy?: string }).updatedBy;
    if (!userRef) {
      return null;
    }
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User;
  },
  toEntity: async (parent) => {
    const { entity } = await database();
    const entityData = await entity.get(parent.pk);
    if (!entityData) {
      throw notFound(`Entity not found: ${parent.pk}`);
    }
    const entityType =
      entityTypeToGraphQlEntityType[
        entityData.pk.split(
          "/"
        )[0] as keyof typeof entityTypeToGraphQlEntityType
      ];
    const finalEntity = {
      ...entityData,
      __typename: entityType,
    } as unknown as ResolversUnionTypes<ResolversTypes>["InvitationEntity"];

    console.log("finalEntity", finalEntity);

    return finalEntity;
  },
};
