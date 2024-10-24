import { NextResponse } from "next/server";

import db from "@/server/db";
import { userSchema } from "@/lib/schemas";
import { withSession } from "@/server/withSession";
import { setOnboardingStep } from "@/server/utils";

export const PATCH = withSession(
  async ({ req, params, session, searchParams }) => {
    const reqBody = await req.json();
    const isOnboarding = searchParams.onboarding === "true";
    const validated = userSchema.safeParse(reqBody);
    if (!validated.success) {
      return new NextResponse(validated.error.errors[0].message, { status: 400 });
    }

    if (session?.id !== params.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.update({ where: { id: session.id }, data: validated.data });

    // Set onboarding step
    if (isOnboarding && !session.username) {
      if (!user.username) {
        return new NextResponse("User must have a username to complete onboarding", {
          status: 400,
        });
      }

      await setOnboardingStep(user.id, "completed");
    }

    return NextResponse.json(user);
  },
  {
    method: "PATCH",
    route: "/api/users/[userId]",
  }
);
