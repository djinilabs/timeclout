import { AllUserCompanies } from "../components/AllUserCompanies";
import { Suspense } from "../components/atoms/Suspense";

export const PageCompanies = () => {
  return (
    <div>
      <Suspense>
        <AllUserCompanies />
      </Suspense>
    </div>
  );
};
