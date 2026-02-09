// import { useSessionContext } from "supertokens-auth-react/recipe/session";

// export default function Profile() {
//   // This hook gives you direct access to the session payload
//   const session = useSessionContext();

//   if (session.loading) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>User ID: {session.userId}</h1>
//       <p>Access Token Payload: {JSON.stringify(session.accessTokenPayload)}</p>
//     </div>
//   );
// }

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
import { useEffect, useState } from "react";
import { useUser } from "~/modules/shared/hooks/use-user";
import { useTranslation } from "react-i18next";


export default function General() {
  const { t } = useTranslation();
  const { user, isLoading } = useUser();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("account.profile")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("account.profile_description")}
        </p>
      </div>
      <Separator />
      
      {/* The Form */}
      <Card>
        {/* <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your public profile details.
          </CardDescription>
        </CardHeader> */}
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("account.first_name")}</Label>
              <Input id="firstName" placeholder={t("account.enter", { field: t("account.first_name") })} disabled defaultValue={user?.first_name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("account.last_name")}</Label>
              <Input id="lastName" placeholder={t("account.enter", { field: t("account.last_name") })} disabled defaultValue={user?.last_name || ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("account.email")}</Label>
            <Input id="email" disabled defaultValue={user?.email || ""} />
            {/* <p className="text-[0.8rem] text-muted-foreground">
              Contact your administrator to change your email.
            </p> */}
          </div>

        </CardContent>
        <CardFooter className="border-t px-6 py-4 bg-muted/50" >
           <Button disabled>{t("buttons.save")}</Button>
           {/* disabled for now until backend is ready TODO*/}
        </CardFooter>
      </Card>
    </div>
  );
}