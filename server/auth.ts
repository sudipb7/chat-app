import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";

import db from "./db";
import { getIsUserOnboarded } from "./utils";
import { getUserByEmail, getUserById } from "./queries";

const OAUTH_OPTIONS = { allowDangerousEmailAccountLinking: true };
const RESEND_OPTIONS = {
  from: `no-reply@${process.env.RESEND_DOMAIN}`,
  apiKey: process.env.RESEND_KEY,
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [Google(OAUTH_OPTIONS), Github(OAUTH_OPTIONS), Resend(RESEND_OPTIONS)],
  events: {
    async linkAccount({ profile }) {
      // Update user profile if they link Google or Github with the same email.
      if (profile.email) {
        const user = await getUserByEmail(profile.email);
        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              ...(!user.name && profile.name && { name: profile.name }),
              ...(!user.image && profile.image && { image: profile.image }),
            },
          });
        }
      }
    },
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      token.id = user.id;

      const isOnboarded = await getIsUserOnboarded(user.id);
      token.isOnboarded = Boolean(isOnboarded);

      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.id = token.id as string;
      }
      session.isOnboarded = token.isOnboarded as boolean;
      return session;
    },
  },
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  debug: process.env.NODE_ENV === "development",
});
