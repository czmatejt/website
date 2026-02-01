import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

export default function AuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingSession, setCheckingSession] = useState(true);
  
    useEffect(() => {
      async function checkSession() {
        const hasSession = await doesSessionExist();
        if (hasSession) {
          navigate("/is/portal", { replace: true });
        } else {
          navigate({pathname: "/auth/login", search: location.search}, { replace: true });
        }
      }
      checkSession();
    }, [navigate, location.search]);
  
    if (checkingSession) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
}