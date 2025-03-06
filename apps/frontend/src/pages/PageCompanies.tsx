import { AllUserCompanies } from "../components/AllUserCompanies";
import { Suspense } from "../components/stateless/Suspense";

export const PageCompanies = () => {
  return (
    <div>
      <Suspense>
        <AllUserCompanies />
      </Suspense>
    </div>
  );
};
