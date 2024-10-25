import { NextRequest, NextResponse } from "next/server";

import { getUserFromToken } from "./server/queries";
import { getToken, reqUrlParser } from "./server/utils";

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

export default async function middleware(req: NextRequest) {
  const { fullPath, path } = reqUrlParser(req);
  const isOnboardingRoute = path.startsWith("/onboarding");
  const isPrivateRoute =
    path !== "/sign-in" &&
    path !== "/forgot-password" &&
    path !== "/sign-up" &&
    path !== "/" &&
    !path.startsWith("/reset-password");

  const token = getToken(req);
  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL(`/sign-in?redirectTo=${fullPath}`, req.url));
  }

  if (token && isPrivateRoute) {
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.redirect(new URL(`/sign-in?redirectTo=${fullPath}`, req.url));
    }

    if (user.onboardingStatus === "completed" && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/chat", req.url));
    }

    if (user.onboardingStatus !== "completed" && !isOnboardingRoute) {
      return NextResponse.redirect(new URL(`/onboarding`, req.url));
    }
  }

  return NextResponse.next();
}
