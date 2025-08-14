import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { HydrationSafeThemeProvider } from "@/components/ui/hydration-safe-theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pakfiler - Tax Filing Made Easy",
  description:
    "Simplified tax filing, registration, and compliance services in Pakistan",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <HydrationSafeThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            {/* <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLetew0YhOQw_4JD-690PEETBPbWTNfl6joA&s"
              alt="PAISA LAYA ?"
            /> */}
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ChatWidget />
          <Toaster />
        </HydrationSafeThemeProvider>
      </body>
    </html>
  );
}
