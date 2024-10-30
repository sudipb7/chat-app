"use client";

import * as React from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Google, Github } from "@/components/icons";
import { signInSchema, SignInInput } from "@/lib/schemas";

export const AuthForm = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: SignInInput) {
    setIsLoading(true);

    const signInResult = await signIn("resend", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get("redirectTo") || "/chat",
    });

    setIsLoading(false);
    reset();

    if (!signInResult?.ok) {
      return toast.error("Something went wrong.", {
        description: "Please try again.",
      });
    }

    return toast.success("We sent you a login link", {
      description: "You can close this window.",
    });
  }

  return (
    <div className={cn("grid gap-3.5", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2.5">
          <div>
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <Input
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="bg-background h-10"
              disabled={isLoading}
              {...register("email")}
            />
            <p
              data-error={errors.email?.message ? true : false}
              className="mt-1.5 text-xs text-destructive font-medium data-[error=true]:block data-[error=true]:animate-in data-[error=true]:fade-in-0 data-[error=false]:hidden data-[error=false]:animate-out data-[error=false]:fade-out-0 transition-opacity"
            >
              {errors.email?.message}
            </p>
          </div>
          <Button size="lg" disabled={isLoading} aria-label="Continue with Email">
            Continue with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-muted-foreground bg-background-secondary">Or</span>
        </div>
      </div>
      <Button
        size="lg"
        type="button"
        variant="outline"
        aria-label="Continue with Github"
        onClick={() => {
          setIsLoading(true);
          signIn("github", { callbackUrl: searchParams?.get("redirectTo") || "/chat" });
          setIsLoading(false);
        }}
        className="gap-2.5"
        disabled={isLoading}
      >
        <Github className="h-4 w-4" /> Continue with Github
      </Button>
      <Button
        size="lg"
        type="button"
        variant="outline"
        aria-label="Continue with Google"
        onClick={() => {
          setIsLoading(true);
          signIn("google", { callbackUrl: searchParams?.get("redirectTo") || "/chat" });
          setIsLoading(false);
        }}
        className="-mt-1 gap-2.5"
        disabled={isLoading}
      >
        <Google className="h-4 w-4" />
        Continue with Google
      </Button>
    </div>
  );
};
