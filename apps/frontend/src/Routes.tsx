import { FC } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { RequiresSession } from "./components/RequiresSession";
import { Companies } from "./routes/Companies";
import { NewCompany } from "./routes/NewCompany";
import { Company } from "./routes/Company";
import { NewUnit } from "./routes/NewUnit";
import { Unit } from "./routes/Unit";
import { NewTeam } from "./routes/NewTeam";
import { Team } from "./routes/Team";
import { NewTeamInvite } from "./routes/NewTeamInvite";
import { InviteAccept } from "./routes/InviteAccept";
import { CompanySettings } from "./routes/CompanySettings";
import { LeaveRequest } from "./routes/LeaveRequest";
import { RequiresSelfSettings } from "./components/RequiresSelfSettings";
import { PageNotFound } from "./pages/PageNotFound";
import { PageMeEdit } from "./pages/PageMeEdit";
import { PagePendingLeaveRequests } from "./pages/PagePendingLeaveRequests";
import { NewTeamMember } from "./routes/NewTeamMember";
import { EditTeamMember } from "./routes/EditTeamMember";
import { NewTeamMemberLeaveRequest } from "./routes/NewTeamMemberLeaveRequest";
import { AppLayout } from "./AppLayout";

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route
        element={
          <AppLayout>
            <Outlet />
          </AppLayout>
        }
      >
        <Route
          path="/"
          element={
            <RequiresSession>
              <RequiresSelfSettings>
                <Companies />
              </RequiresSelfSettings>
            </RequiresSession>
          }
        />

        <Route
          path="/companies"
          element={
            <RequiresSession>
              <RequiresSelfSettings>
                <Companies />
              </RequiresSelfSettings>
            </RequiresSession>
          }
        />
        <Route
          path="/me/edit"
          element={
            <RequiresSession>
              <PageMeEdit />
            </RequiresSession>
          }
        />
        <Route
          path="/leave-requests/pending"
          element={
            <RequiresSession>
              <PagePendingLeaveRequests />
            </RequiresSession>
          }
        />
        <Route
          path="/invites/accept"
          element={
            <RequiresSession>
              <InviteAccept />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/new"
          element={
            <RequiresSession>
              <NewCompany />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company"
          element={
            <RequiresSession>
              <Company />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team/leave-requests/new"
          element={
            <RequiresSession>
              <NewTeamMemberLeaveRequest />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/users/:user/leave-requests/:startDate/:endDate/:leaveType"
          element={
            <RequiresSession>
              <LeaveRequest />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/settings/:settingName/:settingId"
          element={
            <RequiresSession>
              <CompanySettings />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/new"
          element={
            <RequiresSession>
              <NewUnit />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit"
          element={
            <RequiresSession>
              <Unit />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/new"
          element={
            <RequiresSession>
              <NewTeam />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team"
          element={
            <RequiresSession>
              <Team />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team/invites/new"
          element={
            <RequiresSession>
              <NewTeamInvite />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team/members/new"
          element={
            <RequiresSession>
              <NewTeamMember />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team/users/:member"
          element={
            <RequiresSession>
              <EditTeamMember />
            </RequiresSession>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};
