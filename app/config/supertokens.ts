import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import Cookies  from "js-cookie";
import { API_URL, WEBSITE_URL } from "./domains";
import logo from "~/assets/images/akkurim-logo.webp";

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
      EmailPassword.init({
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              // We intercept the "Sign Up" call
              signUp: async function (input) {
                
                // input.formFields contains the user's Email and Password
                // We add our hidden Tenant ID to this list
                const modifiedFormFields = [
                  ...input.formFields,
                  { id: "tenant", value: "kurim" }
                ];

                // Call the original logic with the new data
                return originalImplementation.signUp({
                  ...input,
                  formFields: modifiedFormFields,
                });
              },
            };
          },
        },
        resetPasswordUsingTokenFeature: {
          disableDefaultUI: true,
        },
      }),
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