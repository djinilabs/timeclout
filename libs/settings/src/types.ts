import { type LeaveTypes, leaveTypeParser } from "./leaveTypes";
import { type Managers, managersParser } from "./managers";
import { type YearlyQuota, yearlyQuotaParser } from "./yearlyQuota";
import {
  type YearlyUserQuotas,
  yearlyUserQuotasParser,
} from "./yearlyUserQuotas";
import { type Location, locationParser } from "./location";
import { type WorkSchedule, worksScheduleParser } from "./workSchedule";
import { type Qualifications, qualificationsParser } from "./qualifications";
import {
  type UserQualifications,
  userQualificationsParser,
} from "./userQualifications";
import {
  type SchedulePositionTemplates,
  schedulePositionTemplatesParser,
} from "./schedulePositionTemplates";
import {
  type ScheduleDayTemplates,
  scheduleDayTemplatesParser,
} from "./scheduleDayTemplates";

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
  scheduleDayTemplates: {
    name: "scheduleDayTemplates",
    parse: (value: unknown) => scheduleDayTemplatesParser.parse(value),
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
    : TKey extends "scheduleDayTemplates"
    ? ScheduleDayTemplates
    : never;
