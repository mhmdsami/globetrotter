"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpApi } from "~/api/user";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { LOCAL_STORAGE_KEYS, QUERY_KEYS } from "~/utils/keys";
import { withToast } from "~/utils/with-toast";

export default function SignIn() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(
      z.object({
        username: z
          .string({ message: "Username is required" })
          .min(3, { message: "Username must be at least 3 characters" }),
        email: z
          .string({ message: "Email is required" })
          .email({ message: "Enter a valid email" }),
        password: z
          .string({ message: "Password is required" })
          .min(8, { message: "Password must be at least 8 characters" }),
      }),
    ),
  });

  const { mutate: signUp } = useMutation({
    mutationKey: [QUERY_KEYS.SIGN_UP],
    mutationFn: async (credentials: {
      username: string;
      email: string;
      password: string;
    }) => {
      return await withToast(signUpApi(credentials), {
        success: "Account created successfully",
      });
    },
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, data.token);
      router.push("/dashboard");
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <Input
        name="username"
        label="Username"
        register={form.register}
        errorMessage={form.formState.errors.username?.message}
      />
      <Input
        name="email"
        label="Email"
        type="email"
        register={form.register}
        errorMessage={form.formState.errors.email?.message}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        register={form.register}
        errorMessage={form.formState.errors.password?.message}
      />
      <Button onClick={form.handleSubmit((data) => signUp(data))}>
        Sign Up
      </Button>
      <div className="text-sm">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
