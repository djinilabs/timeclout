// @ts-ignore
import { database } from "@/tables";
import { CompanyResolvers } from "../../../types.generated";

export const Company: CompanyResolvers = {
  createdBy: async (parent) => {
    console.log("createdBy", parent.createdBy);
    const { entity } = await database();
    const user = await entity.get(parent.createdBy);
    console.log("user", user);
    return user;
  },
  updatedBy: async (parent) => {
    if (!parent.updatedBy) {
      return null;
    }
    const { entity } = await database();
    return entity.get(parent.updatedBy);
  },
};
