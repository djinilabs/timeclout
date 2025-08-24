import { notFound } from "@hapi/boom";

import {
  getUnitManagersPks,
  getUserUnitsPks,
  parseLeaveRequestPk,
} from "@/business-logic";
import { EmailParams, renderEmail } from "@/emails";
import { EventBusEventRejectedLeaveRequest } from "@/event-bus";
import { sendEmail } from "@/send-email";
import { database } from "@/tables";
import { getDefined } from "@/utils";

export const handleRejectLeaveRequest = async ({
  value: { leaveRequest, rejecter },
}: EventBusEventRejectedLeaveRequest) => {
  console.log("handleRejectLeaveRequest", leaveRequest);

  if (leaveRequest.approved) {
    return;
  }

  const { pk } = leaveRequest;
  const { companyRef, userRef } = parseLeaveRequestPk(pk);

  const { entity } = await database();

  // get company from leave request
  // pk has companies/:companyId/users/:userId
  // parse this
  const company = await entity.get(companyRef);
  if (!company) {
    throw notFound(`Company with id ${companyRef} not found`);
  }

  const user = await entity.get(userRef);
  if (!user) {
    throw notFound(`User with id ${companyRef} not found`);
  }

  const userUnitsPks = await getUserUnitsPks(userRef);

  // get approving managers for each team using entity_settings
  const unitManagerPks = await getUnitManagersPks(userUnitsPks);
  if (unitManagerPks.length === 0) {
    throw notFound("No unit managers found for the units the user is in");
  }

  const unitManagers = await Promise.all(
    unitManagerPks.map((pk) => entity.get(pk))
  );

  for (const manager of unitManagers) {
    if (!manager) {
      continue;
    }
    // get approving manager emails
    // send emails to approving managers
    const emailParameters: EmailParams = {
      type: "leaveRequestRejectedToManager",
      leaveRequestType: leaveRequest.type,
      leaveRequestReason: leaveRequest.reason,
      leaveRequestStartDate: leaveRequest.startDate,
      leaveRequestEndDate: leaveRequest.endDate,
      employingEntity: company.name,
      requester: user,
      manager: manager,
      rejecter: rejecter,
    };
    const emailBody = await renderEmail(emailParameters);
    await sendEmail({
      to: getDefined(manager.email, "Manager has no email"),
      subject: `[${company.name}] Leave Request Rejected`,
      text: "Leave Request",
      html: emailBody,
    });
  }

  // send email to user
  const emailParameters: EmailParams = {
    type: "leaveRequestRejectedToUser",
    leaveRequestType: leaveRequest.type,
    leaveRequestReason: leaveRequest.reason,
    leaveRequestStartDate: leaveRequest.startDate,
    leaveRequestEndDate: leaveRequest.endDate,
    employingEntity: company.name,
    rejecter: rejecter,
    requester: user,
  };
  const emailBody = await renderEmail(emailParameters);
  await sendEmail({
    to: getDefined(user.email, "User has no email"),
    subject: `[${company.name}] Leave Request Rejected`,
    text: "Leave Request",
    html: emailBody,
  });
};
