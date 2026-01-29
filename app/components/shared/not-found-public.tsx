import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function PublicNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Simple Public Header */}
      <header className="border-b p-4">
        <div className="container mx-auto font-bold text-primary text-xl">
          TrackMeet
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <h1 className="text-6xl font-black text-gray-200 dark:text-gray-800">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">Page not found</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        
        <div className="mt-8 flex gap-4">
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/auth/login">Log In</Link>
          </Button>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TrackMeet
      </footer>
    </div>
  );
}