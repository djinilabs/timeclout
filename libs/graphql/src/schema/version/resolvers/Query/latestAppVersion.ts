import type { QueryResolvers } from "./../../../../types.generated";

export const latestAppVersion: NonNullable<QueryResolvers['latestAppVersion']> = async () => {
  const { version } = await import("../../../../../../../package.json");
  return version;
};
