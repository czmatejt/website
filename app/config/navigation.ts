import { 
  Users, 
  Trophy, 
  ShieldCheck, 
  LayoutGrid,
  type LucideIcon 
} from "lucide-react";

export type AppModule = {
  id: string;      // specific ID for logic (e.g. "trainer")
  label: string;   // Display name
  path: string;    // Router path
  icon: LucideIcon;
  description?: string; // For the Portal cards
};

export const APP_MODULES: AppModule[] = [
  { 
    id: "portal", 
    label: "Portal", 
    path: "/is/portal", 
    icon: LayoutGrid,
    description: "Club news and quick overview."
  },
  { 
    id: "trainer", 
    label: "Trainer", 
    path: "/is/trainer/dashboard", 
    icon: Users,
    description: "Manage overview and plans."
  },
  { 
    id: "athlete", 
    label: "Athlete", 
    path: "/is/athlete/schedule", 
    icon: Trophy,
    description: "View training schedule."
  },
  { 
    id: "guardian", 
    label: "Guardian", 
    path: "/is/guardian/dashboard", 
    icon: ShieldCheck,
    description: "Manage payments and children."
  },
  {
    id: "admin",
    label: "Admin",
    path: "/is/admin/overview",
    icon: ShieldCheck,
    description: "Platform settings and users."
  },
];