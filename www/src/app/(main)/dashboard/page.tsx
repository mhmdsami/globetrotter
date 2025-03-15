"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startGameApi } from "~/api/game";
import { getUserApi } from "~/api/user";
import { Button } from "~/components/button";
import { QUERY_KEYS } from "~/utils/keys";
import { withToast } from "~/utils/with-toast";

export default function Dashboard() {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: async () => {
      return await withToast(getUserApi());
    },
  });

  const { mutate: startGame } = useMutation({
    mutationKey: [QUERY_KEYS.START_GAME],
    mutationFn: async () => {
      const session = await withToast(startGameApi());

      return session;
    },
    onSuccess: (data) => {
      router.push(`/game/${data.gameSession.id}`);
    },
  });

  if (!data) {
    return null;
  }

  const activeSession = data.gameSessions.find((session) => session.isActive);
  const recentSession = data.gameSessions
    .filter((session) => !session.isActive)
    .slice(0, 5);

  return (
    <div className="mx-4 flex flex-col gap-5 lg:mx-10 mb-4">
      <div className="flex items-start justify-between">
        <Button onClick={() => startGame()}>Start New Game</Button>
        <div className="bg-primary rounded-lg px-5 py-3 text-center text-white">
          <div className="font-medium">Score</div>
          <div className="text-xl font-semibold">{data.user.score}</div>
        </div>
      </div>
      {activeSession && (
        <div className="flex flex-col gap-3">
          <div className="text-2xl font-semibold">Active Game</div>
          <div className="bg-[#F8F8F8] border-input flex w-full md:w-[250px] h-[150px] flex-col gap-4 rounded-lg border p-3">
            <div className="flex flex-col gap-2">
              <div className="font-medium">Current Score</div>
              <div className="text-3xl font-semibold">
                {activeSession.score}
              </div>
            </div>
            <Button className="w-fit self-end font-semibold" asChild>
              <Link href={`/game/${activeSession.id}`}>Resume</Link>
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <div className="text-2xl font-semibold">Recent Games</div>
        <div className="flex gap-3 flex-wrap">
          {recentSession.map((session) => (
            <div className="border-input flex w-full md:w-[250px] h-[150px] flex-col gap-4 rounded-lg border p-3">
              <div className="flex flex-col gap-2">
                <div className="font-medium">Score</div>
                <div className="text-3xl font-semibold">{session.score}</div>
              </div>
              <Button className="w-fit self-end font-semibold">
                Challenge
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
