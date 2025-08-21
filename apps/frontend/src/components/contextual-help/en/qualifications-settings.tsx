import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";
import { HelpSection } from "../types";

export const qualificationsSettingsHelp: HelpSection = {
  title: "Qualifications Management",
  description: (
    <>
      Manage team member qualifications and skill requirements. Create and
      configure qualifications that define the capabilities and expertise
      required for different roles. Use this interface to ensure proper skill
      matching and team coverage.
    </>
  ),
  features: [
    {
      title: "Qualification Creation",
      description:
        "Create new qualifications with custom names and colors. Define the skills and capabilities required for different team roles and positions.",
    },
    {
      title: "Qualification Assignment",
      description:
        "Assign qualifications to team members through an intuitive interface. Use the badge system to quickly add or remove qualifications from team members.",
    },
    {
      title: "Visual Organization",
      description:
        "Color-coded qualification badges make it easy to identify team member capabilities at a glance. Each qualification has its own distinct color for quick recognition.",
    },
    {
      title: "Qualification Management",
      description:
        "Easily add or remove qualifications using the dropdown menu. The interface shows available qualifications and prevents duplicate assignments.",
    },
  ],
  sections: [
    {
      title: "Setting Up Qualifications",
      content: (
        <>
          <p>To set up team qualifications:</p>
          <ol>
            <li>Navigate to the qualifications settings tab</li>
            <li>Create new qualifications with appropriate names and colors</li>
            <li>
              Assign qualifications to team members using the badge system
            </li>
            <li>Use the + button to add new qualifications to team members</li>
            <li>
              Remove qualifications by clicking the X on the qualification badge
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Best Practices",
      content: (
        <>
          <ul>
            <li>
              Create clear, specific qualification names that reflect actual
              skills
            </li>
            <li>Use distinct colors for different qualification types</li>
            <li>Regularly review and update team member qualifications</li>
            <li>
              Ensure qualifications align with shift position requirements
            </li>
            <li>Keep qualification list manageable and relevant</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="qualifications-settings" />,
  roles: <RoleBasedHelp context="qualifications-settings" />,
};
