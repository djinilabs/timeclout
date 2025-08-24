import { giveAuthorization } from "./giveAuthorization";

import { database } from "@/tables";

export const ensureExactAuthorization = async (
  resource: string,
  to: string,
  level: number,
  givenBy: string,
  parent?: string
) => {
  const { permission } = await database();

  const userPermission = await permission.get(resource, to);
  if (userPermission == undefined) {
    await giveAuthorization(resource, to, level, givenBy, parent);
  } else {
    if (userPermission.type !== level) {
      userPermission.type = level;
      await permission.update(userPermission);
    }
  }
};
