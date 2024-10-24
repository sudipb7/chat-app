import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

import db from "./db";
import { auth } from "./auth";

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Get user from token
export async function getUserViaToken(req: NextRequest) {
  const cookies = req.cookies
    .toString()
    .split(";")
    .reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key.trim()] = value;
        return acc;
      },
      {} as Record<string, string>
    );

  const cookieName =
    process.env.NODE_ENV === "production" ? "__Secure" : "" + "authjs.session-token";
  const sessionCookie = cookies[cookieName];
  if (!sessionCookie) {
    return null;
  }

  const decodedSession = await jwtVerify(
    sessionCookie,
    new TextEncoder().encode(process.env.AUTH_SECRET as string)
  );

  if (!decodedSession?.payload?.sub) {
    return null;
  }

  return getUserById(decodedSession.payload.sub);
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return await getUserById(session.user.id);
}
