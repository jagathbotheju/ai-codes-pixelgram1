import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <Toaster richColors />
            <div className="relative flex h-screen flex-col md:flex-row md:overflow-hidden dark:bg-neutral-950 bg-white">
              <div className="w-20 flex-none md:border-r lg:w-64">
                <SideNav />
              </div>

              <div className="flex flex-col w-full">
                <Header />
                <div className="mx-auto mt-12 flex w-full max-w-7xl flex-1 flex-grow sm:p-6 md:mt-0 md:overflow-y-auto md:p-12">
                  {children}
                </div>
              </div>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
