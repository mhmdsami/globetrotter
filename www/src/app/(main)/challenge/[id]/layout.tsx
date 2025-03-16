import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Globetrotter | Challenge",
    openGraph: {
      images: [`/api/generate-challenge-card?id=${id}`],
    },
  };
}

export default function ChallengeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
