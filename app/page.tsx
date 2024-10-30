import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="h-screen grid place-items-center">
      <div className="space-y-2.5 flex flex-col mx-auto max-w-lg">
        <h1 className="text-3xl font-semibold">Welcome to Chat App</h1>
        <p className="text-muted-foreground font-mono">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
        <Button asChild className="w-fit" aria-label="Get Started">
          <Link href="/sign-in">Get Started</Link>
        </Button>
      </div>
    </main>
  );
}
