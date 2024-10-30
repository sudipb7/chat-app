import { User } from "@prisma/client";

export type UserWithOnboardingStatus = User & { isOnboarded: boolean };

export type Session = {
  email: string;
  id: string;
  isOnboarded: boolean;
};
