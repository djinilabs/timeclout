import { EditCompanySetting } from "../components/EditCompanySetting";
import { Suspense } from "../components/Suspense";

export const PageCompanySettings = () => {
  return (
    <Suspense>
      <EditCompanySetting />
    </Suspense>
  );
};
