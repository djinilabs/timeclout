import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";
import { HelpSection } from "../types";

export const defaultHelp: HelpSection = {
  title: "Help Center",
  description: (
    <>
      Welcome to the help center. Select a section to learn more about its
      features and functionality.
    </>
  ),
  features: [
    {
      title: "Navigation",
      description:
        "Use the navigation menu to access different sections of the application.",
    },
    {
      title: "Contextual Help",
      description:
        "Each section provides specific guidance and information relevant to your current task.",
    },
  ],
  dependencies: <FeatureDependenciesHelp />,
  roles: <RoleBasedHelp />,
};

export default defaultHelp;
