import { resourceRef } from "@/utils";

export const parseLeaveRequestPk = (pk: string) => {
  const match = pk.match(/^companies\/(.+?)\/users\/(.+?)$/)!;
  if (!match) {
    throw new Error(`Invalid leave request pk: ${pk}`);
  }
  const [, companyId, userId] = match;
  return {
    companyRef: resourceRef("companies", companyId),
    userRef: resourceRef("users", userId),
  };
};
