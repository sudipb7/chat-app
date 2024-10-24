import { Metadata } from "next";
import { redirect } from "next/navigation";

import { OnboardingForm } from "../_components";
import { Logo } from "@/components/icons";
import { getCurrentUser } from "@/server/queries";
import { getOnboardingStep } from "@/server/utils";

export const metadata: Metadata = {
  title: "Claim your username",
  description: "Choose a username for your public profile",
};

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const step = await getOnboardingStep(user.id);
  if (step && step === "completed") {
    return redirect("/chat");
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-6 bg-background-secondary">
      <div className="mx-auto flex flex-col justify-center space-y-5 w-full max-w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto h-7 w-7" />
          <h1 className="font-serif text-2xl font-semibold">Claim your username</h1>
        </div>
        <OnboardingForm user={user} />
      </div>
    </main>
  );
}
