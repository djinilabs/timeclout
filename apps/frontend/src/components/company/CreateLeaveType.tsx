import { i18n } from "@lingui/core";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import {
  CompanySettingsArgs as CompanySettingsArguments,
  Mutation,
  MutationUpdateCompanySettingsArgs as MutationUpdateCompanySettingsArguments,
  Query,
 QueryCompanyArgs as QueryCompanyArguments } from "../../graphql/graphql";
import { useMutation } from "../../hooks/useMutation";
import { useQuery } from "../../hooks/useQuery";
import { LeaveTypeEditor } from "../molecules/LeaveTypeEditor";

import updateCompanySettingsMutation from "@/graphql-client/mutations/updateCompanySettings.graphql";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import { leaveTypeParser } from "@/settings";
import { getDefined } from "@/utils";


export const CreateLeaveType = () => {
  const { company: companyPk } = useParams();
  const navigate = useNavigate();
  const [companyWithSettingsQueryResponse] = useQuery<
    { company: Query["company"] },
    QueryCompanyArguments & CompanySettingsArguments
  >({
    query: companyWithSettingsQuery,
    variables: {
      companyPk: getDefined(companyPk, "No company provided"),
      name: "leaveTypes",
    },
  });

  const [, updateCompanySettings] = useMutation<
    Mutation["updateCompanySettings"],
    MutationUpdateCompanySettingsArguments
  >(updateCompanySettingsMutation);

  const company = companyWithSettingsQueryResponse?.data?.company;
  const leaveTypes = company?.settings
    ? leaveTypeParser.parse(company.settings)
    : [];

  const handleSubmit = async (newSettings: unknown) => {
    const response = await updateCompanySettings({
      companyPk: getDefined(companyPk),
      name: "leaveTypes",
      settings: newSettings,
    });

    if (!response.error) {
      toast.success(i18n.t("Leave type created"));
      navigate(`/companies/${companyPk}?tab=settings&settingsTab=leave-types`);
    }
  };

  return (
    <LeaveTypeEditor
      creating
      settings={leaveTypes}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(`/companies/${companyPk}?tab=settings&settingsTab=leave-types`)
      }
    />
  );
};
