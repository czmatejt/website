import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList 
} from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  // Define menus for each module // TODO Fetch from config/navigation.ts
  const MENUS: Record<string, any[]> = {
    trainer: [
      { title: "Dashboard", href: "/is/trainer/dashboard", icon: LayoutDashboard },
      { title: "Roster", href: "/is/trainer/roster", icon: Users },
      { title: "Attendance", href: "/is/trainer/attendance", icon: ClipboardList },
    ],
    athlete: [
      { title: "Schedule", href: "/is/athlete/schedule", icon: Calendar },
      { title: "My Stats", href: "/is/athlete/stats", icon: LayoutDashboard },
    ],
    // Default fallback (e.g. for the Portal)
    portal: [
      { title: "Home", href: "/is", icon: LayoutDashboard }
    ]
  };

  // Determine which menu to show based on URL
  let currentSection = "portal";
  if (pathname.includes("/is/trainer")) currentSection = "trainer";
  if (pathname.includes("/is/athlete")) currentSection = "athlete";

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