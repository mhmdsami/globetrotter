import { Jimp, JimpMime, loadFont, measureText } from "jimp";
import { SANS_32_BLACK } from "jimp/fonts";
import { NextRequest, NextResponse } from "next/server";
import { getChallengeApi } from "~/api/challenge";

export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;

  const id = searchParams.get("id") as string;
  const challenge = await getChallengeApi(id);
  const score = challenge.creator.score.toString();

  try {
    const card = await Jimp.read(`${origin}/challenge-card.png`);
    const font32 = await loadFont(SANS_32_BLACK);

    card.print({
      text: score,
      font: font32,
      x: card.bitmap.width / 2 - measureText(font32, score || "0") / 2,
      y: card.bitmap.height / 2 + 40,
    });

    const buffer = await card.getBuffer(JimpMime.png);

    return new NextResponse(buffer, {
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: error.message,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something when wrong",
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
}
