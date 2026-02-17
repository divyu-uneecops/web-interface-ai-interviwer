"use client";

import { Inter, Public_Sans } from "next/font/google";
import "../globals.css";
import { toast, Toaster } from "sonner";
import StoreProvider from "@/store/provider";
import { useEffect, useState } from "react";
import { fetchForm, fetchViews } from "@/store/app/app.thunks";
import { useAppDispatch } from "@/store/hooks";
import { Loader2 } from "lucide-react";

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

function UserLayoutContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useAppDispatch();
  const [utilsLoaded, setUtilsLoaded] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      dispatch(fetchForm()).unwrap(),
      dispatch(fetchViews()).unwrap(),
    ])
      .then(([formResult, viewsResult]) => {
        if (formResult.status === "rejected") {
          toast.error(formResult.reason || "Failed to fetch Form Properties");
        }
        if (viewsResult.status === "rejected") {
          toast.error(viewsResult.reason || "Failed to fetch Views");
        }
      })
      .finally(() => {
        setUtilsLoaded(true);
      });
  }, [dispatch]);

  if (!utilsLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  return <>{children}</>;
}

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
          <UserLayoutContent>{children}</UserLayoutContent>
        </StoreProvider>
      </body>
    </html>
  );
}
