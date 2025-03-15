import Link from "next/link";
import { Button } from "~/components/button";

export default function Landing() {
  return (
    <div className="flex h-screen flex-col">
      <nav className="flex self-end p-4 lg:p-10">
        <Button className="font-bold" asChild>
          <Link href="/sign-in">Get Started</Link>
        </Button>
      </nav>
      <main className="flex grow items-center justify-center text-5xl font-bold">
        Globetrotter
      </main>
    </div>
  );
}
