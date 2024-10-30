"use client";

import axios from "axios";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserWithOnboardingStatus } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleClientError } from "@/lib/utils";
import { UsernameInput, usernameSchema } from "@/lib/schemas";

interface OnboardingFormProps {
  user: UserWithOnboardingStatus;
}

export const OnboardingForm = ({ user }: OnboardingFormProps) => {
  const router = useRouter();

  const {
    watch,
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsernameInput>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: "" },
  });

  const username = watch("username");

  // Check username availability as user types
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      try {
        await axios.post("/api/users/username", { username });
      } catch (error) {
        console.log(error);
        setError("username", { type: "pattern", message: "Username is not available" });
      }
    };
    // Debounce username check
    const timeout = setTimeout(() => {
      if (username && username.length >= 3) {
        checkUsernameAvailability();
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [username, setError]);

  const onSubmit = async (data: UsernameInput) => {
    try {
      await axios.patch(`/api/users/${user.id}?onboarding=true`, {
        email: user.email,
        username: data.username,
        ...(!user.name ? { name: user.email.split("@")[0] } : { name: user.name }),
      });
      toast.success("Success!", { description: "Username claimed successfully." });
      const interval = setTimeout(() => {
        router.refresh();
      }, 750);
      return () => clearInterval(interval);
    } catch (error) {
      handleClientError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3">
        <div>
          <label className="sr-only" htmlFor="username">
            Username
          </label>
          <div className="flex shadow-sm">
            <div className="min-h-full px-3 py-1.5 bg-accent border border-r-0 border-input rounded-l-md text-sm text-muted-foreground grid place-items-center">
              chat.com/
            </div>
            <Input
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              className="bg-background h-10 rounded-l-none shadow-none"
              disabled={isSubmitting}
              {...register("username")}
            />
          </div>
          <p
            data-error={errors.username?.message ? true : false}
            className="mt-1.5 text-xs text-destructive font-medium data-[error=true]:block data-[error=true]:animate-in data-[error=true]:fade-in-0 data-[error=false]:hidden data-[error=false]:animate-out data-[error=false]:fade-out-0 transition-opacity"
          >
            {errors.username?.message}
          </p>
        </div>
        <Button size="lg" disabled={isSubmitting} aria-label="Claim your username">
          Claim
        </Button>
      </div>
    </form>
  );
};
