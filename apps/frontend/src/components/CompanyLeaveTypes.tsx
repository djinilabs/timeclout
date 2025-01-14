import { useParams } from "react-router-dom";
import { LeaveTypes, leaveTypeParser } from "@/settings";
import { getDefined } from "@/utils";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import { useQuery } from "../hooks/useQuery";
import { leaveTypeColors, leaveTypeIcons } from "../settings/leaveTypes";
import { CompanySettingsArgs, Query } from "../graphql/graphql";
import { QueryCompanyArgs } from "../graphql/graphql";

export const CompanyLeaveTypes = () => {
  const { company: companyPk } = useParams();
  const [companyWithSettingsQueryResponse] = useQuery<
    { company: Query["company"] },
    QueryCompanyArgs & CompanySettingsArgs
  >({
    query: companyWithSettingsQuery,
    variables: {
      companyPk: getDefined(companyPk, "No company provided"),
      name: "leaveTypes",
    },
  });
  const company = companyWithSettingsQueryResponse?.data?.company;
  console.log("company", company);
  const leaveTypes: LeaveTypes | undefined =
    company?.settings && leaveTypeParser.parse(company.settings);
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <p className="mt-1 text-sm/6 text-gray-600 py-5">
        Manage the leave types for the workers in this company:
      </p>
      <div className="flex py-5">
        <div>
          <ul
            role="list"
            className="divide-y divide-gray-100 max-w-fit shadow-md p-4"
          >
            {leaveTypes?.map((leaveType) => (
              <li
                key={leaveType.name}
                className="flex items-center justify-between gap-x-6 py-5"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div
                    className="flex items-center justify-center rounded-full w-8 h-8"
                    style={{
                      backgroundColor: leaveTypeColors[leaveType.color],
                    }}
                  >
                    {leaveTypeIcons[leaveType.icon]}
                  </div>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm/6 text-gray-900">{leaveType.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/companies/${companyPk}/settings/leaveTypes/${leaveType.name}`}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Edit
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
