import { Outlet } from "react-router";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

export default function ProtectedLayout() {
  return (
    // This wrapper automatically handles loading states and redirects
    // to /auth if the user is not logged in.
    <SessionAuth
    // FORCE the redirect if the config fails
      onSessionExpired={() => {
        window.location.href = "/auth";
      }}>
        <h1>
      SHARED IS LAYOUT HEADER
        </h1>
      <Outlet />
      <footer>SHARED IS LAYOUT FOOTER</footer>
    </SessionAuth>
  );
}