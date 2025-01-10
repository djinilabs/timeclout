import { Suspense, useCallback, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { YearCalendar } from "./YearCalendar";
import { BookCompanyTimeOff, type TimeOffRequest } from "./BookCompanyTimeOff";
import { useMutation } from "../hooks/useMutation";
import { createLeaveRequestMutation } from "../graphql/mutations/createLeaveRequest";
import toast from "react-hot-toast";

export const CompanyTimeOff = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const location = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [, createLeaveRequest] = useMutation(createLeaveRequestMutation);
  const { company } = useParams();
  const onSubmit = useCallback(
    async (values: TimeOffRequest) => {
      const [startDate, endDate] = values.dateRange;
      if (!startDate || !endDate) {
        return;
      }
      const result = await createLeaveRequest({
        input: {
          companyPk: company,
          type: values.type,
          reason: values.reason,
          startDate: startDate,
          endDate: endDate,
        },
      });
      if (!result.error) {
        toast.success("Leave request submitted");
        navigate({
          pathname: location.pathname,
          search: new URLSearchParams({
            ...Object.fromEntries(params),
            bookTimeOff: "false",
          }).toString(),
        });
      }
    },
    [createLeaveRequest]
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {params.get("bookTimeOff") === "true" ? (
        <BookCompanyTimeOff
          onSubmit={onSubmit}
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
