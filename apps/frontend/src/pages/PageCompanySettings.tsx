import { Suspense } from "../components/atoms/Suspense";
import { EditCompanySetting } from "../components/company/EditCompanySetting";

export const PageCompanySettings = () => {
  return (
    <Suspense>
      <EditCompanySetting />
    </Suspense>
  );
};
