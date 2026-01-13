"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/agents?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden bg-background">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="text-cyan-400">ERC-8004</span> Scanner Demo
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          A demo app to learn how to build an ERC-8004 agent scanner from scratch
        </p>

        {/* Search bar */}
        <div className="mt-12 w-full max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-14 w-full rounded-lg border border-border bg-card/50 pl-12 pr-4 text-base backdrop-blur-sm placeholder:text-muted-foreground focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-md bg-cyan-600 px-6 hover:bg-cyan-700"
          >
            <Link href="/agents">
              Browse Agents
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
