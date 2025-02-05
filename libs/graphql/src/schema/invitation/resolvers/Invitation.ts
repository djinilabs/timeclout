import { database } from "@/tables";
import crypto from "crypto";
import type {
  InvitationResolvers,
  ResolversTypes,
  ResolversUnionTypes,
  User,
} from "./../../../types.generated";
import { notFound } from "@hapi/boom";
import { ResourceRef } from "@/utils";

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
    return entity.get(
      parent.createdBy as unknown as ResourceRef
    ) as unknown as Promise<User>;
  },
  updatedBy: async (parent) => {
    if (!parent.updatedBy) {
      return null;
    }
    const { entity } = await database();
    return entity.get(
      parent.updatedBy as unknown as ResourceRef
    ) as unknown as Promise<User>;
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
