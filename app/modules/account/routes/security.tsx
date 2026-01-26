import { useState } from "react";
import { 
  ShieldAlert, 
  LogOut, 
  Loader2, 
  CheckCircle2,
  AlertCircle 
} from "lucide-react";
import { apiClient } from "~/lib/api-client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";

export default function SecurityPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const oldPassword = formData.get("old_password") as string;
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      setIsLoading(false);
      return;
    }

    try {
      // We will create this endpoint in the next step
      // sent the json data in snake_case format
      await apiClient("/user/change-password", {
        method: "POST",
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword, confirm_new_password: confirmPassword }),
      });

      setStatus({ type: "success", message: "Password updated successfully." });
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      // If the API returns a neat error (like "Wrong old password"), show it
      setStatus({ type: "error", message: error.message || "Failed to update password." });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRevokeSessions() {
    if (!confirm("Are you sure? You will be logged out of this device too.")) return;
    
    try {
      await apiClient("/user/revoke-all-sessions", { method: "POST" });
      await signOut(); // Clear frontend cookies
      window.location.href = "/auth";
    } catch (error) {
      alert("Failed to revoke sessions.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your password and account security.
        </p>
      </div>
      <Separator />

      {/* --- PASSWORD CHANGE CARD --- */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Ensure your account is using a long, random password to stay secure.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
            
            {status && (
              <Alert variant={status.type === "error" ? "destructive" : "default"} className={status.type === "success" ? "border-green-500 text-green-600" : ""}>
                 {status.type === "error" ? <AlertCircle className="h-4 w-4"/> : <CheckCircle2 className="h-4 w-4"/>}
                 <AlertTitle>{status.type === "error" ? "Error" : "Success"}</AlertTitle>
                 <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" name="old_password" type="password" required />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" name="new_password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" name="confirm_password" type="password" required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-0 my-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* --- DANGER ZONE (Sessions) --- */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
             <ShieldAlert className="h-5 w-5"/> Session Management
          </CardTitle>
          <CardDescription>
            If you suspect your account was compromised, you can log out of all devices immediately.
          </CardDescription>
        </CardHeader>
        <CardFooter className="bg-red-50/50 px-6 py-4 flex justify-between items-center">
            <span className="text-sm text-red-800 font-medium">
                Log out of all devices?
            </span>
            <Button className="hover:text-red-900" variant="destructive" size="sm" onClick={handleRevokeSessions}>
               <LogOut className="mr-2 h-4 w-4" />
               Revoke All Sessions
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}