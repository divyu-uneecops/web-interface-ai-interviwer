"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppViewPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/app-view/dashboard");
  }, []);

  return null;
}
