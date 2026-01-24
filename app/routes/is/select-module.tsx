import { useNavigate } from "react-router"; // Note: v7 imports from "react-router"
import { 
  Users, 
  Trophy, 
  ShieldCheck, 
  Settings, 
  ChevronDown 
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";
import { UserNav } from "../../components/UserNav"; // Adjust path as needed

// 1. CONFIG: Define your available modules here
const MODULES = [
  {
    id: "trainer",
    title: "Trainer Area",
    description: "Manage rosters, plan workouts, and view attendance.",
    icon: Users,
    href: "/is/trainer/dashboard",
    color: "text-blue-500", // Tailwind color class
  },
  {
    id: "athlete",
    title: "Athlete Zone",
    description: "View your training schedule and log performance.",
    icon: Trophy,
    href: "/is/athlete/schedule",
    color: "text-amber-500",
  },
  {
    id: "guardian",
    title: "Guardian Portal",
    description: "Manage payments and view child's progress.",
    icon: ShieldCheck,
    href: "/is/guardian/dashboard",
    color: "text-green-500",
  },
  {
    id: "admin",
    title: "Admin Console",
    description: "Oversee platform settings and user management.",
    icon: Settings,
    href: "/is/admin/overview",
    color: "text-red-500",
  }
];

export default function SelectModule() {
  const session = useSessionContext();
  const navigate = useNavigate();

  // 2. LOGIC: Handle navigation and cookie setting
  const handleModuleClick = (href: string) => {
    // Set the "sticky" cookie for 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    document.cookie = `last_module=${href}; path=/; expires=${expiryDate.toUTCString()}`;

    // Navigate to the module
    navigate(href);
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/auth";
  };

  if (session.loading) {
    return <div>Loading...</div>;
  }

  const user_roles = session.accessTokenPayload["st-role"]["v"].map((role: string) => role.replace("role-", "")) || [];
  const VISIBLE_MODULES = MODULES.filter(module => user_roles.includes(module.id));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Container to center content on large screens */}
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Welcome back
            </h1>
            <p className="text-slate-500">
              Select a module to continue.
            </p>
          </div>
          
          <UserNav />
        </div>

        {/* GRID SECTION */}
        {/* Mobile: grid-cols-1 (stack) | PC: grid-cols-2 (side-by-side) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VISIBLE_MODULES.map((module) => (
            <Card 
              key={module.id}
              onClick={() => handleModuleClick(module.href)}
              className="cursor-pointer transition-all hover:border-slate-400 hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                {/* Icon Circle */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 ${module.color}`}>
                  <module.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {module.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-base">
                  {module.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
          
          {/* Example of a "Settings" card that always stays there */}
          {/* <Card 
             className="flex flex-col items-center justify-center border-dashed bg-slate-50/50 text-slate-400 hover:border-slate-400 hover:text-slate-600 cursor-pointer"
             onClick={() => alert("Open generic user settings modal")}
          >
             <CardContent className="flex flex-col items-center gap-2 pt-6">
                <Settings className="h-8 w-8" />
                <span className="font-medium">Account Settings</span>
             </CardContent>
          </Card> */}

        </div>
      </div>
    </div>
  );
}