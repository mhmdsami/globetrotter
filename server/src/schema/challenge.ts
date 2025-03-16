import { z } from "zod";

export const CreateChallengeSchema = z.object({
  email: z.string({ message: "Email is required" }),
});

export const AcceptChallengeSchema = z.object({
  challengeId: z.string({ message: "Challenge ID is required" }),
  email: z.string({ message: "Email is required" }),
  password: z.string().optional(),
});

export const GetChallengeSchema = z.object({
  challengeId: z.string({ message: "Challenge ID is required" }),
});
