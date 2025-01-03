
import type { MutationResolvers } from "./../../../../types.generated";

export const createCompany: NonNullable<
  MutationResolvers["createCompany"]
> = async (_parent, _arg, _ctx) => {
  return {
    id: "1",
  };
};
