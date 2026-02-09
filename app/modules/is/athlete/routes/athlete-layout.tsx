import { Outlet } from "react-router";
import { RoleGuard } from "~/modules/auth/components/role-guard";

export default function AthleteLayout() {
  return (
    <RoleGuard allowedRoles={["athlete"]}>
       <Outlet />
    </RoleGuard>
  );
}