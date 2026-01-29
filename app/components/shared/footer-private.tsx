export function PrivateFooter() {
  return (
    <footer className="py-6 px-8 text-center md:text-left">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Tajovsky Matej
        </p>
        <div className="flex gap-4">
          <span>v1.0.1-beta</span>
          <span className="hidden md:inline">•</span>
          <a href="#" className="hover:underline">Report a Bug</a>
        </div>
      </div>
    </footer>
  );
}