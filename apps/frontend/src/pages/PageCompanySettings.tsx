import { EditCompanySetting } from "../components/EditCompanySetting";
import { Suspense } from "../components/atoms/Suspense";

export const PageCompanySettings = () => {
  return (
    <Suspense>
      <EditCompanySetting />
    </Suspense>
  );
};
