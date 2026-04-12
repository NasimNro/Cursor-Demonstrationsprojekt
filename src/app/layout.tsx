import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weight Tracker - Monitor Your Progress",
  description: "A simple and effective way to track your weight journey",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark min-h-full" suppressHydrationWarning>
      <body
        className={`${inter.className} text-gray-100 antialiased min-h-full min-h-[100svh]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
