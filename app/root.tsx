import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

import { SuperTokensWrapper } from "supertokens-auth-react";
import { initSuperTokens } from "./config/supertokens"; 
import { ThemeProvider } from "./modules/shared/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivateNotFound } from "./modules/shared/components/not-found-private";
import { PublicNotFound } from "./modules/shared/components/not-found-public";
import { Toaster } from "sonner";

import "./i18n";
import { useState } from "react";

// 1. Initialize immediately
initSuperTokens();

const themeScript = `
  (function() {
    try {
      const storageKey = "vite-ui-theme"; 
      const theme = localStorage.getItem(storageKey);
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const isDark = theme === 'dark' || (!theme && systemDark);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
        // Force the background color immediately to prevent white flash
        document.documentElement.style.backgroundColor = "#020817"; // Tailwind slate-950
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.backgroundColor = "#ffffff";
      }
    } catch (e) {}
  })();
`;

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Optional: Global config to prevent aggressive refetching
        staleTime: 60 * 1000, 
      },
    },
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

      </head>
      <body>
        <ThemeProvider>
          <SuperTokensWrapper>
            <QueryClientProvider client={queryClient}>
              <Toaster position="top-right" />
              {children}
            </QueryClientProvider>
          </SuperTokensWrapper>

        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const location = useLocation();
  
  const isPrivateZone = location.pathname.startsWith("/is");

  // 1. Handle 404s
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Layout>
        {isPrivateZone ? <PrivateNotFound /> : <PublicNotFound />}
      </Layout>
    );
  }

  // 2. Handle generic crashes (500s)
  // You can also split this if you want a technical error page for admins
  // vs a generic "Whoops" for public users.
  return (
    <Layout>
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          {isPrivateZone 
            ? (error instanceof Error ? error.message : "Unknown App Error") 
            : "We are having trouble loading this page."}
        </p>
      </div>
    </Layout>
  );
}