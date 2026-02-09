import { Outlet } from "react-router";
import { RoleGuard } from "~/modules/auth/components/role-guard"; // Import your new component

export default function TrainerLayout() {
  return (
    <RoleGuard allowedRoles={["trainer"]}>
       <Outlet />
    </RoleGuard>
  );
}