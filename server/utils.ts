import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hashSync, compareSync } from "bcrypt-edge";

import redis from "./redis";
import { auth } from "./auth";
import { Session } from "@/types";

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

export async function getSessionFromReq(req: NextRequest): Promise<Session | null> {
  const session = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!session?.id) return null;

  return { id: session.id, isOnboarded: session.isOnboarded } as Session;
}

export async function getSession(): Promise<Session | null> {
  const session = await auth();
  if (!session?.id) return null;
  return { id: session.id, isOnboarded: session.isOnboarded } as Session;
}
