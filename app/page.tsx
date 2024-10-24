import React from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="text-3xl font-bold">Home Page</h1>
      <p className="text-lg">Welcome to the home page</p>
      <ModeToggle />
      <Button>Get Started</Button>
    </div>
  );
}
