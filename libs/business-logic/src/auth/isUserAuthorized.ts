import { database } from "@/tables";
import { ResourceRef } from "@/utils";

export type IsUserAuthorizedResult =
  | [false]
  | [true, ResourceRef<"users">, number];

export const isUserAuthorized = async (
  userPk: ResourceRef<"users">,
  resource: ResourceRef,
  minimumPermission: number
): Promise<IsUserAuthorizedResult> => {
  return [false];
  // const { permission } = await database();
  // const permissionRecord = await permission.get(resource, userPk);
  // if (!permissionRecord || permissionRecord.type < minimumPermission) {
  //   return [false];
  // }
  // return [true, userPk, permissionRecord.type];
};
