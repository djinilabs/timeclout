import { useLocation, useSearchParams } from "react-router-dom";

export const ContextualHelp = () => {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const tab = params.get("tab");

  // First check if we're on a path with tabs
  if (
    pathname.includes("/companies/") &&
    pathname.includes("/settings/") &&
    tab
  ) {
    switch (tab) {
      case "general":
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">General Settings</h3>
            <p>Configure basic company information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Update company name and details</li>
              <li>Set company timezone</li>
              <li>Customize branding</li>
            </ul>
          </div>
        );

      case "leave-types":
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Leave Types</h3>
            <p>Manage leave types for your company:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create custom leave types</li>
              <li>Set accrual rules</li>
              <li>Configure approval workflows</li>
            </ul>
          </div>
        );

      case "members":
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Company Members</h3>
            <p>Manage company membership:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>View all company members</li>
              <li>Manage member roles and permissions</li>
              <li>Send invitations to new members</li>
            </ul>
          </div>
        );
    }
  }

  // Fall back to path-based help content if no tab or unrecognized tab
  switch (pathname) {
    case "/":
    case "/companies":
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Companies Overview</h3>
          <p>This page shows all companies you have access to.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>View companies you manage or are a member of</li>
            <li>Create a new company using the "New Company" button</li>
            <li>Click on any company to view its details</li>
          </ul>
        </div>
      );

    case "/companies/new":
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Create New Company</h3>
          <p>Set up a new company in the system:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Enter the company name and details</li>
            <li>Configure initial company settings</li>
            <li>You'll automatically become the company admin</li>
          </ul>
        </div>
      );

    case "/me/edit":
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Edit Profile</h3>
          <p>Update your personal information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Modify your profile details</li>
            <li>Update notification preferences</li>
            <li>Change account settings</li>
          </ul>
        </div>
      );

    case "/leave-requests/pending":
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Pending Leave Requests</h3>
          <p>Manage leave requests that need your attention:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Review pending leave requests</li>
            <li>Approve or reject requests</li>
            <li>Add comments to your decision</li>
          </ul>
        </div>
      );

    default:
      // Handle dynamic routes
      if (
        pathname.includes("/companies/") &&
        pathname.includes("/units/") &&
        pathname.includes("/teams/")
      ) {
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Team Management</h3>
            <p>Manage your team:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>View team members and their roles</li>
              <li>Manage leave requests</li>
              <li>Send team invites</li>
              <li>Update team settings</li>
            </ul>
          </div>
        );
      }

      if (pathname.includes("/companies/") && pathname.includes("/units/")) {
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Unit Management</h3>
            <p>Manage your business unit:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>View all teams in this unit</li>
              <li>Create new teams</li>
              <li>Manage unit settings</li>
            </ul>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Help Center</h3>
          <p>
            Welcome to the help center! Select a section to view specific
            guidance.
          </p>
          <p>If you need additional assistance, please contact support.</p>
        </div>
      );
  }
};
