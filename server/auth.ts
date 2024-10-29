import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { JWT } from "next-auth/jwt";
import { SignJWT, jwtVerify } from "jose";
import { PrismaAdapter } from "@auth/prisma-adapter";

import db from "./db";
import { getIsUserOnboarded } from "./utils";
import { getUserByEmail, getUserById } from "./queries";

const IS_PROD = process.env.NODE_ENV === "production";
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

      token.userId = user.id;

      const isOnboarded = await getIsUserOnboarded(user.id);
      token.isOnboarded = Boolean(isOnboarded);

      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.userId = token.userId as string;
      }
      session.isOnboarded = token.isOnboarded as boolean;
      return session;
    },
  },
  session: { strategy: "jwt" },
  jwt: {
    async encode({ secret, token }) {
      return await new SignJWT(token)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("30 days")
        .sign(new TextEncoder().encode(secret as string));
    },
    async decode({ secret, token }) {
      if (!token) return null;
      return (await jwtVerify(token, new TextEncoder().encode(secret as string))).payload as JWT;
    },
  },
  cookies: {
    sessionToken: {
      name: IS_PROD ? "__Secure" : "" + "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // Adding a leading dot in the domain allows subdomains to access the cookie
        domain: IS_PROD ? ".chat.com" : undefined,
        secure: IS_PROD,
      },
    },
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  pages: { signIn: "/sign-in" },
});
