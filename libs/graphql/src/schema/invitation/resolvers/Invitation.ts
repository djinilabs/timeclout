import { database } from "@/tables";
import crypto from "crypto";
import type {
  InvitationEntity,
  InvitationResolvers,
  ResolversTypes,
  ResolversUnionTypes,
  User,
} from "./../../../types.generated";

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
  createdBy: async (parent) => {
    const { entity } = await database();
    return entity.get(parent.createdBy as unknown as string) as Promise<User>;
  },
  updatedBy: async (parent) => {
    if (!parent.updatedBy) {
      return null;
    }
    const { entity } = await database();
    return entity.get(parent.updatedBy as unknown as string) as Promise<User>;
  },
  toEntity: async (parent) => {
    const { entity } = await database();
    const entityData = await entity.get(parent.pk);
    const entityType =
      entityTypeToGraphQlEntityType[entityData.pk.split("/")[0]];
    const finalEntity = {
      ...entityData,
      __typename: entityType,
    } as unknown as ResolversUnionTypes<ResolversTypes>["InvitationEntity"];

    console.log("finalEntity", finalEntity);

    return finalEntity;
  },
};
