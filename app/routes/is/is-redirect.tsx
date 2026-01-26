import { Navigate } from "react-router";
import { SessionAuth } from "supertokens-auth-react/recipe/session";


export default function IsIndex() {
  // "replace" prevents the user from clicking Back and getting stuck in a loop
  return (
    <SessionAuth>
      <Navigate to="/is/portal" replace />
    </SessionAuth>
  );
}