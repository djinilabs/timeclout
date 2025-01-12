import { EventBusEventCreateLeaveRequest } from "@/event-bus";
import { database, resourceRef } from "@/tables";
import { notFound } from "@hapi/boom";
import { leaveTypesSchema } from "@/settings";

export const handleCreateLeaveRequest = async ({
  value: { leaveRequest },
}: EventBusEventCreateLeaveRequest) => {
  console.log("handleCreateLeaveRequest", leaveRequest);
  const { entity, entity_settings } = await database();

  // get company from leave request
  const { pk } = leaveRequest;
  // pk has companies/:companyId/users/:userId
  // parse this
  const [, companyId, , userId] = pk.match(/^companies\/(.+?)\/users\/(.+?)$/)!;
  const companyRef = resourceRef("companies", companyId);
  const company = await entity.get(companyRef);
  if (!company) {
    throw notFound(`Company with id ${companyId} not found`);
  }

  const userRef = resourceRef("users", userId);
  const user = await entity.get(userRef);
  if (!user) {
    throw notFound(`User with id ${userId} not found`);
  }

  // get company leave type settings;
  const companyLeaveTypeSettings = await entity_settings.get(
    companyRef,
    "leaveTypes"
  );
  if (!companyLeaveTypeSettings) {
    throw notFound(`Leave type settings for company ${companyId} not found`);
  }

  const leaveTypes = leaveTypesSchema.parse(companyLeaveTypeSettings);

  // check if leave type requires approval
  const leaveType = leaveTypes.find(
    (leaveType) => leaveType.name === leaveRequest.type
  );
  if (!leaveType) {
    throw notFound(`Leave type ${leaveRequest.type} not found`);
  }

  if (!leaveType.needsManagerApproval) {
    console.log(
      `Leave type ${leaveRequest.type} does not need manager approval`
    );
    return;
  }

  // get teams the user that requested the leave is in
  // query by resource type and entity id
  const teams = await entity.query({
    IndexName: "byResourceTypeAndEntityId",
    KeyConditionExpression:
      "resourceType = :resourceType AND entityId = :entityId",
    ExpressionAttributeValues: {
      ":resourceType": "teams",
      ":entityId": userRef,
    },
  });

  // get approving managers for each team using entity_settings
  const teamManagers = await Promise.all(
    teams.map(async (team) => {
      const teamRef = resourceRef("teams", team.pk);
      const teamManagers = (await entity_settings.get(teamRef, "managers"))
        ?.settings;
      return teamManagers;
    })
  );

  // get approving manager emails
  // send emails to approving managers
};
