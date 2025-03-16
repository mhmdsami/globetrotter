"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/button";
import { LOCAL_STORAGE_KEYS } from "~/utils/keys";

export default function GetStarted() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN));
  }, []);

  return (
    <Button className="font-bold" asChild>
      <Link href={isLoggedIn ? "/dashboard" : "/sign-in"}>Get Started</Link>
    </Button>
  );
}
