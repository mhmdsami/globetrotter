"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";
import { animate } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { endGameApi, getGameStateApi, guessApi } from "~/api/game";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { QUERY_KEYS } from "~/utils/keys";
import { withToast } from "~/utils/with-toast";
import ClueCard from "../../dashboard/components/clue-card";
import ResultModal from "./components/result-modal";

export default function GameSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const { data: gameState } = useQuery({
    queryKey: [QUERY_KEYS.GAME_STATE, sessionId],
    queryFn: async () => {
      return await getGameStateApi(sessionId);
    },
  });

  useEffect(() => {
    const controls = animate(score, gameState?.gameSession.score ?? score, {
      ease: "easeInOut",
      duration: 1,
      onUpdate(value) {
        if (ref.current) ref.current.textContent = value.toFixed(0);
      },
    });

    setScore(gameState?.gameSession.score ?? score);

    return () => controls.stop();
  }, [gameState?.gameSession.score]);

  const form = useForm({
    defaultValues: {
      guess: "",
    },
    resolver: zodResolver(
      z.object({
        guess: z.string({ message: "Guess is required" }),
      }),
    ),
  });

  const { mutate: guess, isPending: isGuessing } = useMutation({
    mutationKey: [QUERY_KEYS.GUESS_GAME],
    mutationFn: async (data: {
      gameSessionId: string;
      gameId: string;
      guess: string;
    }) => {
      return await withToast(guessApi(data));
    },
    onSuccess: (data) => {
      queryClient
        .invalidateQueries({
          queryKey: [QUERY_KEYS.GAME_STATE, sessionId],
        })
        .then(() => {
          setShowModal(true);
        });

      if (data.isCorrect) showConfetti();
      form.reset();
    },
  });

  const { mutate: endGame, isPending: isEnding } = useMutation({
    mutationKey: [QUERY_KEYS.GUESS_GAME],
    mutationFn: async () => {
      return await withToast(endGameApi());
    },
    onSuccess: () => {
      router.push("/dashboard");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
    },
  });

  const showConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  if (!gameState) {
    return null;
  }

  return (
    <>
      <ResultModal
        {...gameState.game}
        isOpen={showModal}
        setIsOpen={setShowModal}
      />
      <div className="from-primary to-secondary absolute top-20 right-0 mx-4 rounded-lg bg-linear-to-b px-5 py-4 text-center text-white md:top-24 lg:mx-10">
        <div className="font-medium">Score</div>
        <div className="text-3xl font-semibold" ref={ref}>
          {score}
        </div>
      </div>
      <div className="mx-auto flex grow flex-col items-center justify-center gap-10">
        <div className="flex gap-5">
          {gameState.game.clues.map((clue, idx) => (
            <ClueCard key={`${gameState.game.id}-${idx}`} clue={clue} />
          ))}
        </div>
        <div className="mx-auto flex w-[300px] flex-col gap-3">
          {gameState.game.guessCount < 2 && (
            <>
              <Input
                name="guess"
                placeholder="Make a Guess"
                autoComplete="off"
                register={form.register}
              />
              <Button
                disabled={isGuessing || isGuessing}
                onClick={form.handleSubmit((data) => {
                  guess({
                    gameSessionId: gameState.gameSession.id,
                    gameId: gameState.game.id,
                    guess: data.guess,
                  });
                })}
              >
                {isGuessing ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  "Guess"
                )}
              </Button>
              <Button
                disabled={isGuessing || isGuessing}
                variant="outline"
                onClick={() => endGame()}
              >
                End Game
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
