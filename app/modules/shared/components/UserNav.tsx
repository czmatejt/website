import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  LogOut, 
  User, 
  Settings, 
  Loader2, 
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useTheme } from "~/modules/shared/components/theme-provider";
import { Navigate, useNavigate } from "react-router";
import { useUser } from "~/modules/shared/hooks/use-user";

export function UserNav() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const session = useSessionContext();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useUser();

  const toggleLang = () => {
    const currentLang = i18n.language;
    const newLang = currentLang.startsWith("en") ? "cs" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/auth";
  };

  // Helper to get initials (e.g., "John Doe" -> "JD")
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-10 w-auto gap-2 rounded-full pl-4 pr-2 hover:bg-slate-100">
          {/* CHANGE 2: Display Name (Hidden on very small phones if needed, or always show) */}
          <span className="hidden text-sm font-medium md:inline-block">
            {userLoading ? t("shared.loading") : user?.full_name}
          </span>
          {/* CHANGE 3: The Avatar is now smaller and sits inside the button */}
          <Avatar className="h-7 w-7 border border-slate-200">
            <AvatarImage src="" alt={user?.full_name || "User"} />
            <AvatarFallback className="bg-slate-200 text-xs text-slate-700">
               {userLoading ? "..." : getInitials(user?.full_name || "U?")}
            </AvatarFallback>
          </Avatar>
          {/* Optional: Add a tiny chevron to indicate it's a menu */}
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userLoading ? t("shared.loading") : user?.full_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {/* Show the user ID or email from session payload if available */}
              {!session.loading && user?.email ? user.email : t("shared.no_email")}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/is/account/general")}>
            <User className="mr-2 h-4 w-4" />
            <span>{t("shared.account")}</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="md:hidden" />

        <DropdownMenuGroup>

          {/* --- THEME TOGGLE ITEM --- */}
          <DropdownMenuItem 
            className="cursor-pointer md:hidden"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme !== "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>{t("theme.toggle")}</span>
          </DropdownMenuItem>
          {/* Toggle language */}
          <DropdownMenuItem
            className="cursor-pointer md:hidden"
            onClick={() => {
              toggleLang();
            }}
          >
            <span className="mr-2 h-4 w-4 flex items-center justify-center">
              {i18n.language.startsWith("en") ? "🇨🇿" : "🇬🇧"}
            </span>
            <span>{t("language.toggle")}</span>
          </DropdownMenuItem>
          {/* ------------------------- */}

        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
            className="text-red-600 focus:text-red-600 cursor-pointer"
            onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("shared.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  );
}