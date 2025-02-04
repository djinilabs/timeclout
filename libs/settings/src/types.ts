import { leaveTypeParser, LeaveTypes } from "./leaveTypes";
import { Managers, managersParser } from "./managers";
import { YearlyQuota, yearlyQuotaParser } from "./yearlyQuota";
import { YearlyUserQuotas, yearlyUserQuotasParser } from "./yearlyUserQuotas";
import { Location, locationParser } from "./location";
import { WorkSchedule, worksScheduleParser } from "./workSchedule";
import { Qualifications, qualificationsParser } from "./qualifications";
import { userQualificationsParser } from "./userQualifications";
import { UserQualifications } from "./userQualifications";
import {
  SchedulePositionTemplates,
  schedulePositionTemplatesParser,
} from "./schedulePositionTemplates";

export type SettingsType<TShape> = {
  name: string;
  parse: (value: unknown) => TShape;
};

export const settingsTypes = {
  leaveTypes: {
    name: "leaveTypes",
    parse: (value: unknown) => leaveTypeParser.parse(value),
  },
  managers: {
    name: "managers",
    parse: (value: unknown) => managersParser.parse(value),
  },
  yearlyQuota: {
    name: "yearlyQuota",
    parse: (value: unknown) => yearlyQuotaParser.parse(value),
  },
  yearlyUserQuotas: {
    name: "yearlyUserQuotas",
    parse: (value: unknown) => yearlyUserQuotasParser.parse(value),
  },
  location: {
    name: "location",
    parse: (value: unknown) => locationParser.parse(value),
  },
  workSchedule: {
    name: "workSchedule",
    parse: (value: unknown) => worksScheduleParser.parse(value),
  },
  qualifications: {
    name: "qualifications",
    parse: (value: unknown) => qualificationsParser.parse(value),
  },
  userQualifications: {
    name: "userQualifications",
    parse: (value: unknown) => userQualificationsParser.parse(value),
  },
  schedulePositionTemplates: {
    name: "schedulePositionTemplates",
    parse: (value: unknown) => schedulePositionTemplatesParser.parse(value),
  },
} as const;

export type SettingsTypeKey = keyof typeof settingsTypes;

export type SettingsShape<TKey extends SettingsTypeKey> =
  TKey extends "leaveTypes"
    ? LeaveTypes
    : TKey extends "managers"
      ? Managers
      : TKey extends "yearlyQuota"
        ? YearlyQuota
        : TKey extends "yearlyUserQuotas"
          ? YearlyUserQuotas
          : TKey extends "location"
            ? Location
            : TKey extends "workSchedule"
              ? WorkSchedule
              : TKey extends "qualifications"
                ? Qualifications
                : TKey extends "userQualifications"
                  ? UserQualifications
                  : TKey extends "schedulePositionTemplates"
                    ? SchedulePositionTemplates
                    : never;
