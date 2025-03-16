"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/button";
import { LOCAL_STORAGE_KEYS } from "~/utils/keys";

export default function Logout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    queryClient.clear();
    router.push("/");
  };

  if (!isLoggedIn) return null;

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
