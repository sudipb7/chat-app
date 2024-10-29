import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    isOnboarded: boolean;
    userId: string;
  }
}
