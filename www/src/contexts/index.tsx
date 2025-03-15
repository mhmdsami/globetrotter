"use client";

import QueryClientProvider from "~/contexts/query";

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}
