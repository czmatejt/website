import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { ShieldAlert, Ban } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const session = useSessionContext();
  const location = useLocation();

  if (session.loading) {
    // You can replace this with a nice full-page skeleton loader later
    return <div className="flex h-full items-center justify-center p-8">Loading session...</div>;
  }

  // 1. Parse Roles (Centralized Logic)
  // We use optional chaining to be safe if the claim is missing
  const rawRoles = session.accessTokenPayload["st-role"]?.["v"] || [];
  
  // Clean the roles (remove "role-" prefix)
  const userRoles = Array.isArray(rawRoles) 
    ? rawRoles.map((r: string) => r.replace("role-", "")) 
    : [];

  // 2. Check Permission
  const hasPermission = userRoles.some((role: string) => allowedRoles.includes(role));

  if (!hasPermission) {
    // OPTION A: Automatic Redirect (Aggressive)
    // return <Navigate to="/is/portal" replace />;

    // OPTION B: Nice "Unauthorized" UI (User-Friendly)
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 shadow-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Ban className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-700">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view the <strong>{allowedRoles.join(" or ")}</strong> module.
            </CardDescription>
          </CardHeader>
          {/* <CardContent className="text-center text-sm text-muted-foreground">
             Your current role is: <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{userRoles.join(", ") || "None"}</span>
          </CardContent> */}
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => window.location.href = "/is/portal"}>
              Return to Portal
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 3. Render the Page
  return <>{children}</>;
}