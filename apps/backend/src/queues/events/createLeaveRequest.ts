import { EventBusEventCreateLeaveRequest } from "@/event-bus";
import { database } from "@/tables";
import { notFound } from "@hapi/boom";
import { leaveTypeParser, managersParser } from "@/settings";
import { EmailParams, renderEmail } from "@/emails";
import { sendEmail } from "@/send-email";
import { getDefined, unique, ResourceRef } from "@/utils";
import {
  getUserUnitsPks,
  isLeaveRequestFullyApproved,
  parseLeaveRequestPk,
} from "@/business-logic";

export const handleCreateLeaveRequest = async ({
  value: { leaveRequest },
}: EventBusEventCreateLeaveRequest) => {
  console.log("handleCreateLeaveRequest", leaveRequest);

  if (leaveRequest.approved) {
    return;
  }

  if (await isLeaveRequestFullyApproved(leaveRequest)) {
    return;
  }

  const { entity, entity_settings, permission } = await database();

  // get company from leave request
  const { pk } = leaveRequest;
  // pk has companies/:companyId/users/:userId
  // parse this
  const { companyRef, userRef } = parseLeaveRequestPk(pk);
  const company = await entity.get(companyRef);
  if (!company) {
    throw notFound(`Company with id ${companyRef} not found`);
  }

  const user = await entity.get(userRef);
  if (!user) {
    throw notFound(`User with id ${companyRef} not found`);
  }

  // get company leave type settings;
  const companyLeaveTypeSettings = await entity_settings.get(
    companyRef,
    "leaveTypes"
  );
  if (!companyLeaveTypeSettings) {
    throw notFound(`Leave type settings for company ${companyRef} not found`);
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

  const userUnitsPks = await getUserUnitsPks(userRef);

  // get approving managers for each team using entity_settings
  const unitManagerPks = unique(
    (
      await Promise.all(
        userUnitsPks.map(async (unitPk) =>
          managersParser.parse(
            (await entity_settings.get(unitPk, "managers"))?.settings
          )
        )
      )
    ).flat() as ResourceRef[]
  );

  const unitManagers = await Promise.all(
    unitManagerPks.map((pk) => entity.get(pk))
  );

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
    const emailBody = await renderEmail(emailParams);
    await sendEmail({
      to: getDefined(manager.email, "Manager has no email"),
      subject: `[${company.name}] Leave Request`,
      text: "Leave Request",
      html: emailBody,
    });
  }
};
