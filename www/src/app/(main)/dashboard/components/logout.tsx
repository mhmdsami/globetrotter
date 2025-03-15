"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "~/components/button";

export default function Logout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    queryClient.clear();
    router.push("/");
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
