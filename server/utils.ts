import { NextRequest } from "next/server";
import { hashSync, compareSync } from "bcrypt-edge";
import { jwtVerify } from "jose";

import redis from "./redis";
import { JWT } from "next-auth/jwt";
import { cookies } from "next/headers";
import { Session } from "@/types";

const COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Secure" : "" + "authjs.session-token";
const ENCODED_AUTH_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET as string);

export function hashPassword(password: string) {
  return hashSync(password, 10);
}

export function comparePassword(password: string, hashedPassword: string) {
  return compareSync(password, hashedPassword);
}

export function reqUrlParser(req: NextRequest) {
  let domain = req.headers.get("host") as string;
  domain = domain.replace("www.", "").toLowerCase();

  const path = req.nextUrl.pathname;

  // fullPath is the full URL path (along with search params)
  const searchParams = req.nextUrl.searchParams.toString();
  const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : "";
  const fullPath = `${path}${searchParamsString}`;

  return { domain, path, fullPath };
}

// Get onboarding step from Redis
export async function getIsUserOnboarded(id: string) {
  const isOnboarded = await redis.get(`onboarding-step:${id}`);
  return isOnboarded === "completed";
}

// Set onboarding step in Redis
export function setIsUserOnboarded(id: string) {
  return redis.set(`onboarding-step:${id}`, "completed");
}

export async function getSessionFromMiddleware(req: NextRequest): Promise<Session | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = (await jwtVerify(token, ENCODED_AUTH_SECRET)).payload as JWT;
  if (!session.id) return null;

  return {
    email: session.email,
    id: session.id,
    isOnboarded: session.isOnboarded,
  } as Session;
}

export async function getSession(): Promise<Session | null> {
  const store = cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = (await jwtVerify(token, ENCODED_AUTH_SECRET)).payload as JWT;
  if (!session.id) return null;

  return {
    email: session.email,
    id: session.id,
    isOnboarded: session.isOnboarded,
  } as Session;
}
