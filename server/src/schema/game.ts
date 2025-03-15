import { z } from "zod";

export const GameGuessSchema = z.object({
  gameSessionId: z.string({ message: "Game session ID is required" }),
  gameId: z.string({ message: "Game ID is required" }),
  guess: z.string({ message: "Guess is required" }).nonempty({
    message: "Guess cannot be empty",
  }),
});

export const GetNextDestinationSchema = z.object({
  gameSessionId: z.string({ message: "Game session ID is required" }),
});

export const GetCurrentGameStateParamSchema = z.object({
  gameSessionId: z.string({ message: "Game session ID is required" }),
});
