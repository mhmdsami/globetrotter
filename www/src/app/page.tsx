import Image from "next/image";
import GetStarted from "./components/get-started";
import icon from "./icon.svg";

export default function Landing() {
  return (
    <div className="flex h-screen flex-col">
      <nav className="flex self-end p-4 lg:p-10">
        <GetStarted />
      </nav>
      <main className="flex grow items-center justify-center text-5xl font-bold">
        <div className="flex flex-col items-center gap-5">
          <Image src={icon} alt="Globetrotter" height={100} width={100} />
          Globetrotter
        </div>
      </main>
    </div>
  );
}
