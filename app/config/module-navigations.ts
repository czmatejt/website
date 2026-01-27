import { LayoutDashboard, Users, ClipboardList, Calendar, CreditCard, ShieldCheck } from "lucide-react";


export type ModuleNavigation = {
  title: string;
  href: string;
  icon: any; // Could be typed more strictly if needed
};

export const MODULE_NAVIGATIONS: Record<string, ModuleNavigation[]> = {
    trainer: [
        //{ title: "Dashboard", href: "/is/trainer/dashboard", icon: LayoutDashboard },
        { title: "Dashboard", href: "/is/trainer/dashboard", icon: Users },
        { title: "Attendance", href: "/is/trainer/attendance", icon: ClipboardList },
    ],
    athlete: [
        { title: "Schedule", href: "/is/athlete/schedule", icon: Calendar },
        { title: "My Stats", href: "/is/athlete/stats", icon: LayoutDashboard },
    ],
    guardian: [
        { title: "Dashboard", href: "/is/guardian/dashboard", icon: LayoutDashboard },
        { title: "Payments", href: "/is/guardian/payments", icon: CreditCard },
    ],
    admin: [
        { title: "Overview", href: "/is/admin/overview", icon: ShieldCheck },
        { title: "User Management", href: "/is/admin/users", icon: Users },
    ],
    portal: [
        { title: "Home", href: "/is/portal", icon: LayoutDashboard }
    ],
    account: [
        { title: "General", href: "/is/account/general", icon: Users },
        { title: "Security", href: "/is/account/security", icon: ShieldCheck }

    ]
};