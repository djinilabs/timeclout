import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getDefined } from "../../../../libs/utils/src";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import { useQuery } from "../hooks/useQuery";
import { LeaveTypeEditor } from "./LeaveTypeEditor";
import { useMutation } from "../hooks/useMutation";
import updateCompanySettingsMutation from "@/graphql-client/mutations/updateCompanySettings.graphql";
import {
  CompanySettingsArgs,
  Mutation,
  MutationUpdateCompanySettingsArgs,
  Query,
  QueryCompanyArgs,
} from "../graphql/graphql";
import { i18n } from "@lingui/core";
const settingEditor: Record<
  string,
  React.FC<{ settings: unknown; onSubmit: (values: unknown) => void }>
> = {
  leaveTypes: LeaveTypeEditor,
};

export const EditCompanySetting = () => {
  const { company: companyPk, settingName } = useParams();
  const [companyWithSettingsQueryResponse] = useQuery<
    { company: Query["company"] },
    QueryCompanyArgs & CompanySettingsArgs
  >({
    query: companyWithSettingsQuery,
    variables: {
      companyPk: getDefined(companyPk, "No company provided"),
      name: getDefined(settingName, "No setting name provided"),
    },
  });
  const company = companyWithSettingsQueryResponse?.data?.company;
  const settings = company?.settings;
  const Editor = settingEditor[getDefined(settingName)];

  const [, updateCompanySettings] = useMutation<
    Mutation["updateCompanySettings"],
    MutationUpdateCompanySettingsArgs
  >(updateCompanySettingsMutation);
  const navigate = useNavigate();
  const onSubmit = async (values: unknown) => {
    const response = await updateCompanySettings({
      companyPk: getDefined(companyPk),
      name: getDefined(settingName),
      settings: values,
    });
    if (!response.error) {
      toast.success(i18n.t("Settings updated"));
      navigate(`/companies/${companyPk}?tab=settings&settingsTab=leave-types`);
    }
  };

  return <Editor settings={settings} onSubmit={onSubmit} />;
};
