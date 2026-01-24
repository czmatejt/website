import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";


function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export const initSuperTokens = () => {
  // Prevent this from running on the server (SSR)
  if (typeof window === "undefined") return;

  SuperTokens.init({
    appInfo: {
      appName: "AK Kurim Website",
      apiDomain: "http://192.168.0.9:8000",
      websiteDomain: "http://192.168.0.9:3000",
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init(),
      Session.init(),
    ],
    getRedirectionURL: async (context: any) => {
        if (context.action === "SUCCESS") {
            const lastSelectedModule = getCookie("last_module");
            if (lastSelectedModule) return `${lastSelectedModule}`;

            return "/is/";
        }
        return undefined;
    },
  });
};