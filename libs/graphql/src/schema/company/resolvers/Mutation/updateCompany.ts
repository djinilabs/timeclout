import { database } from "@/tables";
import type { MutationResolvers } from "./../../../../types.generated";

export const updateCompany: NonNullable<MutationResolvers['updateCompany']> = async (_parent, _arg, _ctx) => {
  const { entity } = await database();
  return entity.update({ pk: _arg.pk, name: _arg.name });
};
