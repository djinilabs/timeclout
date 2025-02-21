import { database } from "@/tables";

export const giveAuthorization = async (
  resource: string,
  to: string,
  level: number,
  givenBy: string,
  parent?: string
) => {
  const { permission } = await database();
  const permissionItem = {
    pk: resource,
    sk: to,
    type: level,
    createdBy: givenBy,
    createdAt: new Date().toISOString(),
    resourceType: resource.split("/")[0],
    parentPk: parent,
  };
  console.log("creating permission", permissionItem);
  await permission.create(permissionItem);
};
