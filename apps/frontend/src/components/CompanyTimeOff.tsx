import { Suspense, useState } from "react";
import { YearCalendar } from "./YearCalendar";

export const CompanyTimeOff = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <YearCalendar year={year} goToYear={setYear} />
    </Suspense>
  );
};
