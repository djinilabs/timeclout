import {
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
  DocumentTextIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { useState, useEffect } from "react";
import { useParams, useSearchParams , Link } from "react-router-dom";

import { getContextualHelp } from "../contextual-help";
import { HelpSection } from "../contextual-help/types";


export const ContextualHelpContent = () => {
  const { company, unit, team } = useParams();
  const [searchParams] = useSearchParams();
  const { i18n } = useLingui();

  const [helpContent, setHelpContent] = useState<HelpSection | null>(null);
  const [loading, setLoading] = useState(true);

  const tab = searchParams.get("tab") || undefined;
  const settingsTab = searchParams.get("settingsTab") || undefined;
  const dialog = searchParams.get("dialog") || undefined;
  const teamShiftScheduleDialog =
    searchParams.get("team-shift-schedule-dialog") || undefined;

  useEffect(() => {
    const loadHelpContent = async () => {
      setLoading(true);
      try {
        const content = await getContextualHelp(
          company,
          unit,
          team,
          tab,
          settingsTab,
          dialog,
          teamShiftScheduleDialog,
          i18n.locale as "en" | "pt"
        );
        setHelpContent(content);
      } catch (error) {
        console.error("Failed to load help content:", error);
        setHelpContent({
          title: "Help",
          description: "Help content not available.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadHelpContent();
  }, [
    company,
    unit,
    team,
    tab,
    settingsTab,
    dialog,
    teamShiftScheduleDialog,
    i18n.locale,
  ]);

  const getContextualLinks = () => {
    const links = [];

    if (company && unit && team) {
      // Team level - show team-related links
      links.push(
        {
          title:
            i18n.locale === "pt" ? "Configurações da Equipa" : "Team Settings",
          href: `/companies/${company}/units/${unit}/teams/${team}?tab=settings`,
          icon: CogIcon,
          description:
            i18n.locale === "pt"
              ? "Configure preferências e permissões da equipa"
              : "Configure team preferences and permissions",
        },
        {
          title: i18n.locale === "pt" ? "Membros da Equipa" : "Team Members",
          href: `/companies/${company}/units/${unit}/teams/${team}?tab=members`,
          icon: UserGroupIcon,
          description:
            i18n.locale === "pt"
              ? "Gerir membros da equipa e funções"
              : "Manage team members and roles",
        },
        {
          title:
            i18n.locale === "pt" ? "Calendário de Férias" : "Leave Calendar",
          href: `/companies/${company}/units/${unit}/teams/${team}?tab=leave-schedule`,
          icon: CalendarIcon,
          description:
            i18n.locale === "pt"
              ? "Ver calendário de férias da equipa"
              : "View team leave schedule",
        }
      );
    } else if (company && unit) {
      // Unit level - show unit-related links
      links.push(
        {
          title:
            i18n.locale === "pt" ? "Configurações da Unidade" : "Unit Settings",
          href: `/companies/${company}/units/${unit}?tab=settings`,
          icon: CogIcon,
          description:
            i18n.locale === "pt"
              ? "Configure configurações da unidade"
              : "Configure unit settings",
        },
        {
          title: i18n.locale === "pt" ? "Equipas" : "Teams",
          href: `/companies/${company}/units/${unit}?tab=teams`,
          icon: UserGroupIcon,
          description:
            i18n.locale === "pt"
              ? "Gerir equipas nesta unidade"
              : "Manage teams in this unit",
        }
      );
    } else if (company) {
      // Company level - show company-related links
      links.push(
        {
          title:
            i18n.locale === "pt"
              ? "Configurações da Empresa"
              : "Company Settings",
          href: `/companies/${company}/settings`,
          icon: CogIcon,
          description:
            i18n.locale === "pt"
              ? "Configure configurações da empresa"
              : "Configure company settings",
        },
        {
          title: i18n.locale === "pt" ? "Unidades" : "Units",
          href: `/companies/${company}?tab=units`,
          icon: UserGroupIcon,
          description:
            i18n.locale === "pt"
              ? "Gerir unidades da empresa"
              : "Manage company units",
        }
      );
    }

    return links;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!helpContent) {
    console.error("No help content found");
    return null;
  }

  const contextualLinks = getContextualLinks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {helpContent.title}
        </h2>
        <div className="mt-2 text-sm text-gray-600">
          {helpContent.description}
        </div>
      </div>

      {/* Quick Actions */}
      {contextualLinks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            <Trans>Quick Actions</Trans>
          </h3>
          <div className="space-y-2">
            {contextualLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <link.icon className="h-5 w-5 text-gray-500 mr-3" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {link.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {link.description}
                  </div>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Key Features - More concise */}
      {helpContent.features && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            <Trans>What You Can Do</Trans>
          </h3>
          <div className="space-y-3">
            {helpContent.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {feature.title}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screenshots */}
      {helpContent.screenshots && helpContent.screenshots.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            <Trans>Visual Guide</Trans>
          </h3>
          <div className="space-y-3">
            {helpContent.screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3"
              >
                {screenshot.src ? (
                  <img
                    src={screenshot.src}
                    alt={screenshot.alt || screenshot.caption}
                    className="w-full h-auto rounded mb-2"
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-2">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                    <span className="text-xs text-gray-500 ml-2">
                      {i18n.locale === "pt"
                        ? `Captura de Ecrã ${index + 1}`
                        : `Screenshot ${index + 1}`}
                    </span>
                  </div>
                )}
                <div className="text-xs text-gray-600">
                  {screenshot.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information - Collapsible for space efficiency */}
      {helpContent.sections && helpContent.sections.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
              <span>
                <Trans>More Details</Trans>
              </span>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
            </div>
          </summary>
          <div className="mt-3 space-y-4 pl-4 border-l-2 border-gray-100">
            {helpContent.sections.map((section, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium text-gray-900">
                  {section.title}
                </h4>
                <div className="mt-1 text-xs text-gray-600">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Dependencies - Only show if relevant */}
      {helpContent.dependencies && (
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
              <span>
                <Trans>Prerequisites</Trans>
              </span>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
            </div>
          </summary>
          <div className="mt-3">{helpContent.dependencies}</div>
        </details>
      )}

      {/* Roles - Only show if relevant */}
      {helpContent.roles && (
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
              <span>
                <Trans>Role Permissions</Trans>
              </span>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
            </div>
          </summary>
          <div className="mt-3">{helpContent.roles}</div>
        </details>
      )}

      {/* Contact Support */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          <Trans>Need More Help?</Trans>
        </h3>
        <p className="text-xs text-gray-600 mb-2">
          <Trans>Contact our support team</Trans>
        </p>
        <a
          href="mailto:support@tt3.app"
          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
        >
          support@tt3.app
        </a>
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
    <div className="fixed bottom-4 right-4 z-500">
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
