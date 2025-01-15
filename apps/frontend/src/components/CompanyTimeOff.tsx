import { Suspense, useCallback, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import { getDefined } from "@/utils";
import createLeaveRequestMutation from "@/graphql-client/mutations/createLeaveRequest.graphql";
import myLeaveCalendarQuery from "@/graphql-client/queries/myLeaveCalendar.graphql";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import { LeaveDay, YearCalendar } from "./YearCalendar";
import { BookCompanyTimeOff, type TimeOffRequest } from "./BookCompanyTimeOff";
import { useMutation } from "../hooks/useMutation";
import {
  Calendar,
  CompanySettingsArgs,
  Leave,
  LeaveRequest,
  Mutation,
  MutationCreateLeaveRequestArgs,
  Query,
  QueryCompanyArgs,
} from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import { leaveTypeColors } from "../settings/leaveTypes";
import { leaveTypeIcons } from "../settings/leaveTypes";
import { leaveTypeParser } from "@/settings";

export const CompanyTimeOff = () => {
  const { company } = useParams();
  const [year, setYear] = useState(new Date().getFullYear());
  const location = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [companyWithSettingsQueryResponse] = useQuery<
    { company: Query["company"] },
    QueryCompanyArgs & CompanySettingsArgs
  >({
    query: companyWithSettingsQuery,
    variables: {
      companyPk: getDefined(company, "No company provided"),
      name: "leaveTypes",
    },
  });

  const companyLeaveSettings = useMemo(
    () =>
      companyWithSettingsQueryResponse?.data?.company?.settings
        ? Object.fromEntries(
            leaveTypeParser
              .parse(companyWithSettingsQueryResponse.data.company.settings)
              .map((leaveType) => [leaveType.name, leaveType])
          )
        : undefined,
    [companyWithSettingsQueryResponse]
  );
  const leaveTypeForCalendar = useCallback(
    (
      leave: Leave | LeaveRequest,
      approvedLeaveRequests: Record<string, LeaveRequest>
    ): LeaveDay => {
      const leaveType = companyLeaveSettings?.[leave.type];
      return {
        type: leave.type,
        icon: leaveType && leaveTypeIcons[leaveType?.icon],
        color: leaveType && leaveTypeColors[leaveType?.color],
        leaveRequest:
          "leaveRequestPk" in leave
            ? approvedLeaveRequests[
                `${leave.leaveRequestPk}/${leave.leaveRequestSk}`
              ]
            : undefined,
      };
    },
    [companyLeaveSettings]
  );

  const [myLeaveCalendar, refreshMyLeaveCalendar] = useQuery<{
    myLeaveCalendar: Calendar;
  }>({
    pollingIntervalMs: 10_000,
    query: myLeaveCalendarQuery,
    variables: {
      companyPk: getDefined(company, "No company provided"),
      year,
    },
  });

  const calendarDateMap: Record<string, LeaveDay> = useMemo(() => {
    const approvedLeaveRequests: Record<string, LeaveRequest> = {};
    return {
      ...myLeaveCalendar.data?.myLeaveCalendar.leaveRequests.reduce(
        (acc, leaveRequest) => {
          if (!leaveRequest.approved) {
            const startDate = new Date(leaveRequest.startDate);
            const endDate = new Date(leaveRequest.endDate);
            while (startDate <= endDate) {
              acc[startDate.toISOString().split("T")[0]] = leaveTypeForCalendar(
                leaveRequest,
                approvedLeaveRequests
              );
              startDate.setDate(startDate.getDate() + 1);
            }
          } else {
            approvedLeaveRequests[`${leaveRequest.pk}/${leaveRequest.sk}`] =
              leaveRequest;
          }
          return acc;
        },
        {} as Record<string, LeaveDay>
      ),
      ...myLeaveCalendar.data?.myLeaveCalendar.leaves.reduce(
        (acc, leave) => {
          acc[leave.sk] = leaveTypeForCalendar(leave, approvedLeaveRequests);
          return acc;
        },
        {} as Record<string, LeaveDay>
      ),
    };
  }, [
    leaveTypeForCalendar,
    myLeaveCalendar.data?.myLeaveCalendar.leaveRequests,
    myLeaveCalendar.data?.myLeaveCalendar.leaves,
  ]);

  const [, createLeaveRequest] = useMutation<
    Mutation["createLeaveRequest"],
    MutationCreateLeaveRequestArgs
  >(createLeaveRequestMutation);
  const onSubmit = useCallback(
    async (values: TimeOffRequest) => {
      const [startDate, endDate] = values.dateRange;
      if (!startDate || !endDate) {
        return;
      }
      const result = await createLeaveRequest({
        input: {
          companyPk: getDefined(company, "No company provided"),
          type: values.type,
          reason: values.reason,
          startDate: startDate,
          endDate: endDate,
        },
      });
      if (!result.error) {
        toast.success("Leave request submitted");
        refreshMyLeaveCalendar();
        navigate({
          pathname: location.pathname,
          search: new URLSearchParams({
            ...Object.fromEntries(params),
            bookTimeOff: "false",
          }).toString(),
        });
      }
    },
    [
      company,
      createLeaveRequest,
      location.pathname,
      navigate,
      params,
      refreshMyLeaveCalendar,
    ]
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
          calendarDateMap={calendarDateMap}
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
