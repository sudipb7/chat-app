import { NextRequest } from "next/server";
import { hashSync, compareSync } from "bcrypt-edge";

import redis from "./redis";

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
export async function getIsUserOnboarded(userId: string) {
  const isOnboarded = await redis.get(`onboarding-step:${userId}`);
  return isOnboarded === "completed";
}

// Set onboarding step in Redis
export function setIsUserOnboarded(userId: string) {
  return redis.set(`onboarding-step:${userId}`, "completed");
}
