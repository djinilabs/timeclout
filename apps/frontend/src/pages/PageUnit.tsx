import { Suspense } from "react";
import { AllUnitTeams } from "../components/AllUnitTeams";

export const PageUnit = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllUnitTeams />
    </Suspense>
  );
};
