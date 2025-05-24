import { EditCompanySetting } from "../components/company/EditCompanySetting";
import { Suspense } from "../components/atoms/Suspense";

export const PageCompanySettings = () => {
  return (
    <Suspense>
      <EditCompanySetting />
    </Suspense>
  );
};
