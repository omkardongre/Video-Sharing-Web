"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/callback");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return <div className="bg-background text-foreground">{children}</div>;
}
