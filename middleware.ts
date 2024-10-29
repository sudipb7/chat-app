import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { reqUrlParser } from "@/server/utils";

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

export default auth(async (req) => {
  const isAuth = !!req.auth;
  const isOnboarded = req.auth?.isOnboarded;
  const { fullPath, path } = reqUrlParser(req);
  const isOnboardingRoute = path === "/onboarding";
  const isPrivateRoute =
    path !== "/sign-in" &&
    path !== "/forgot-password" &&
    path !== "/sign-up" &&
    path !== "/" &&
    !path.startsWith("/reset-password");

  if (!isAuth && isPrivateRoute) {
    return NextResponse.redirect(new URL(`/sign-in?redirectTo=${fullPath}`, req.url));
  }

  if (isAuth && isPrivateRoute) {
    if (isOnboarded && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/chat", req.url));
    }

    if (!isOnboarded && !isOnboardingRoute) {
      return NextResponse.redirect(new URL(`/onboarding`, req.url));
    }
  }

  return NextResponse.next();
});
