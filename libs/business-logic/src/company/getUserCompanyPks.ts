import { getEntityPksUserHasPermissionFor } from "../permission/getEntityPksUserHasPermissionFor";

import { ResourceRef } from "@/utils";

export const getUserCompanyPks = async (userPk: ResourceRef) =>
  getEntityPksUserHasPermissionFor(userPk, "companies");
