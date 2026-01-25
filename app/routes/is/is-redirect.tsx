import { Navigate } from "react-router";

export default function IsIndex() {
  // "replace" prevents the user from clicking Back and getting stuck in a loop
  return <Navigate to="/is/portal" replace />;
}