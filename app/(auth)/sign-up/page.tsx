import Link from "next/link";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons";
import { AuthForm } from "../_components";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function SignUpPage() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-6 bg-background-secondary">
      <Link
        href="/sign-in"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "absolute right-4 top-4 md:right-8 md:top-8 hover:bg-background-secondary"
        )}
      >
        Sign In
      </Link>
      <div className="mx-auto flex flex-col justify-center space-y-5 w-full max-w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto h-7 w-7" />
          <h1 className="font-serif text-2xl font-semibold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <AuthForm />
        <p className="px-6 text-center text-sm text-muted-foreground font-serif font-medium">
          By clicking continue, you agree to our{" "}
          <Link
            href="/sign-up#"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/sign-up#"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
