import { useState } from "react";
import { useTranslation } from "react-i18next";
import { signUp } from "supertokens-auth-react/recipe/emailpassword";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "./password-input";

export function SignUpForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get Tenant ID from env (default to safe fallback)
  //const TENANT_ID = import.meta.env.VITE_TENANT_ID || "DEFAULT_CLUB";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Client-side Validation
    if (password !== confirmPassword) {
      setError(t("auth.passwords_no_match"));
      setIsLoading(false);
      return;
    }

    try {
      // 2. Call SuperTokens SDK
      const response = await signUp({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
          //{ id: "tenant_id", value: TENANT_ID } // <--- Hidden Field
        ],
      });

      if (response.status === "FIELD_ERROR") {
        // Handle API errors (e.g., email already exists)
        response.formFields.forEach((field) => {
          if (field.id === "email") setError(field.error);
        });
      } else if (response.status === "OK") {
        // 3. Success -> Redirect to Portal
        window.location.href = "/is/portal";
      }
    } catch (err: any) {
      setError(t("auth.generic_error"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">{t("auth.email_label")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="coach@example.com"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">{t("auth.password_label")}</Label>
            <PasswordInput
              id="password"
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">{t("auth.confirm_password_label")}</Label>
            <PasswordInput
              id="confirmPassword"
              type="password"
              required
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button disabled={isLoading} className="mt-2">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? t("auth.creating_account") : t("auth.sign_up_btn")}
          </Button>
        </div>
      </form>
    </div>
  );
}