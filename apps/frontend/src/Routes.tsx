import { FC, lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { RequiresSession } from "./components/molecules/RequiresSession";
import { RequiresSelfSettings } from "./components/personal/RequiresSelfSettings";
import { AppLayout } from "./AppLayout";
import { EntityNavigationContextProvider } from "./contexts/EntityNavigationContext";

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
        <Route path="/companies/:company/units/new" element={<LazyNewUnit />} />
        <Route
          path="/companies/:company/units/:unit/teams/new"
          element={<LazyNewTeam />}
        />
        <Route path="/companies/:company/units/:unit" element={<LazyUnit />} />
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
  );
};
