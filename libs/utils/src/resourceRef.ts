export type ResourceType = "companies" | "units" | "users" | "teams";

export type ResourceRef<T extends ResourceType = ResourceType> =
  `${T}/${string}`;

const validResourceTypes: Set<ResourceType> = new Set([
  "companies",
  "units",
  "users",
  "teams",
] as const);

export const getResourceRef = <T extends ResourceType = ResourceType>(
  r: string | undefined | null,
  t?: T
): ResourceRef<T> => {
  const match = r?.match(/^(\w+)\/(.+)$/);
  if (!match) {
    throw new Error(`Invalid resource reference: ${r}`);
  }
  const [_, resourceType, id] = match;
  if (!validResourceTypes.has(resourceType as ResourceType)) {
    throw new Error(`Invalid resource type: ${resourceType}`);
  }
  if (t && resourceType !== t) {
    throw new Error(`Resource type mismatch: ${resourceType} !== ${t}`);
  }
  return r as ResourceRef<T>;
};

export const resourceRef = (
  resourceType: ResourceType,
  id: string
): ResourceRef => `${resourceType}/${id}`;

export const compoundedResourceRef = (
  ...args: Array<ResourceRef>
): ResourceRef => args.join("/") as ResourceRef;
