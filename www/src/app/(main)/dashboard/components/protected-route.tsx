"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LOCAL_STORAGE_KEYS } from "~/utils/keys";

const isTokenExpired = (token: string) => {
  if (!token) return true;

  const { exp } = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Date.now() / 1000;
  return exp < currentTime;
};

export default function ProtectedRoute({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      router.push("/sign-in");
    }
  }, [pathname]);

  return children;
}
