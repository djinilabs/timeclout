import { ResourceRef } from "@/utils";
import { getResourceRef } from "@/utils";
import { getUserCompanyPks } from "./getUserCompanyPks";
import { getEntitySettings } from "../entity/getEntitySettings";

export const getCompanyPksTheUserManages = async (
  userPk: ResourceRef
): Promise<ResourceRef[]> => {
  const companyPks = await getUserCompanyPks(userPk);
  return (
    await Promise.all(
      companyPks.map(async (companyPk) => {
        const managers = await getEntitySettings(
          getResourceRef(companyPk),
          "managers"
        );
        if (managers?.includes(userPk)) {
          return companyPk;
        }
      })
    )
  )
    .filter(Boolean)
    .map(getResourceRef);
};
