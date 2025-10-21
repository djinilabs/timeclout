import { useMemo } from "react";

import {
  Company,
  QueryCompanyArgs,
  CompanySettingsArgs,
} from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";

import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import { SettingsShape, SettingsTypeKey, settingsTypes } from "@/settings";

export interface UseCompanyWithSettingsParams<T extends SettingsTypeKey> {
  companyPk: string;
  settingsName: T;
}

export interface useCompanyWithSettingsResponse<T extends SettingsTypeKey> {
  company: Company | undefined;
  settings: SettingsShape<T> | undefined;
}

export const useCompanyWithSettings = <T extends SettingsTypeKey>({
  companyPk,
  settingsName,
}: UseCompanyWithSettingsParams<T>): useCompanyWithSettingsResponse<T> => {
  const [companyWithSettingsQueryResponse] = useQuery<
    { company: Company },
    QueryCompanyArgs & CompanySettingsArgs
  >({
    query: companyWithSettingsQuery,
    variables: {
      companyPk,
      name: settingsName,
    },
  });
  const company = companyWithSettingsQueryResponse?.data?.company;
  const companySettings: SettingsShape<T> = useMemo(
    () =>
      company?.settings && settingsTypes[settingsName].parse(company.settings),
    [company, settingsName]
  );

  return {
    company,
    settings: companySettings,
  };
};
