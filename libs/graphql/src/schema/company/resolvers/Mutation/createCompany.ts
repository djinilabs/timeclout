import { database } from "@/tables";
import { nanoid } from "nanoid";
import type { MutationResolvers } from "./../../../../types.generated";

export const createCompany: NonNullable<MutationResolvers['createCompany']> = async (_parent, _arg, _ctx) => {
  const { entity } = await database();
  const company = {
    pk: `company/${nanoid()}`,
    name: "test",
  };
  await entity.create(company);
  return company;
};
