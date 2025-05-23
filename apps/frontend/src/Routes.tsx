import { FC, lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { RequiresSession } from "./components/molecules/RequiresSession";
import { RequiresSelfSettings } from "./components/RequiresSelfSettings";
import { AppLayout } from "./AppLayout";

const LazyCompanies = lazy(() => import("./routes/Companies"));
const LazyNewCompany = lazy(() => import("./routes/NewCompany"));
const LazyCompany = lazy(() => import("./routes/Company"));
const LazyNewUnit = lazy(() => import("./routes/NewUnit"));
const LazyUnit = lazy(() => import("./routes/Unit"));
const LazyNewTeam = lazy(() => import("./routes/NewTeam"));
const LazyTeam = lazy(() => import("./routes/Team"));
const LazyNewTeamInvite = lazy(() => import("./routes/NewTeamInvite"));
const LazyInviteAccept = lazy(() => import("./routes/InviteAccept"));
const LazyCompanySettings = lazy(() => import("./routes/CompanySettings"));
const LazyLeaveRequest = lazy(() => import("./routes/LeaveRequest"));
const LazyPageNotFound = lazy(() => import("./pages/PageNotFound"));
const LazyPageMeEdit = lazy(() => import("./pages/PageMeEdit"));
const LazyPagePendingLeaveRequests = lazy(
  () => import("./pages/PagePendingLeaveRequests")
);
const LazyNewTeamMember = lazy(() => import("./routes/NewTeamMember"));
const LazyEditTeamMember = lazy(() => import("./routes/EditTeamMember"));
const LazyNewTeamMemberLeaveRequest = lazy(
  () => import("./routes/NewTeamMemberLeaveRequest")
);

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route
        element={
          <AppLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </AppLayout>
        }
      >
        <Route
          path="/"
          element={
            <RequiresSession>
              <RequiresSelfSettings>
                <LazyCompanies />
              </RequiresSelfSettings>
            </RequiresSession>
          }
        />

        <Route
          path="/companies"
          element={
            <RequiresSession>
              <RequiresSelfSettings>
                <LazyCompanies />
              </RequiresSelfSettings>
            </RequiresSession>
          }
        />
        <Route
          path="/me/edit"
          element={
            <RequiresSession>
              <LazyPageMeEdit />
            </RequiresSession>
          }
        />
        <Route
          path="/leave-requests/pending"
          element={
            <RequiresSession>
              <LazyPagePendingLeaveRequests />
            </RequiresSession>
          }
        />
        <Route
          path="/invites/accept"
          element={
            <RequiresSession>
              <LazyInviteAccept />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/new"
          element={
            <RequiresSession>
              <LazyNewCompany />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company"
          element={
            <RequiresSession>
              <LazyCompany />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team/leave-requests/new"
          element={
            <RequiresSession>
              <LazyNewTeamMemberLeaveRequest />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/users/:user/leave-requests/:startDate/:endDate/:leaveType"
          element={
            <RequiresSession>
              <LazyLeaveRequest />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/settings/:settingName/:settingId"
          element={
            <RequiresSession>
              <LazyCompanySettings />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/new"
          element={
            <RequiresSession>
              <LazyNewUnit />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit"
          element={
            <RequiresSession>
              <LazyUnit />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/new"
          element={
            <RequiresSession>
              <LazyNewTeam />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team"
          element={
            <RequiresSession>
              <LazyTeam />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team/invites/new"
          element={
            <RequiresSession>
              <LazyNewTeamInvite />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team/members/new"
          element={
            <RequiresSession>
              <LazyNewTeamMember />
            </RequiresSession>
          }
        />
        <Route
          path="/companies/:company/units/:unit/teams/:team/users/:member"
          element={
            <RequiresSession>
              <LazyEditTeamMember />
            </RequiresSession>
          }
        />
        <Route path="*" element={<LazyPageNotFound />} />
      </Route>
    </Routes>
  );
};
