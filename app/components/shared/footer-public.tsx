import { Link } from "react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-muted/30 border-t pt-12 pb-6">
      <div className="container mx-auto px-4">
        
        {/* Top Section: Links & Info */}
        <div className="grid gap-8 md:grid-cols-4 mb-12">
          
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <span className="text-xl font-bold text-primary tracking-tight">TrackMeet</span>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Modern club management for the digital age. Built for coaches, athletes, and winners.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/auth/login" className="hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Column 3: Club/Legal */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section: Sponsors (Critical for Clubs) */}
        <div className="border-t border-b py-8 mb-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Trusted by our Partners
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
            {/* Replace these with simple SVGs or Images */}
            <div className="h-8 w-24 bg-foreground/20 rounded" /> 
            <div className="h-8 w-24 bg-foreground/20 rounded" />
            <div className="h-8 w-24 bg-foreground/20 rounded" />
            <div className="h-8 w-24 bg-foreground/20 rounded" />
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} TrackMeet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}