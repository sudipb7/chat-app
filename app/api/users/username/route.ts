import { NextResponse } from "next/server";

import db from "@/server/db";
import { usernameSchema } from "@/lib/schemas";
import { withSession } from "@/server/withSession";

export const POST = withSession(
  async ({ req }) => {
    const reqBody = await req.json();
    const validated = usernameSchema.safeParse(reqBody);
    if (!validated.success) {
      return new NextResponse(validated.error.errors[0].message, { status: 400 });
    }

    const { username } = validated.data;

    const existingUser = await db.user.findUnique({ where: { username } });
    if (existingUser) {
      return new NextResponse("Username is not available", { status: 400 });
    }

    return NextResponse.json({ username });
  },
  { method: "POST", route: "/api/users/username" }
);
