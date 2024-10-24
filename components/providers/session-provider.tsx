"use client";

import { SessionProvider as NextAuthProvider, SessionProviderProps } from "next-auth/react";

export const SessionProvider = (props: SessionProviderProps) => {
  return <NextAuthProvider {...props} />;
};
