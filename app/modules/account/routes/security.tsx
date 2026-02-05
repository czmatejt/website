import { useState } from "react";
import { ShieldAlert, LogOut, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";

export default function SecurityPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const oldPassword = formData.get("old_password") as string;
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.", { duration: 4000 , style: { background: "red", color: "white" } });
      setIsLoading(false);
      return;
    }

    try {
      // We will create this endpoint in the next step
      // sent the json data in snake_case format
      await apiClient.post("/user/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword
      });

      toast.success("Password updated successfully.", { duration: 4000, style: { background: "green", color: "white" } });
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      // If the API returns a neat error (like "Wrong old password"), show it
      toast.error(error?.message || "Failed to update password.", { duration: 4000, style: { background: "red", color: "white" } });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRevokeSessions() {
    if (!confirm("Are you sure? You will be logged out of this device too.")) return;
    
    try {
      await apiClient.post("/user/revoke-all-sessions");
      toast.success("All sessions revoked. Signing out...", { duration: 4000, style: { background: "yellow", color: "black" } });
      await signOut(); // Clear frontend cookies
      window.location.href = "/auth";
    } catch (error: any) {
      toast.error(error?.message || "Failed to revoke sessions.", { duration: 4000, style: { background: "red", color: "white" } });
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
            
            {/* Notifications shown via sonner toasts */}

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