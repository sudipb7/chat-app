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

export async function getCurrentUser({ includeIsOnboarded = false } = {}) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return null;
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return null;
    }

    return { ...user, ...(includeIsOnboarded && { isOnboarded: session.isOnboarded }) };
  } catch (error) {
    console.error(error);
    return null;
  }
}
