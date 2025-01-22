import { ResourceRef } from "@/utils";
import { getEntityPksUserHasPermissionFor } from "../permission/getEntityPksUserHasPermissionFor";

export const getUserCompanyPks = async (userPk: ResourceRef) => {
  return (await getEntityPksUserHasPermissionFor(userPk, "companies")).map(
    ({ pk }) => pk
  );
};
