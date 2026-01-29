import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

import { SuperTokensWrapper } from "supertokens-auth-react";
import { initSuperTokens } from "./config/supertokens"; 
import { ThemeProvider } from "./components/shared/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
