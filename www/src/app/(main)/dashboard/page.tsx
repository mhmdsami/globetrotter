"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Copy, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { startGameApi } from "~/api/game";
import { getUserApi } from "~/api/user";
import { Button } from "~/components/button";
import { QUERY_KEYS } from "~/utils/keys";
import { withToast } from "~/utils/with-toast";

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
    },
  });

  if (!data) {
    return null;
  }

  const pendingChallengeInvites = data.challenges.receivedChallenges
    .filter((challenge) => !challenge.isAccepted)
    .map((challenge) => ({
      id: challenge.id,
      email: challenge.creator.email,
      score: challenge.creator.score,
    }));

  const pendingChallengeRequests = data.challenges.createdChallenges
    .filter((challenge) => !challenge.isAccepted)
    .map((challenge) => ({
      id: challenge.id,
      email: challenge.player.email,
      score: challenge.player.score,
    }));

  const activeChallenges = data.challenges.createdChallenges
    .filter((challenge) => challenge.isAccepted)
    .map((challenge) => ({
      id: challenge.id,
      email: challenge.player?.email,
      score: challenge.player?.score,
    }))
    .concat(
      data.challenges.receivedChallenges
        .filter((challenge) => challenge.isAccepted)
        .map((challenge) => ({
          id: challenge.id,
          email: challenge.creator.email,
          score: challenge.creator.score,
        })),
    );

  return (
    <div className="mx-4 mb-4 flex flex-col gap-5 lg:mx-10">
      <div className="flex items-start justify-between">
        <Button className="gap-2" onClick={() => startGame()}>
          <Plus size={16} /> Start New Game
        </Button>
        <div className="from-primary to-secondary rounded-lg bg-linear-to-b px-5 py-4 text-center text-white">
          <div className="font-medium">Score</div>
          <div className="text-xl font-semibold">{data.user.score}</div>
        </div>
      </div>
      {data.activeSession && (
        <div className="flex flex-col gap-3">
          <div className="text-2xl font-semibold">Active Game</div>
          <div className="border-input flex h-[150px] w-full flex-col gap-4 rounded-lg border bg-[#F8F8F8] p-3 md:w-[250px]">
            <div className="flex flex-col gap-2">
              <div className="font-medium">Current Score</div>
              <div className="text-3xl font-semibold">
                {data.activeSession.score}
              </div>
            </div>
            <Link href={`/game/${data.activeSession.id}`} className="self-end">
              <Button className="w-fit gap-2 font-semibold">
                <ArrowRight size={16} />
                Resume
              </Button>
            </Link>
          </div>
        </div>
      )}
      {activeChallenges.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-2xl font-semibold">Friends</div>
          <div className="flex flex-wrap gap-3">
            {activeChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="border-input flex h-[150px] w-full flex-col gap-4 rounded-lg border bg-[#F8F8F8] p-3 md:w-[250px]"
              >
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold">{challenge.email}</div>
                  <div className="font-medium">Score</div>
                  <div className="text-3xl font-semibold">
                    {challenge.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {pendingChallengeInvites.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-2xl font-semibold">Pending Requests</div>
          <div className="flex flex-wrap gap-3">
            {pendingChallengeInvites.map((challenge) => (
              <div
                key={challenge.id}
                className="border-input flex w-full flex-col gap-4 rounded-lg border bg-[#F8F8F8] p-3 md:w-[250px]"
              >
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold">{challenge.email}</div>
                  <div className="font-medium">Score</div>
                  <div className="text-3xl font-semibold">
                    {challenge.score}
                  </div>
                </div>
                <Link href={`/challenge/${challenge.id}`} className="self-end">
                  <Button className="w-fit gap-2 font-semibold">
                    <ArrowRight size={16} />
                    Accept
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      {pendingChallengeRequests.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-2xl font-semibold">Outgoing Requests</div>
          <div className="flex flex-col gap-3">
            {pendingChallengeRequests.map((challenge) => (
              <div
                key={challenge.id}
                className="border-input flex w-full flex-col gap-4 rounded-lg border bg-[#F8F8F8] p-3 md:w-[250px]"
              >
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold">{challenge.email}</div>
                  <div className="font-medium">Score</div>
                  <div className="text-3xl font-semibold">
                    {challenge.score}
                  </div>
                </div>
                <Button
                  className="w-fit gap-2 self-end font-semibold"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_APP_URL}/challenge/${challenge.id}`,
                    );
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy size={16} />
                  Copy
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
