import { Suspense } from "react";
import { EditCompanySetting } from "../components/EditCompanySetting";

export const PageCompanySettings = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCompanySetting />
    </Suspense>
  );
};
