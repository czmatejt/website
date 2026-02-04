import { type RouteConfig, index, layout, route, prefix } from "@react-router/dev/routes";
import { rootCertificates } from "tls";

export default [
  // 1. PUBLIC LANDING PAGE (mydomain.cz)
  //index("routes/home.tsx"), // Your public marketing page

  // temporarily redirecting home to external site
  route("", "routes/home-redirect.tsx"),

  // 2. AUTH (mydomain.cz/auth)
  route("auth/", "modules/auth/routes/auth-redirect.tsx"),
  route("auth/login", "modules/auth/routes/login.tsx"),
  route("auth/signup", "modules/auth/routes/signup.tsx"),
  route("auth/reset-password", "modules/auth/routes/reset-password.tsx"),
  
  // 3. IN-SYSTEM (mydomain.cz/is/...)
  ...prefix("is", [
     layout("routes/is/is-layout.tsx", [

      // can I redirect /is to /is/portal?
        
        index("routes/is/is-redirect.tsx"),
        
        route("portal", "routes/is/portal.tsx"),

        ...prefix("account", [
          index("modules/account/routes/account-redirect.tsx"), // /is/account

          route("general", "modules/account/routes/general.tsx"), // /is/account
          route("security", "modules/account/routes/security.tsx"), // /is/account
        ]),

        ...prefix("trainer", [
          layout("modules/trainer/routes/trainer-layout.tsx", [
          index("modules/trainer/routes/trainer-redirect.tsx"), // /is/trainer
          
          route("dashboard", "modules/trainer/routes/dashboard.tsx"), // /is/trainer
          route("attendance", "modules/trainer/routes/attendance/index.tsx"), // /is/trainer
          route("attendance/:id", "modules/trainer/routes/attendance/$id.tsx"), // /is/trainer
        ])]),
    
        
     ]),
  ]),

] satisfies RouteConfig;