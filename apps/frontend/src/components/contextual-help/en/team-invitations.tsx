import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const teamInvitationsHelp: HelpSection = {
  title: "Team Invitations",
  description: (
    <>
      Manage team member invitations. Send invitations to new members, track
      pending invitations, and manage team access.
    </>
  ),
  features: [
    {
      title: "Send Invitations",
      description: "Invite new members to join your team",
    },
    {
      title: "Invitation Management",
      description: "Track and manage pending invitations",
    },
    {
      title: "Access Control",
      description: "Configure member roles and permissions",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-invitations" />,
  roles: <RoleBasedHelp context="team-invitations" />,
};
