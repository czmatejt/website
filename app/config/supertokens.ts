import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import Cookies  from "js-cookie";
import { API_URL, WEBSITE_URL } from "./domains";

export const initSuperTokens = () => {
  // Prevent this from running on the server (SSR)
  if (typeof window === "undefined") return;

  SuperTokens.init({
    appInfo: {
      appName: "AK Kurim Website",
      apiDomain: API_URL,
      websiteDomain: WEBSITE_URL,
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init(),
      Session.init(),
    ],
    getRedirectionURL: async (context: any) => {
        if (context.action === "SUCCESS") {
            const lastSelectedModule = Cookies.get("lastModule");
            if (lastSelectedModule) return `${lastSelectedModule}`;

            return "/is/";
        }
        return undefined;
    },
  });
};