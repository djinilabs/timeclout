import { database } from "@/tables";

export const removeLeaveRequest = async ({
  pk,
  sk,
}: {
  pk: string;
  sk: string;
}) => {
  const { leave, leave_request } = await database();
  await leave_request.delete(pk, sk);

  const leaves = await leave.query({
    IndexName: "byLeaveRequestPkAndSk",
    KeyConditionExpression: "leaveRequestPk = :pk AND leaveRequestSk = :sk",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":sk": sk,
    },
  });

  for (const l of leaves.items) {
    await leave.delete(l.pk, l.sk);
  }
};
