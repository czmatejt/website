import { Outlet } from "react-router";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

import { useEffect, useState } from "react";
import { Activity, List, Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { ModuleSwitcher } from "~/components/shared/ModuleSwitcher";
import { UserNav } from "~/components/shared/UserNav"; // Your existing User Pill
import { AppSidebar } from "~/components/shared/AppSidebar";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { ModeToggle } from "~/components/shared/mode-toggle";



export default function ISLayout() {
  const session = useSessionContext();
  // remove role- prefix from roles
  if (session.loading) {
    return <div>Loading...</div>;
  }
  const userRoles = session.accessTokenPayload["st-role"]["v"].map((r: string) => r.replace("role-", ""));

  return (
    <SessionAuth>
    <div className="flex h-screen w-full flex-col bg-muted/40">
      
      {/* SINGLE HEADER ROW */}
      <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 shadow-sm md:h-16 md:px-6">
        
        {/* 1. LEFT: Hamburger (Mobile) / Logo (Desktop) */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 pt-10">
                <AppSidebar />
              </SheetContent>
            </Sheet>
          </div>

          {/* --- LOGO LOGIC --- */}
          
          {/* A. Mobile Logo (Icon Only) */}
          <div className="flex items-center justify-center md:hidden text-blue-600">
             <Activity className="h-6 w-6" /> {/* Replace with your specific SVG/Icon */}
          </div>

          {/* Desktop Logo (Hidden on Mobile) */}
          <div className="hidden font-bold text-xl tracking-tight text-blue-600 md:block mr-6">
            IS AK KURIM
          </div>
        </div>

        {/* 2. CENTER: Module Switcher */}
        <div className="flex flex-1 items-center justify-center md:justify-start md:ml-6">
          <ModuleSwitcher userRoles={userRoles} />
        </div>

        {/* 3. RIGHT: User Nav */}
        <div className="flex items-center gap-2">
           <UserNav />
        </div>

      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-64 flex-col border-r bg-background py-4 md:flex">
          <AppSidebar />
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
    </SessionAuth>
  );
}