import { database } from "@/tables";
import { ResourceRef } from "@/utils";
import { getEntityPksUserHasPermissionFor } from "../permission/getEntityPksUserHasPermissionFor";

export const getUserUnits = async (userRef: ResourceRef) => {
  return getEntityPksUserHasPermissionFor(userRef, "units");
};
