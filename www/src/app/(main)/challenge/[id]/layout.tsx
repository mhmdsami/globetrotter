import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
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
