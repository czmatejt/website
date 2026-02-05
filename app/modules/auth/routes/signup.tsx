import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router"; // Import Link
import { useTranslation } from "react-i18next";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";
import { SignUpForm } from "~/modules/auth/components/signup-form";
import { ModeToggle } from "~/modules/shared/components/mode-toggle";
import { LanguageToggle } from "~/modules/shared/components/language-toggle"; // Don't forget this!
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const { t } = useTranslation();
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
      
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8">
        <LanguageToggle />
        <ModeToggle />
      </div>

      <div className="w-full max-w-sm space-y-6">
        
        {/* Branding */}
        <div className="flex flex-col items-center gap-2 text-center">
           {/* <img src="/logo.webp" className="h-10 w-10" /> */}
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            TrackMeet
          </div>
        </div>

        {/* Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">{t("auth.create_account")}</CardTitle>
            <CardDescription>
              {t("auth.signup_subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>

        {/* Footer Link */}
        <div className="text-center text-sm text-muted-foreground">
          <Link 
            to="/auth/login" 
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("auth.already_have_account")}
          </Link>
        </div>
        
      </div>
    </div>
  );
}