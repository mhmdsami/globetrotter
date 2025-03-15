import Image from "next/image";
import Link from "next/link";
import icon from "~/app/icon.svg";
import Logout from "./dashboard/components/logout";
import ProtectedRoute from "./dashboard/components/protected-route";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col">
        <nav className="flex items-center justify-between p-4 lg:p-10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src={icon} alt="icon" height={24} width={24} />
            <div className="text-lg font-semibold">Globetrotter</div>
          </Link>
          <Logout />
        </nav>
        <main className="flex grow flex-col">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
