import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router"; // Import Link
import { useTranslation } from "react-i18next"; // Import Translation Hook
import { doesSessionExist } from "supertokens-auth-react/recipe/session";
import { LoginForm } from "~/modules/auth/components/login-form";
import { ModeToggle } from "~/modules/shared/components/mode-toggle";
import { LanguageToggle } from "~/modules/shared/components/language-toggle"; // Don't forget this!
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter, // Import CardFooter
} from "~/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { t } = useTranslation(); // Use the hook
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
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      
      {/* Top Right Controls */}
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8">
        <LanguageToggle />
        <ModeToggle />
      </div>

      <div className="w-full max-w-sm space-y-6">
        
        {/* Branding */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            KLUBIS
          </div>
        </div>

        {/* The Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">{t("auth.welcome_back")}</CardTitle>
            <CardDescription>
              {t("auth.login_subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          
          {/* FORGOT PASSWORD (Inside Card) */}
          <CardFooter className="flex justify-center border-t p-4">
             <Link 
              to="/auth/reset-password" 
              className="text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              {t("auth.forgot_password")}
            </Link>
          </CardFooter>
        </Card>

        {/* SIGN UP LINK (Outside Card) */}
        <div className="text-center text-sm text-muted-foreground">
          <Link 
            to="/auth/signup" 
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("auth.dont_have_account")}
          </Link>
        </div>
        
      </div>
    </div>
  );
}