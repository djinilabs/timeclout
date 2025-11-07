import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";
import { HelpSection } from "../types";

export const teamInvitationsHelp: HelpSection = {
  title: "Team Invitations",
  description: (
    <>
      <strong>Invite new members</strong> to join your team and manage pending
      invitations. Control who has access to your team&apos;s schedules and
      data.
    </>
  ),
  features: [
    {
      title: "Send Invitations",
      description:
        "Click 'Invite Member' to send email invitations with team access",
    },
    {
      title: "Track Status",
      description:
        "Monitor pending, accepted, and expired invitations in real-time",
    },
    {
      title: "Manage Access",
      description: "Set member roles and permissions during invitation process",
    },
  ],
  sections: [
    {
      title: "How to Invite Someone",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            1. Click the <strong>&quot;Invite Member&quot;</strong> button
          </p>
          <p className="text-xs text-gray-600">
            2. Enter their <strong>email address</strong> and select their{" "}
            <strong>role</strong>
          </p>
          <p className="text-xs text-gray-600">
            3. Choose <strong>permissions</strong> (view, edit, manage)
          </p>
          <p className="text-xs text-gray-600">
            4. Send invitation - they&apos;ll receive an email with setup
            instructions
          </p>
        </div>
      ),
    },
    {
      title: "Invitation Status",
      content: (
        <div className="space-y-2">
          <div className="flex items-center text-xs">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
            <span className="text-gray-600">
              <strong>Pending:</strong> Invitation sent, waiting for response
            </span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-gray-600">
              <strong>Accepted:</strong> Member joined the team
            </span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
            <span className="text-gray-600">
              <strong>Expired:</strong> Invitation expired (7 days)
            </span>
          </div>
        </div>
      ),
    },
  ],
  screenshots: [
    {
      caption: "Pending invitations list with status indicators",
      alt: "Invitations management view",
      src: "/images/help/team-invitations-list.png",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-invitations" />,
  roles: <RoleBasedHelp context="team-invitations" />,
};
