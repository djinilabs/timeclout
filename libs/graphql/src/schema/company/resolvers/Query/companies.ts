import { database } from "@/tables";
import type { QueryResolvers } from "./../../../../types.generated";
import type { ResolverContext } from "../../../../resolverContext";
import { requireSession } from "../../../../session/requireSession";

export const companies: NonNullable<
  QueryResolvers<ResolverContext>["companies"]
> = async (_parent, _arg, _ctx) => {
  const session = await requireSession(_ctx);
  console.log("session:", session);
  const { entity } = await database();
  return entity.query({});
};
