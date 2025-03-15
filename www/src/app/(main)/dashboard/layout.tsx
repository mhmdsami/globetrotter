import Logout from "./components/logout";
import ProtectedRoute from "./components/protected-route";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col">
        <nav className="flex self-end p-4 lg:p-10">
          <Logout />
        </nav>
        <main className="flex grow">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
