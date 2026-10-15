"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("AUTH GUARD:", pathname, "TOKEN:", token);

    if (pathname === "/" || pathname === "/KasirApp") {
      setChecking(false);
      return;
    }

    if (pathname === "/login" || pathname === "/register") {
      setChecking(false);
      return;
    }

    if (!token) {
      router.replace("/KasirApp");
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white-900">
        <p className="text-black">Memuat...</p>
      </div>
    );
  }

  return <>{children}</>;
}