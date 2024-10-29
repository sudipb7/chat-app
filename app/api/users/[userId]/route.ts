import { NextResponse } from "next/server";

import db from "@/server/db";
import { userSchema } from "@/lib/schemas";
import { withSession } from "@/server/withSession";
import { setIsUserOnboarded } from "@/server/utils";

export const PATCH = withSession(
  async ({ req, params, session, searchParams }) => {
    const reqBody = await req.json();
    const isOnboarding = searchParams.onboarding === "true";
    const validated = userSchema.safeParse(reqBody);
    if (!validated.success) {
      return new NextResponse(validated.error.errors[0].message, { status: 400 });
    }

    if (session?.userId !== params.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.update({
      where: { id: session.userId },
      data: { ...validated.data, username: validated.data.username.toLowerCase() },
    });

    // Set onboarding step
    if (isOnboarding && !session.isOnboarded && user.username) {
      setIsUserOnboarded(user.id);
    }

    return NextResponse.json(user);
  },
  {
    method: "PATCH",
    route: "/api/users/[userId]",
  }
);
