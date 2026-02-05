import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList 
} from "lucide-react";
import { MODULE_NAVIGATIONS } from "~/config/module-navigations";

export function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  // Define menus for each module
  const MENUS = MODULE_NAVIGATIONS;

  // Determine which menu to show based on URL
  let currentSection = "portal";
  if (pathname.includes("/is/trainer")) currentSection = "trainer";
  if (pathname.includes("/is/athlete")) currentSection = "athlete";
  if (pathname.includes("/is/guardian")) currentSection = "guardian";
  if (pathname.includes("/is/admin")) currentSection = "admin";
  if (pathname.includes("/is/account")) currentSection = "account";

  const items = MENUS[currentSection] || MENUS.portal;

  return (
    <nav className="space-y-1 p-2">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive 
              ? "bg-primary text-primary-foreground" // Adapts to your theme color (usually black/white inverted)
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}