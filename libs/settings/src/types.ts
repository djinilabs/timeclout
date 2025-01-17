import { leaveTypeParser, LeaveTypes } from "./leaveTypes";
import { Managers, managersParser } from "./managers";
import { YearlyQuota, yearlyQuotaParser } from "./yearlyQuota";
import { YearlyUserQuotas, yearlyUserQuotasParser } from "./yearlyUserQuotas";

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
          : never;
