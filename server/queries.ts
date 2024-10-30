import db from "./db";
import { getSession } from "./utils";

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
    const session = await getSession();
    if (!session) return null;

    const user = await getUserById(session.id);
    if (!user) return null;

    return { ...user, ...(includeIsOnboarded && { isOnboarded: session.isOnboarded }) };
  } catch (error) {
    console.error(error);
    return null;
  }
}
