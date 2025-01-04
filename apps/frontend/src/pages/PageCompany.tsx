import { Suspense } from "react";
import { AllCompanyUnits } from "../components/AllCompanyUnits";

export const PageCompany = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllCompanyUnits />
    </Suspense>
  );
};
