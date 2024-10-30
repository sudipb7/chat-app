import { User } from "@prisma/client";

export type UserWithOnboardingStatus = User & { isOnboarded: boolean };

export type Session = {
  id: string;
  isOnboarded: boolean;
};
