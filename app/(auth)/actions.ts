"use server";

import db from "@/server/db";
import { getUserByEmail } from "@/server/queries";
import { signIn as signInWithNextAuth } from "@/server/auth";
import { hashPassword, comparePassword, setOnboardingStep } from "@/server/utils";
import { SignInInput, signInSchema, SignUpInput, signUpSchema } from "@/lib/schemas";

export const signUp = async (data: SignUpInput, redirectTo: string) => {
  const validated = signUpSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { email, name, password } = validated.data;
  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.emailVerified) {
    return { error: "Email is already in use" };
  }

  const hashedPassword = await hashPassword(password);

  if (existingUser && !existingUser.emailVerified) {
    await db.user.update({
      where: { id: existingUser.id },
      data: { name, email, password: hashedPassword },
    });
  }

  const user = await db.user.create({
    data: { name, email, password: hashedPassword },
  });

  await setOnboardingStep(user.id, "started");

  await signInWithNextAuth("resend", {
    email,
    redirect: false,
    redirectTo,
  });

  return {
    message: {
      title: "Check your email",
      description: "We've sent you a magic link to sign in.",
    },
  };
};

export const signIn = async (data: SignInInput, redirectTo: string) => {
  const validated = signInSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { email, password } = validated.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Invalid email or password" };
  }

  if (!existingUser.password) {
    return { error: "Password not set for this account" };
  }

  const passwordMatch = await comparePassword(password, existingUser?.password);
  if (!passwordMatch) {
    return { error: "Invalid email or password" };
  }

  await signInWithNextAuth("resend", {
    email,
    redirect: false,
    redirectTo,
  });

  return {
    message: {
      title: "Check your email",
      description: "We've sent you a magic link to sign in.",
    },
  };
};

export const signInWithGoogle = async (redirectTo: string) => {
  await signInWithNextAuth("google", { redirectTo });
};

export const signInWithGithub = async (redirectTo: string) => {
  await signInWithNextAuth("github", { redirectTo });
};
