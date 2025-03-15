"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LOCAL_STORAGE_KEYS } from "~/utils/keys";

export default function CheckAuthenticated({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

    if (token) {
      router.push("/dashboard");
    }
  }, [pathname]);

  return children;
}
