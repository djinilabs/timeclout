export type ResourceType = "companies" | "units" | "users" | "teams";

export type ResourceRef<T extends ResourceType = ResourceType> =
  `${T}/${string}`;

const validResourceTypes: Set<ResourceType> = new Set([
  "companies",
  "units",
  "users",
  "teams",
] as const);

export const gettingResourceRef =
  <T extends ResourceType = ResourceType>(t: T) =>
  (r: string | undefined | null): ResourceRef<T> => {
    const match = r?.match(/^(\w+)\/(.+)$/);
    if (!match) {
      throw new Error(`Invalid resource reference: ${r}`);
    }
    const [, resourceType] = match;
    if (!validResourceTypes.has(resourceType as ResourceType)) {
      throw new Error(`Invalid resource type: ${resourceType}`);
    }
    if (t && resourceType !== t) {
      throw new Error(`Resource type mismatch: ${resourceType} !== ${t}`);
    }
    return r as ResourceRef<T>;
  };

export const getResourceRef = <T extends ResourceType = ResourceType>(
  r: string | undefined | null,
  t?: T
): ResourceRef<T> => {
  const match = r?.match(/^(\w+)\/(.+)$/);
  if (!match) {
    throw new Error(`Invalid resource reference: ${r}`);
  }
  const [, resourceType] = match;
  if (!validResourceTypes.has(resourceType as ResourceType)) {
    throw new Error(`Invalid resource type: ${resourceType}`);
  }
  if (t && resourceType !== t) {
    throw new Error(`Resource type mismatch: ${resourceType} !== ${t}`);
  }
  return r as ResourceRef<T>;
};

export const getCompoundedResourceRef =
  (...resourceTypes: Array<ResourceType>) =>
  (r: string | undefined | null): ResourceRef => {
    const constituents = r?.split("/");
    if (!constituents) {
      throw new Error(`Invalid compounded resource reference: ${r}`);
    }
    const types = constituents.filter((_, index) => index % 2 === 0);
    if (!types.every((t) => validResourceTypes.has(t as ResourceType))) {
      throw new Error(`Invalid compounded resource reference: ${r}`);
    }
    if (resourceTypes && !types.every((t, index) => resourceTypes[index] === t)) {
        throw new Error(`Invalid compounded resource reference: ${r}`);
      }
    return r as ResourceRef;
  };

export const getCompoundedResourceRefConstituents = (
  r: string
): Array<ResourceRef> => {
  const constituents = r.split("/");
  if (constituents.length % 2 !== 0) {
    throw new Error(`Invalid compounded resource reference: ${r}`);
  }

  const references: ResourceRef[] = [];
  for (let index = 0; index < constituents.length; index += 2) {
    references.push(
      resourceRef(constituents[index] as ResourceType, constituents[index + 1])
    );
  }
  return references;
};

export const resourceRef = <T extends ResourceType = ResourceType>(
  resourceType: T,
  id: string
): ResourceRef<T> => {
  const prefix = `${resourceType}/`;
  if (id.startsWith(prefix)) {
    return id as ResourceRef<T>;
  }
  return `${prefix}${id}` as ResourceRef<T>;
};

export const compoundedResourceRef = (
  ...arguments_: Array<ResourceRef>
): ResourceRef => arguments_.join("/") as ResourceRef;
