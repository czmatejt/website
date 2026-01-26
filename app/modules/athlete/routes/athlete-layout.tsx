import { Outlet } from "react-router";
import { RoleGuard } from "~/components/auth/role-guard";

export default function AthleteLayout() {
  return (
    <RoleGuard allowedRoles={["athlete"]}>
       <Outlet />
    </RoleGuard>
  );
}