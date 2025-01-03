import { database } from "@/tables";
import type { MutationResolvers } from "./../../../../types.generated";

export const deleteCompany: NonNullable<
  MutationResolvers["deleteCompany"]
> = async (_parent, _arg, _ctx) => {
  const { entity } = await database();
  return entity.delete(_arg.pk);
};
