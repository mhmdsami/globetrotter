import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "~/components/toast";
import AppContextProvider from "~/contexts";
import { tw } from "~/utils/ui";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Globetrotter",
  description: "Guess places from cryptic clues and unlock cool facts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={tw(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <Suspense>
          <AppContextProvider>{children}</AppContextProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
