import { useMutation, useQueryClient } from "@tanstack/react-query";
import Lottie from "lottie-react";
import { useParams } from "next/navigation";
import { nextGameApi } from "~/api/game";
import correct from "~/assets/correct.json";
import incorrect from "~/assets/incorrect.json";
import { Button } from "~/components/button";
import { Dialog, DialogClose, DialogContent } from "~/components/dialog";
import { QUERY_KEYS } from "~/utils/keys";
import { withToast } from "~/utils/with-toast";

const correctGuesses = [
  "You nailed it! That's the right spot!",
  "Well done! You've got it right!",
  "Spot on! You guessed it correctly!",
  "Bingo! That's the place you were looking for!",
  "Correct! You found the right answer!",
  "You hit the jackpot! That's the correct location!",
  "Nice work! That's exactly where it should be!",
  "You got it! Right on target!",
  "Perfect! You guessed the exact spot!",
  "Bullseye! That's the correct place!",
];

const incorrectGuesses = [
  "Oops, not quite! Try again!",
  "Not quite! That's not the right place.",
  "Incorrect! But you're getting closer!",
  "Almost there! This isn't the right one though.",
  "Nope! But keep going, you're not far off!",
  "Not quite, but don't give up yet!",
  "That's not it! Try again and see if you can get it right!",
  "So close! But this is the wrong spot.",
  "Incorrect! But you're almost there!",
  "That's not it! Keep trying, you're almost there!",
];

interface ResultModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCorrect: boolean;
  canContinue: boolean;
}

export default function ResultModal({
  isOpen,
  setIsOpen,
  isCorrect,
  canContinue,
}: ResultModalProps) {
  const { sessionId } = useParams<{ sessionId: string }>();

  const queryClient = useQueryClient();

  const { mutate: nextGame } = useMutation({
    mutationKey: [QUERY_KEYS.NEXT_GAME],
    mutationFn: async () => {
      await withToast(nextGameApi(sessionId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GAME_STATE, sessionId],
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        {isCorrect ? (
          <div>
            <div className="text-center text-2xl font-bold">Correct!</div>
            <Lottie animationData={correct} className="mx-auto h-20 w-20" />
            <p className="text-center text-lg">
              {
                correctGuesses[
                  Math.floor(Math.random() * correctGuesses.length)
                ]
              }
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center text-2xl font-bold">Incorrect!</div>
            <Lottie animationData={incorrect} className="mx-auto h-16 w-16" />
            <p className="text-center text-lg">
              {
                incorrectGuesses[
                  Math.floor(Math.random() * incorrectGuesses.length)
                ]
              }
            </p>
          </div>
        )}
        <div className="flex w-full gap-3">
          {canContinue && (
            <DialogClose asChild>
              <Button className="grow">Try again</Button>
            </DialogClose>
          )}
          <DialogClose asChild>
            <Button className="grow" onClick={() => nextGame()}>
              Next Game
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
