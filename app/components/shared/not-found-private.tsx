import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { MapPinOff, ArrowLeft, Home } from "lucide-react";

export function PrivateNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="relative mb-8">
        {/* Abstract Background Decoration */}
        <div className="absolute inset-0 -z-10 blur-2xl opacity-20 bg-primary/30 rounded-full" />
        
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted border-2 border-border shadow-sm">
          <MapPinOff className="h-10 w-10 text-muted-foreground" />
        </div>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
        404
      </h1>
      
      <h2 className="mt-4 text-2xl font-semibold tracking-tight">
        You've run off the track!
      </h2>
      
      <p className="mt-4 max-w-[500px] text-muted-foreground text-lg">
        We couldn't find the page you were looking for. It might have been moved, 
        deleted, or maybe you just sprinted a bit too far.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        
        <Button 
          size="lg" 
          asChild
          className="w-full sm:w-auto gap-2"
        >
          <Link to="/is/portal">
            <Home className="h-4 w-4" />
            Back to Portal
          </Link>
        </Button>
      </div>
    </div>
    
  );
}