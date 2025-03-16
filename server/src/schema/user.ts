import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z
    .string({ message: "Email is a required field " })
    .email({ message: "Email must be a valid email address" }),
  password: z.string({ message: "Password is a required field " }).min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const SignInUserSchema = z.object({
  email: z
    .string({ message: "Email is a required field " })
    .email({ message: "Email must be a valid email address" }),
  password: z.string({ message: "Password is a required field " }),
});

export const UpdateUserSchema = CreateUserSchema.pick({
  password: true,
});
