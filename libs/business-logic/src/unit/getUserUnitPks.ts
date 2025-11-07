import { getEntityPksUserHasPermissionFor } from "../permission/getEntityPksUserHasPermissionFor";

import { ResourceRef } from "@/utils";

export const getUserUnitPks = async (
  userPk: ResourceRef
): Promise<ResourceRef[]> => getEntityPksUserHasPermissionFor(userPk, "units");
