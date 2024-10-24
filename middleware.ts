import { NextRequest, NextResponse } from "next/server";

import { getUserViaToken } from "./server/queries";
import { getOnboardingStep, reqUrlParser, setOnboardingStep } from "./server/utils";

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

  const user = await getUserViaToken(req);

  if (!user) {
    if (
      path !== "/sign-in" &&
      path !== "/forgot-password" &&
      path !== "/sign-up" &&
      path !== "/" &&
      !path.startsWith("/reset-password")
    ) {
      return NextResponse.redirect(new URL(`/sign-in?redirectTo=${fullPath}`, req.url));
    }
  }

  if (user) {
    if (
      !path.startsWith("/onboarding") &&
      ((await getOnboardingStep(user.id)) !== "completed" || !user.username)
    ) {
      const currentStep = await getOnboardingStep(user.id);
      if (!currentStep) {
        await setOnboardingStep(user.id, "started");
        return NextResponse.redirect(new URL(`/onboarding`, req.url));
      } else if (currentStep !== "completed") {
        return NextResponse.redirect(new URL(`/onboarding`, req.url));
      }
    } else if (
      path.startsWith("/onboarding") &&
      (await getOnboardingStep(user.id)) === "completed"
    ) {
      return NextResponse.redirect(new URL("/chat", req.url));
    }
  }

  return NextResponse.next();
}
