import { NextRequest, NextResponse } from "next/server";
import { getSessionFromMiddleware, reqUrlParser } from "@/server/utils";

export default async function middleware(req: NextRequest) {
  const session = await getSessionFromMiddleware(req);
  const { fullPath, path } = reqUrlParser(req);
  const isOnboardingRoute = path === "/onboarding";
  const isAuthRoute = path === "/sign-in" || path === "/sign-up" || path === "/forgot-password";
  const isPrivateRoute = !isAuthRoute && path !== "/" && !path.startsWith("/reset-password");

  if (!session && isPrivateRoute) {
    return NextResponse.redirect(new URL(`/sign-in?redirectTo=${fullPath}`, req.url));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  if (session && isPrivateRoute) {
    if (session.isOnboarded && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/chat", req.url));
    }

    if (!session.isOnboarded && !isOnboardingRoute) {
      return NextResponse.redirect(new URL(`/onboarding`, req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (proxies for third-party services)
     * 4. /_static/ (static files inside /public folder)
     * 5. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest, .well-known
     */
    "/((?!api/|_next/|_proxy/|_static/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.well-known).*)",
  ],
};
