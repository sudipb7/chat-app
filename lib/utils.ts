import axios from "axios";
import { toast } from "sonner";
import { Session } from "next-auth";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSession(session: Session) {
  if (!session.user?.email) {
    return null;
  }

  return {
    ...session.user,
    expires: session.expires,
  };
}

export function getSearchParams(url: string) {
  const params = {} as Record<string, string>;

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val;
  });

  return params;
}

export function handleClientError(error: unknown) {
  console.log(error);
  if (axios.isAxiosError(error) && error.response?.data) {
    toast.error(error.response.data.error);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("Something went wrong!", { description: "Please try again." });
  }
}
