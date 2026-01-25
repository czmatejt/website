import { useLocation, useNavigate } from "react-router";
import { 
  ChevronsUpDown, 
  Check, 
  Users, 
  Trophy, 
  ShieldCheck,
  LayoutGrid
} from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useState } from "react";

import { APP_MODULES } from "~/config/navigation"; 
import Cookies from "js-cookie";

export function ModuleSwitcher({ userRoles }: { userRoles: string[] }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Filter Logic
  // (Assuming 'portal' is always available, others depend on roles)
  const availableModules = APP_MODULES.filter(m => 
    m.id === "portal" || userRoles.includes(m.id)
  );

  // 2. Detect Active Module
  const activeModule = availableModules.find(
    (module) => {
        if (module.id === "portal") return location.pathname === "/is" || location.pathname === "/is/";
        return location.pathname.startsWith(`/is/${module.id}`);
    }
  ) || availableModules[0];

  return (
    <>
      {/* === MOBILE VIEW: DROPDOWN (Hidden on Desktop) === */}
      <div className="md:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between border-dashed md:w-[180px]"
            >
              {activeModule ? (
                <div className="flex items-center gap-2">
                  <activeModule.icon className="h-4 w-4" />
                  <span className="truncate">{activeModule.label}</span>
                </div>
              ) : (
                "Select Module..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search module..." />
              <CommandList>
                <CommandEmpty>No module found.</CommandEmpty>
                <CommandGroup heading="My Modules">
                  {availableModules.map((module) => (
                    <CommandItem
                      key={module.id}
                      onSelect={() => {
                        Cookies.set("lastModule", module.path);
                        navigate(module.path);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <module.icon className="mr-2 h-4 w-4" />
                      {module.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          activeModule?.id === module.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* === DESKTOP VIEW: TABS (Hidden on Mobile) === */}
      <div className="hidden items-center gap-1 md:flex">
        {availableModules.map((module) => {
            const isActive = activeModule?.id === module.id;
            
            return (
                <Button
                    key={module.id}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => { 
                      Cookies.set("lastModule", module.path);
                      navigate(module.path);
                    }}
                    className={cn(
                        "gap-2 text-sm transition-all",
                        isActive 
                            ? "bg-slate-100 font-semibold text-slate-900 shadow-sm" 
                            : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    <module.icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    {module.label}
                </Button>
            );
        })}
      </div>
    </>
  );
}