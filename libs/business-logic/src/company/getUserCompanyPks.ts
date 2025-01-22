import { ResourceRef } from "@/utils";
import { getEntityPksUserHasPermissionFor } from "../permission/getEntityPksUserHasPermissionFor";

export const getUserCompanyPks = async (userPk: ResourceRef) =>
  getEntityPksUserHasPermissionFor(userPk, "companies");
