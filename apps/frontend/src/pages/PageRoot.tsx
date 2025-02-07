import { AllUserCompanies } from "../components/AllUserCompanies";
import { Suspense } from "../components/stateless/Suspense";

export const PageRoot = () => {
  return (
    <div>
      <Suspense>
        <AllUserCompanies />
      </Suspense>
    </div>
  );
};
