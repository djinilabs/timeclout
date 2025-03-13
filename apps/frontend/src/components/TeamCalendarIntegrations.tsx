import { CalendarIcon } from "@heroicons/react/20/solid";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const translations = {
  shifts: i18n.t("Team shifts calendar"),
  leaves: i18n.t("Team leaves calendar"),
};

export const TeamCalendarIntegrations = () => {
  const { team: teamPk } = useParams();
  const urls = useMemo(() => {
    return {
      shifts: `${window.location.origin}/api/v1/ical/teams/${teamPk}/shifts`,
      leaves: `${window.location.origin}/api/v1/ical/teams/${teamPk}/leaves`,
    };
  }, [teamPk]);
  return (
    <div className="mt-4">
      <p className="text-sm/6 text-gray-500">
        <Trans>Calendar subscriptions:</Trans>
      </p>
      <p className="mb-4 text-sm/6 text-gray-500">
        <Trans>
          You can subscribe to your team's calendar using the URL below. This
          allows you to see team shifts directly in your calendar app. To
          subscribe:
        </Trans>
      </p>
      <ul className="mb-4 ml-6 list-disc text-sm/6 text-gray-500">
        <li>
          <Trans>
            In Google Calendar: Click the + next to "Other calendars" &gt; "From
            URL" and paste the URL
          </Trans>
        </li>
        <li>
          <Trans>
            In Apple Calendar: File &gt; New Calendar Subscription and paste the
            URL
          </Trans>
        </li>
        <li>
          <Trans>
            In Outlook: Settings &gt; Calendar &gt; Add calendar &gt; Subscribe
            from web and paste the URL
          </Trans>
        </li>
      </ul>
      <ul role="list">
        {Object.entries(urls).map(([key, url]) => (
          <li
            key={key}
            className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-x-4"
          >
            <CalendarIcon className="size-5 text-gray-400" />
            <span className="text-sm/6 font-medium text-gray-900">
              {translations[key as keyof typeof translations]}
            </span>
            <input
              className="text-sm/6 text-gray-500 font-mono"
              value={url}
              style={{ width: `${url.length}ch` }}
              readOnly
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(url);
                const button = document.activeElement as HTMLButtonElement;
                const originalContent = button.innerHTML;
                button.innerHTML = `<span class="text-sm font-medium text-green-600">Copied!</span>`;
                setTimeout(() => {
                  button.innerHTML = originalContent;
                }, 2000);
              }}
              className="rounded-md p-1 text-gray-400 hover:text-gray-500"
              title={i18n.t(`Copy URL`)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
