import CheckAuthenticated from "./components/check-authenticated";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CheckAuthenticated>
      <main className="mx-auto flex h-screen w-[300px] flex-col justify-center gap-4">
        <div className="text-left text-xl font-bold">
          Welcome to <span className="text-primary">Globetrotter</span>
        </div>
        {children}
      </main>
    </CheckAuthenticated>
  );
}
