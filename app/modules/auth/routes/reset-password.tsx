import { Link, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ResetPasswordForm } from "~/modules/auth/components/reset-password-form";
import { ModeToggle } from "~/components/shared/mode-toggle";
import { LanguageToggle } from "~/components/shared/language-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "~/components/ui/card";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const hasToken = searchParams.has("token");

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      
      {/* Top Controls */}
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8">
        <LanguageToggle />
        <ModeToggle />
      </div>

      <div className="w-full max-w-sm space-y-6">
        
        {/* Branding */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            TrackMeet
          </div>
        </div>

        {/* Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            {/* Dynamic Title based on state */}
            <CardTitle className="text-2xl">
                {hasToken ? t("auth.enter_new_password_title") : t("auth.reset_password_title")}
            </CardTitle>
            <CardDescription>
                {hasToken ? t("auth.enter_new_password_subtitle") : t("auth.reset_password_subtitle")}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <ResetPasswordForm />
          </CardContent>

          <CardFooter className="flex justify-center border-t p-4">
             <Link 
              to="/auth/login" 
              className="text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              {t("auth.back_to_login")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}