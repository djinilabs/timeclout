import { useParams, useSearchParams } from "react-router-dom";
import { Trans } from "@lingui/react/macro";
import { getContextualHelp } from "../../locales/contextual-help";

export const ContextualHelpContent = () => {
  const { company, unit, team } = useParams();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || undefined;
  const settingsTab = searchParams.get("settingsTab") || undefined;
  const dialog = searchParams.get("dialog") || undefined;
  const teamShiftScheduleDialog =
    searchParams.get("team-shift-schedule-dialog") || undefined;

  const helpContent = getContextualHelp(
    company,
    unit,
    team,
    tab,
    settingsTab,
    dialog,
    teamShiftScheduleDialog
  );

  console.log("Help content:", helpContent);

  if (!helpContent) {
    console.error("No help content found");
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{helpContent.title}</h2>
        <p className="mt-2 text-sm text-gray-600">{helpContent.description}</p>
      </div>

      {helpContent.features && (
        <div>
          <h3 className="text-md font-semibold">
            <Trans>Key Features</Trans>
          </h3>
          <ul className="mt-2 space-y-4">
            {helpContent.features.map((feature, index) => (
              <li key={index}>
                <h4 className="font-medium">{feature.title}</h4>
                <p className="mt-1 text-sm text-gray-600">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {helpContent.sections && (
        <div>
          <h3 className="text-md font-semibold">
            <Trans>Additional Information</Trans>
          </h3>
          <div className="mt-2 space-y-4">
            {helpContent.sections.map((section, index) => (
              <div key={index}>
                <h4 className="font-medium">{section.title}</h4>
                <div className="mt-1 text-sm text-gray-600">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {helpContent.dependencies && (
        <div className="mt-6">{helpContent.dependencies}</div>
      )}

      {helpContent.roles && <div className="mt-6">{helpContent.roles}</div>}

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-md font-semibold">
          <Trans>Need More Help?</Trans>
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          <Trans>Contact our customer service team at</Trans>{" "}
          <a
            href="mailto:support@tt3.app"
            className="text-blue-600 hover:text-blue-800"
          >
            support@tt3.app
          </a>
        </p>
      </div>
    </div>
  );
};

export interface ContextualHelpProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ContextualHelp = ({ isOpen }: ContextualHelpProps) => {
  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      style={{ border: "1px solid red" }}
    >
      {isOpen && (
        <div className="fixed top-10 inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full justify-center text-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <ContextualHelpContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextualHelp;
