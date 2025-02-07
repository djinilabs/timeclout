import { EditCompanySetting } from "../components/EditCompanySetting";
import { Suspense } from "../components/stateless/Suspense";

export const PageCompanySettings = () => {
  return (
    <Suspense>
      <EditCompanySetting />
    </Suspense>
  );
};
