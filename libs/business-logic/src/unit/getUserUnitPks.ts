import { ResourceRef } from "@/utils";
import { getEntityPksUserHasPermissionFor } from "../permission/getEntityPksUserHasPermissionFor";

export const getUserUnitPks = async (
  userPk: ResourceRef
): Promise<ResourceRef[]> => getEntityPksUserHasPermissionFor(userPk, "units");
