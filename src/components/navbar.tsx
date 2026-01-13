import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Scan } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Scan className="h-5 w-5" />
          <span>8004 Scanner</span>
        </Link>

        {/* Nav items */}
        <nav className="ml-8 flex items-center gap-6">
          <Link
            href="/agents"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Agents
          </Link>
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm">
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}

