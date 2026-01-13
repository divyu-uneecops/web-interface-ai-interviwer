"use client";

import { Inter, Public_Sans } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import StoreProvider from "@/store/provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${publicSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <StoreProvider>
          <Toaster position="top-center" />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
