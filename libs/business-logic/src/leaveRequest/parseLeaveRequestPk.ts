import { resourceRef } from "@/utils";
import { i18n } from "@/locales";

export const parseLeaveRequestPk = (pk: string) => {
  const match = pk.match(/^companies\/(.+?)\/users\/(.+?)$/)!;
  if (!match) {
    throw new Error(i18n._("Invalid leave request pk: {pk}", { pk }));
  }
  const [, companyId, userId] = match;
  return {
    companyRef: resourceRef("companies", companyId),
    userRef: resourceRef("users", userId),
  };
};
