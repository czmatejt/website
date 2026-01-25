import { type RouteConfig, index, layout, route, prefix } from "@react-router/dev/routes";

export default [
  // 1. PUBLIC LANDING PAGE (mydomain.cz)
  //index("routes/home.tsx"), // Your public marketing page

  // temporarily redirecting home to external site
  route("", "routes/home-redirect.tsx"),

  // 2. AUTH (mydomain.cz/auth)
  route("auth/*", "routes/auth.tsx"),

  // 3. THE "IS" PRIVATE APP (mydomain.cz/is/...)
  // We use "prefix" to put everything inside /is/ without creating a folder named "is"
  ...prefix("is", [
     layout("routes/is/is-layout.tsx", [

      // can I redirect /is to /is/portal?
        
        index("routes/is/is-redirect.tsx"),
        
        route("portal", "routes/is/portal.tsx"),

        // This becomes /is/profile
        route("account", "routes/is/account.tsx"),
        
        // This becomes /is/trainer/roster
        //route("trainer/roster", "routes/trainer/roster.tsx"),
     ]),
  ]),

] satisfies RouteConfig;