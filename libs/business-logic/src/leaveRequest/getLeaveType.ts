import { notFound } from "@hapi/boom";

import { i18n } from "@/locales";
import { leaveTypeParser } from "@/settings";
import { database } from "@/tables";
import { ResourceRef } from "@/utils";

export const getLeaveType = async (
  companyReference: ResourceRef,
  leaveTypeName: string
) => {
  const { entity_settings } = await database();
  const leaveTypeSettingsUnparsed = await entity_settings.get(
    companyReference,
    "leaveTypes"
  );

  if (!leaveTypeSettingsUnparsed) {
    throw notFound(i18n._("Company leave type settings not found"));
  }

  const leaveTypeSettings = leaveTypeParser.parse(
    leaveTypeSettingsUnparsed.settings
  );

  const leaveType = leaveTypeSettings.find(
    (type) => type.name === leaveTypeName
  );

  if (!leaveType) {
    throw notFound(i18n._("Leave type not found"));
  }

  return leaveType;
};
