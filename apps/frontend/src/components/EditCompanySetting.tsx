import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getDefined } from "../../../../libs/utils/src";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import { useQuery } from "../hooks/useQuery";
import { LeaveTypeEditor } from "./LeaveTypeEditor";
import { useMutation } from "../hooks/useMutation";
import updateCompanySettingsMutation from "@/graphql-client/mutations/updateCompanySettings.graphql";

const settingEditor: Record<
  string,
  React.FC<{ settings: any; onSubmit: (values: any) => void }>
> = {
  leaveTypes: LeaveTypeEditor,
};

export const EditCompanySetting = () => {
  const { company: companyPk, settingName } = useParams();
  const [companyWithSettingsQueryResponse] = useQuery({
    query: companyWithSettingsQuery,
    variables: {
      companyPk,
      name: settingName,
    },
  });
  const company = companyWithSettingsQueryResponse?.data?.company;
  const settings = company?.settings;
  const Editor = settingEditor[getDefined(settingName)];

  const [, updateCompanySettings] = useMutation(updateCompanySettingsMutation);
  const navigate = useNavigate();
  const onSubmit = async (values: any) => {
    const response = await updateCompanySettings({
      companyPk: getDefined(companyPk),
      name: getDefined(settingName),
      settings: values,
    });
    if (!response.error) {
      toast.success("Settings updated");
      navigate(`/companies/${companyPk}?tab=settings&settingsTab=leave-types`);
    }
  };

  return <Editor settings={settings} onSubmit={onSubmit} />;
};
