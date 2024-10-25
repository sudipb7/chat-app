import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

import db from "./db";
import { auth } from "./auth";
import { getOnboardingStep } from "./utils";

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
export async function getUserFromToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET as string);
    const decodedSession = await jwtVerify(token, secret);

    if (!decodedSession?.payload?.sub) {
      return null;
    }

    const user = await getUserById(decodedSession.payload.sub);
    if (!user) {
      return null;
    }

    const onboardingStatus = (await getOnboardingStep(user.id)) as string | null;

    return { ...user, onboardingStatus };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return await getUserById(session.user.id);
}
