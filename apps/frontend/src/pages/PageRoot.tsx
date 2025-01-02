import { Suspense } from "react";
import { AllUserCompanies } from "../components/AllUserCompanies";

export const PageRoot = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AllUserCompanies />
      </Suspense>
    </div>
  );
};
