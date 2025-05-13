import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const teamManagementHelp: HelpSection = {
  title: "Team Management",
  description: (
    <>
      Manage your teams within this unit. Create new teams, assign members, and
      configure team settings. Each team can have its own schedule, leave
      policies, and shift templates. This interface allows you to maintain
      efficient team structures and ensure proper resource allocation.
    </>
  ),
  features: [
    {
      title: "Team Creation",
      description:
        "Create new teams with specific configurations and member assignments",
    },
    {
      title: "Member Management",
      description: "Add, remove, and manage team members and their roles",
    },
    {
      title: "Team Settings",
      description:
        "Configure team-specific policies, schedules, and preferences. Set up work patterns, leave entitlements, and shift requirements.",
    },
    {
      title: "Team Analytics",
      description:
        "Access comprehensive team performance metrics, including attendance, productivity, and resource utilization statistics.",
    },
    {
      title: "Communication Tools",
      description:
        "Manage team announcements, notifications, and communication preferences. Set up automated alerts for important schedule changes.",
    },
  ],
  sections: [
    {
      title: "Team Setup Process",
      content: (
        <>
          <p>To set up a new team:</p>
          <ol>
            <li>Define team structure and hierarchy</li>
            <li>Configure team settings and policies</li>
            <li>Add team members and assign roles</li>
            <li>Set up shift templates and schedules</li>
            <li>Configure leave policies and entitlements</li>
          </ol>
        </>
      ),
    },
    {
      title: "Team Management Best Practices",
      content: (
        <>
          <ul>
            <li>Maintain clear role definitions and responsibilities</li>
            <li>Regularly review team composition and performance</li>
            <li>Ensure fair distribution of shifts and workload</li>
            <li>Keep team settings and policies up to date</li>
            <li>Monitor team metrics and make adjustments as needed</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-management" />,
  roles: <RoleBasedHelp context="team-management" />,
};
