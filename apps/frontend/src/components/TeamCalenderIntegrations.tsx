import { CalendarIcon } from "@heroicons/react/20/solid";
import { Trans } from "@lingui/react/macro";
import { useParams } from "react-router-dom";

export const TeamCalenderIntegrations = () => {
  const { team: teamPk } = useParams();
  return (
    <div className="mt">
      <p className="text-sm/6 text-gray-500">
        <Trans>Calendar subscriptions:</Trans>
      </p>
      <ul role="list" className="divide-y divide-gray-100">
        <li className="flex justify-between gap-x-6 py-5">
          <CalendarIcon className="size-5 text-gray-400" />{" "}
          <input
            className="text-sm/6 text-gray-500"
            value={`/api/v1/ical/teams/${teamPk}/shifts`}
          />
        </li>
      </ul>
    </div>
  );
};
