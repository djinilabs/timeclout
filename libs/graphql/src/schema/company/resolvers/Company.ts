// @ts-ignore
import { database, PERMISSION_LEVELS } from "@/tables";
import { CompanyResolvers, Unit, User } from "../../../types.generated";
import { requireSession } from "../../../session/requireSession";
import { getAuthorized } from "libs/graphql/src/auth/getAuthorized";

export const Company: CompanyResolvers = {
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
  units: async (_parent, _args, ctx) => {
    const { entity } = await database();
    const permissions = await getAuthorized(ctx, "units");
    console.log("unit permissions", permissions);
    return entity.batchGet(permissions.map((p) => p.pk)) as unknown as Promise<
      Unit[]
    >;
  },
};
