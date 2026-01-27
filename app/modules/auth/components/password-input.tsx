import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, type, ...props }, ref) => { // 1. Destructure 'type' so we don't pass it accidentally
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"} // 2. This now strictly controls the type
          className={cn("pr-10", className)}
          ref={ref}
          {...props} // 3. Spread the rest of the props (onChange, value, etc.)
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer" // Added cursor-pointer just in case
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1} // Prevents tabbing to the eye icon (optional preference)
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };