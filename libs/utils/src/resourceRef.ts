export type ResourceType = "companies" | "units" | "users" | "teams";

export type ResourceRef = `${ResourceType}/${string}`;

const validResourceTypes: Set<ResourceType> = new Set([
  "companies",
  "units",
  "users",
  "teams",
] as const);

export const getResourceRef = (r: string): ResourceRef => {
  const match = r.match(/^(\w+)\/(.+)$/);
  if (!match) {
    throw new Error(`Invalid resource reference: ${r}`);
  }
  const [_, resourceType, id] = match;
  if (!validResourceTypes.has(resourceType as ResourceType)) {
    throw new Error(`Invalid resource type: ${resourceType}`);
  }
  return r as ResourceRef;
};

export const resourceRef = (
  resourceType: ResourceType,
  id: string
): ResourceRef => `${resourceType}/${id}`;
