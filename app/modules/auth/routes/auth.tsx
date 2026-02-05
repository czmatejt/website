import { useEffect, useState } from "react";
// 1. Import AuthPage directly
import { AuthPage } from "supertokens-auth-react/ui"; 
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";

export default function Auth() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // 2. Render the AuthPage directly. 
  // It acts as a "smart component" that checks the URL itself.
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
      <AuthPage 
        preBuiltUIList={[EmailPasswordPreBuiltUI]} 
        // We don't need to pass reactRouterDom here because we aren't creating routes!
      />
    </div>
  );
}