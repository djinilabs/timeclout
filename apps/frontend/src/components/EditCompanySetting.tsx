import { useParams } from "react-router-dom";
import { getDefined } from "../../../../libs/utils/src";
import { companyWithSettingsQuery } from "../graphql/queries/companyWithSettings";
import { useQuery } from "../hooks/useQuery";
import { LeaveTypeEditor } from "./LeaveTypeEditor";

const settingEditor: Record<string, React.FC<{ settings: any }>> = {
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

  return <Editor settings={settings} />;
};
