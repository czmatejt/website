import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";
import { LoginForm } from "~/modules/auth/components/login-form";
import { ModeToggle } from "~/components/shared/mode-toggle"; // Import your toggle
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const hasSession = await doesSessionExist();
      if (hasSession) {
        navigate("/is/portal", { replace: true });
      } else {
        setCheckingSession(false);
      }
    }
    checkSession();
  }, [navigate]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      
      {/* 1. Theme Toggle (Top Right) */}
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ModeToggle />
      </div>

      {/* 2. Main Content Card */}
      <div className="w-full max-w-sm space-y-6">
        
        {/* Branding / Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          {/* <img src="/logo.webp" className="h-10 w-10" /> */}
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            TrackMeet
          </div>
        </div>

        {/* The Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center text-sm text-muted-foreground">
          <a 
            href="/auth/reset-password" 
            className="underline underline-offset-4 hover:text-primary"
          >
            Forgot your password?
          </a>
        </div>
        
      </div>
    </div>
  );
}