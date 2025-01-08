import { Suspense, useState } from "react";
import { YearCalendar } from "./YearCalendar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BookCompanyTimeOff } from "./BookCompanyTimeOff";

export const CompanyTimeOff = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const location = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {params.get("bookTimeOff") === "true" ? (
        <BookCompanyTimeOff
          onSubmit={(values) => {
            console.log(values);
          }}
          onCancel={() => {
            navigate({
              pathname: location.pathname,
              search: new URLSearchParams({
                ...Object.fromEntries(params),
                bookTimeOff: "false",
              }).toString(),
            });
          }}
        />
      ) : (
        <YearCalendar
          year={year}
          goToYear={setYear}
          bookTimeOff={() => {
            navigate({
              pathname: location.pathname,
              search: new URLSearchParams({
                ...Object.fromEntries(params),
                bookTimeOff: "true",
              }).toString(),
            });
          }}
        />
      )}
    </Suspense>
  );
};
