import { User } from "@prisma/client";

export type UserWithOnboardingStatus = User & { isOnboarded: boolean };
