import { database } from "@/tables";
import { ResourceRef } from "@/utils";

export const getUserAuthorizationLevelForResource = async (
  resource: ResourceRef,
  userPk: ResourceRef<"users">
): Promise<number | null> => {
  const { permission } = await database();
  const permissionRecord = await permission.get(resource, userPk);
  if (!permissionRecord) {
    return null;
  }
  return permissionRecord.type;
};
