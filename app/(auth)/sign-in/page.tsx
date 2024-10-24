import Link from "next/link";
import { Metadata } from "next";

import { cn } from "@/lib/utils";
import { AuthForm } from "../_components";
import { buttonVariants } from "@/components/ui/button";
import { Logo, ChevronLeft } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account.",
};

export default function SignInPage() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-6 bg-background-secondary">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex flex-col justify-center space-y-5 w-full max-w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto h-7 w-7" />
          <h1 className="font-serif text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <AuthForm />
        <p className="px-6 text-center text-sm text-muted-foreground font-medium">
          <Link
            href="/sign-up"
            className="font-serif underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
