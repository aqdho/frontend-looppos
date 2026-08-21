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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Belum login → hanya boleh masuk login/register
    if (!token) {
      if (pathname !== "/login" && pathname !== "/register") {
        router.replace("/login");
        return;
      }
    }

    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}