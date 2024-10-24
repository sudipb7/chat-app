import { Toaster } from "sonner";
import type { Metadata } from "next";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { SessionProvider } from "@/components/providers";
import { fontMono, fontSans, fontSerif } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Chat App",
  description: "A chat app.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            fontMono.variable,
            fontSans.variable,
            fontSerif.variable,
            "antialiased font-sans"
          )}
        >
          {children}
          <Toaster richColors />
        </body>
      </html>
    </SessionProvider>
  );
}
