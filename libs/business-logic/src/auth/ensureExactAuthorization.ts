import { database } from "@/tables";
import { giveAuthorization } from "./giveAuthorization";

export const ensureExactAuthorization = async (
  resource: string,
  to: string,
  level: number,
  givenBy: string,
  parent?: string
) => {
  const { permission } = await database();

  const userPermission = await permission.get(resource, to);
  if (userPermission != null) {
    if (userPermission.type !== level) {
      userPermission.type = level;
      await permission.update(userPermission);
    }
  } else {
    await giveAuthorization(resource, to, level, givenBy, parent);
  }
};
