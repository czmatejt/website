import { useEffect, useState } from "react";
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
import { UserService } from "~/services/user"; 
import { useTheme } from "~/components/shared/theme-provider";

export function UserNav() {
  const session = useSessionContext();
  const { theme, setTheme } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch User Name on Mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await UserService.getProfile();
        setUserName(profile?.full_name || "User ?");
        setUserEmail(profile?.email || null);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        setUserName("User ?");
        setUserEmail(null);
      } finally {
        setLoading(false);
      }
    }

    if (!session.loading) {
      fetchProfile();
    }
  }, [session.loading]);

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
            {loading ? "Loading..." : userName}
          </span>
          {/* CHANGE 3: The Avatar is now smaller and sits inside the button */}
          <Avatar className="h-7 w-7 border border-slate-200">
            <AvatarImage src="" alt={userName || "User"} />
            <AvatarFallback className="bg-slate-200 text-xs text-slate-700">
               {loading ? "..." : getInitials(userName || "U?")}
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
              {loading ? "Loading..." : userName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {/* Show the user ID or email from session payload if available */}
              {!session.loading && userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

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
            <span>Toggle Theme</span>
          </DropdownMenuItem>
          {/* ------------------------- */}

        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
            className="text-red-600 focus:text-red-600 cursor-pointer"
            onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  );
}