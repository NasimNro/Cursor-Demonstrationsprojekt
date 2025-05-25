import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weight Tracker - Monitor Your Progress",
  description: "A simple and effective way to track your weight journey",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full overflow-hidden">
      <body
        className={`${inter.className} bg-gray-900 text-gray-100 antialiased h-full h-[100svh] overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
