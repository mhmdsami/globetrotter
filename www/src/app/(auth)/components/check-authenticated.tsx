"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { LOCAL_STORAGE_KEYS } from "~/utils/keys";

export default function CheckAuthenticated({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

    if (token) {
      const redirectTo = searchParams.get("redirectTo");
      if (redirectTo) {
        return router.push(redirectTo);
      }

      router.push("/dashboard");
    }
  }, [pathname]);

  return children;
}
