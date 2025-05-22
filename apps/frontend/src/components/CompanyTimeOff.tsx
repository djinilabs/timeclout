import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import { i18n } from "@lingui/core";
import { getDefined } from "@/utils";
import { DayDate } from "@/day-date";
import { leaveTypeParser } from "@/settings";
import createLeaveRequestMutation from "@/graphql-client/mutations/createLeaveRequest.graphql";
import myLeaveCalendarQuery from "@/graphql-client/queries/myLeaveCalendar.graphql";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import mySettingsQuery from "@/graphql-client/queries/mySettings.graphql";
import { LeaveDay, YearCalendar } from "./stateless/YearCalendar";
import { BookCompanyTimeOff, type TimeOffRequest } from "./BookCompanyTimeOff";
import { useMutation } from "../hooks/useMutation";
import {
  Calendar,
  CompanySettingsArgs,
  Leave,
  LeaveRequest,
  Mutation,
  MutationCreateLeaveRequestArgs,
  MutationCreateSingleDayLeaveRequestsArgs,
  Query,
  QueryCompanyArgs,
} from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import { leaveTypeColors } from "../settings/leaveTypes";
import { leaveTypeIcons } from "../settings/leaveTypes";
import { useHolidays } from "../hooks/useHolidays";
import { Suspense } from "./atoms/Suspense";
import { MyQuotaFulfilment } from "./MyQuotaFulfilment";

const CompanyTimeOff = () => {
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
            : leave,
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

  const [, createSingleDayLeaveRequests] = useMutation<
    Mutation["createSingleDayLeaveRequests"],
    MutationCreateSingleDayLeaveRequestsArgs
  >(createLeaveRequestMutation);

  const onSubmit = useCallback(
    async (values: TimeOffRequest) => {
      const [startDate, endDate] = values.dateRange;
      const dates = values.dates;
      if (!dates.length && (!startDate || !endDate)) {
        return;
      }
      if (values.mode === "range" && startDate && endDate) {
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
          toast.success(i18n.t("Leave request submitted"));
        }
      }

      if (values.mode === "multiple" && dates.length) {
        const result = await createSingleDayLeaveRequests({
          input: {
            companyPk: getDefined(company, "No company provided"),
            type: values.type,
            reason: values.reason,
            days: values.dates,
          },
        });

        if (!result.error) {
          toast.success(i18n.t("Leave requests submitted"));
        }
      }

      refreshMyLeaveCalendar();
      navigate({
        pathname: location.pathname,
        search: new URLSearchParams({
          ...Object.fromEntries(params),
          bookTimeOff: "false",
        }).toString(),
      });
    },
    [
      company,
      createLeaveRequest,
      createSingleDayLeaveRequests,
      location.pathname,
      navigate,
      params,
      refreshMyLeaveCalendar,
    ]
  );

  const [userLocationSettingsResult] = useQuery<{ me: Query["me"] }>({
    query: mySettingsQuery,
    variables: {
      settingsName: "location",
    },
  });

  const userLocationSettings = userLocationSettingsResult?.data?.me?.settings;

  const { data: holidays, error: holidaysError } = useHolidays(
    useMemo(
      () => ({
        country: userLocationSettings?.country,
        region: userLocationSettings?.region,
        startDate: new DayDate(new Date(year, 0, 1)),
        endDate: new DayDate(new Date(year, 11, 31)),
      }),
      [userLocationSettings, year]
    )
  );

  useEffect(() => {
    if (holidaysError) {
      toast.error(`Error fetching holidays: ${holidaysError.message}`);
    }
  }, [holidaysError]);

  return (
    <Suspense>
      {params.get("bookTimeOff") === "true" && userLocationSettings ? (
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
          location={userLocationSettings}
          quotaFulfilment={({
            companyPk,
            startDate,
            endDate,
            simulatesLeave,
            simulatesLeaveType,
          }) => (
            <MyQuotaFulfilment
              companyPk={companyPk}
              startDate={startDate}
              endDate={endDate}
              simulatesLeave={simulatesLeave}
              simulatesLeaveType={simulatesLeaveType}
            />
          )}
        />
      ) : (
        <YearCalendar
          year={year}
          goToYear={setYear}
          calendarDateMap={calendarDateMap}
          holidays={holidays}
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

export default CompanyTimeOff;
