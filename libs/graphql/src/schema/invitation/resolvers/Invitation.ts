import { resourceRef } from "@/tables";
import { database } from "@/tables";
import type {
  InvitationEntity,
  InvitationResolvers,
  ResolversTypes,
  ResolversUnionTypes,
} from "./../../../types.generated";
export const Invitation: InvitationResolvers = {
  toEntity: async (parent) => {
    const { entity } = await database();
    return entity.get(parent.pk) as unknown as Promise<
      ResolversUnionTypes<ResolversTypes>["InvitationEntity"]
    >;
  },
};
