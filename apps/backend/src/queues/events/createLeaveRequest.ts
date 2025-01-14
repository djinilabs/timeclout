import { EventBusEventCreateLeaveRequest } from "@/event-bus";
import { database, resourceRef } from "@/tables";
import { notFound } from "@hapi/boom";
import { leaveTypeParser, managersParser } from "@/settings";
import { EmailParams, renderEmail } from "@/emails";
import { sendEmail } from "@/send-email";
import { getDefined, unique } from "@/utils";

export const handleCreateLeaveRequest = async ({
  value: { leaveRequest },
}: EventBusEventCreateLeaveRequest) => {
  console.log("handleCreateLeaveRequest", leaveRequest);
  const { entity, entity_settings, permission } = await database();

  // get company from leave request
  const { pk } = leaveRequest;
  // pk has companies/:companyId/users/:userId
  // parse this
  const [, companyId, userId] = pk.match(/^companies\/(.+?)\/users\/(.+?)$/)!;
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

  const leaveTypes = leaveTypeParser.parse(companyLeaveTypeSettings.settings);

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

  // get units the user that requested the leave is in
  // query by resource type and entity id
  const units = await permission.query({
    IndexName: "byResourceTypeAndEntityId",
    KeyConditionExpression: "resourceType = :resourceType AND sk = :sk",
    ExpressionAttributeValues: {
      ":resourceType": "units",
      ":sk": userRef,
    },
  });

  console.log("units", units);

  // get approving managers for each team using entity_settings
  const unitManagerPks = unique(
    (
      await Promise.all(
        units.map(async (unit) =>
          managersParser.parse(
            (await entity_settings.get(unit.pk, "managers"))?.settings
          )
        )
      )
    ).flat()
  );

  console.log("unitManagerPks", unitManagerPks);

  const unitManagers = await Promise.all(
    unitManagerPks.map((pk) => entity.get(pk))
  );

  console.log("unitManagers", unitManagers);

  for (const manager of unitManagers) {
    if (!manager) {
      continue;
    }
    // get approving manager emails
    // send emails to approving managers
    const emailParams: EmailParams = {
      type: "leaveRequestToManager",
      leaveRequestType: leaveRequest.type,
      leaveRequestReason: leaveRequest.reason,
      leaveRequestStartDate: leaveRequest.startDate,
      leaveRequestEndDate: leaveRequest.endDate,
      employingEntity: company.name,
      requester: user,
      manager: manager,
      continueUrl: `${process.env.BASE_URL}/${leaveRequest.pk}/leave-requests/${leaveRequest.sk}`,
    };
    console.log("emailParams", emailParams);
    const emailBody = await renderEmail(emailParams);
    console.log(emailBody);
    await sendEmail({
      to: getDefined(manager.email, "Manager has no email"),
      subject: `[${company.name}] Leave Request`,
      text: "Leave Request",
      html: emailBody,
    });
  }
};
