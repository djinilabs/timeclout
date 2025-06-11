import { FC, lazy } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { RequiresSelfSettings } from "./components/personal/RequiresSelfSettings";
import { AppLayout } from "./AppLayout";
import { EntityNavigationContextProvider } from "./contexts/EntityNavigationContext";
import { ConfirmDialogProvider } from "./providers/ConfirmDialogProvider";
import { CheckLatestAppVersion } from "./components/molecules/CheckLatestAppVersion";
import { Suspense } from "./components/atoms/Suspense";

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
const LazyCreateLeaveType = lazy(() => import("./routes/CreateLeaveType"));

export const AppRoutes: FC = () => {
  return (
    <ConfirmDialogProvider>
      <Suspense fallback={null}>
        <CheckLatestAppVersion />
      </Suspense>
      <Routes>
        <Route
          element={
            <EntityNavigationContextProvider>
              <AppLayout>
                <Suspense>
                  <Outlet />
                </Suspense>
              </AppLayout>
            </EntityNavigationContextProvider>
          }
        >
          <Route
            path="/"
            element={
              <RequiresSelfSettings>
                <LazyCompanies />
              </RequiresSelfSettings>
            }
          />

          <Route
            path="/companies"
            element={
              <RequiresSelfSettings>
                <LazyCompanies />
              </RequiresSelfSettings>
            }
          />
          <Route path="/me/edit" element={<LazyPageMeEdit />} />
          <Route
            path="/leave-requests/pending"
            element={<LazyPagePendingLeaveRequests />}
          />
          <Route path="/invites/accept" element={<LazyInviteAccept />} />
          <Route path="/companies/new" element={<LazyNewCompany />} />
          <Route path="/companies/:company" element={<LazyCompany />} />
          <Route
            path="/companies/:company/units/:unit/teams/:team/leave-requests/new"
            element={<LazyNewTeamMemberLeaveRequest />}
          />
          <Route
            path="/companies/:company/users/:user/leave-requests/:startDate/:endDate/:leaveType"
            element={<LazyLeaveRequest />}
          />
          <Route
            path="/companies/:company/settings/:settingName/:settingId"
            element={<LazyCompanySettings />}
          />
          <Route
            path="/companies/:company/settings/leaveTypes/new"
            element={<LazyCreateLeaveType />}
          />
          <Route
            path="/companies/:company/units/new"
            element={<LazyNewUnit />}
          />
          <Route
            path="/companies/:company/units/:unit/teams/new"
            element={<LazyNewTeam />}
          />
          <Route
            path="/companies/:company/units/:unit"
            element={<LazyUnit />}
          />
          <Route
            path="/companies/:company/units/:unit/teams/:team"
            element={<LazyTeam />}
          />
          <Route
            path="/companies/:company/units/:unit/teams/:team/invites/new"
            element={<LazyNewTeamInvite />}
          />
          <Route
            path="/companies/:company/units/:unit/teams/:team/members/new"
            element={<LazyNewTeamMember />}
          />
          <Route
            path="/companies/:company/units/:unit/teams/:team/users/:member"
            element={<LazyEditTeamMember />}
          />
          <Route path="*" element={<LazyPageNotFound />} />
        </Route>
      </Routes>
    </ConfirmDialogProvider>
  );
};
