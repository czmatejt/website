import { useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { sendPasswordResetEmail, submitNewPassword } from "supertokens-auth-react/recipe/emailpassword";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, MailCheck, CheckCircle2 } from "lucide-react";
import { PasswordInput } from "./password-input";

export function ResetPasswordForm() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  
  // Logic: If URL has ?token=..., we are in "Step 2" (Change Password)
  const token = searchParams.get("token");

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "link_sent" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  // --- HANDLER 1: SEND EMAIL ---
  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendPasswordResetEmail({
        formFields: [{ id: "email", value: email }],
      });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach(f => {
            if (f.id === "email") setError(f.error);
        });
      } else {
        // Even if email doesn't exist, we usually show success for security 
        // (unless you configured backend otherwise)
        setStatus("link_sent");
      }
    } catch (err) {
      setError(t("auth.generic_error"));
    } finally {
      setIsLoading(false);
    }
  }

  // --- HANDLER 2: SUBMIT NEW PASSWORD ---
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // The SDK automatically grabs the token from the URL window location
      const response = await submitNewPassword({
        formFields: [{ id: "password", value: password }],
      });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach(f => {
             if (f.id === "password") setError(f.error);
        });
      } else if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
        setError("The password reset link has expired. Please try again.");
      } else {
        setStatus("success");
        setTimeout(() => {
            window.location.href = "/auth/login";
        }, 2000);
      }
    } catch (err) {
      setError(t("auth.generic_error"));
    } finally {
      setIsLoading(false);
    }
  }

  // --- RENDER 1: SUCCESS STATE (LINK SENT) ---
  if (status === "link_sent") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center py-4">
        <div className="rounded-full bg-green-100 p-3 text-green-600">
          <MailCheck className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{t("auth.link_sent_title")}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t("auth.link_sent_desc")} <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
      </div>
    );
  }

  // --- RENDER 2: CHANGE PASSWORD FORM (Has Token) ---
  if (token) {
     if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-4">
                <div className="rounded-full bg-green-100 p-3 text-green-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">{t("auth.password_reset_success")}</h3>
            </div>
        );
     }

     return (
        <form onSubmit={handleChangePassword} className="grid gap-4">
             {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
             <div className="grid gap-2">
                <Label htmlFor="password">{t("auth.enter_new_password_title")}</Label>
                <PasswordInput 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    minLength={8}
                />
             </div>
             <Button disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("auth.change_password_btn")}
             </Button>
        </form>
     );
  }

  // --- RENDER 3: INITIAL SEND FORM (No Token) ---
  return (
    <form onSubmit={handleSendLink} className="grid gap-4">
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      
      <div className="grid gap-2">
        <Label htmlFor="email">{t("auth.email_label")}</Label>
        <Input 
            id="email" 
            type="email" 
            placeholder="coach@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
        />
      </div>

      <Button disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("auth.send_reset_link_btn")}
      </Button>
    </form>
  );
}