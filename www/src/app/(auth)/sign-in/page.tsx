"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInApi } from "~/api/user";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { LOCAL_STORAGE_KEYS, QUERY_KEYS } from "~/utils/keys";
import { withToast } from "~/utils/with-toast";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(
      z.object({
        email: z
          .string({ message: "Email is required" })
          .email({ message: "Enter a valid email" }),
        password: z.string({ message: "Password is required" }),
      }),
    ),
  });

  const { mutate: signIn } = useMutation({
    mutationKey: [QUERY_KEYS.SIGN_IN],
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await withToast(signInApi(credentials));
    },
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, data.token);
      const redirectTo = searchParams.get("redirectTo");
      if (redirectTo) {
        return router.push(redirectTo);
      }

      router.push("/dashboard");
    },
  });

  return (
    <div className="flex flex-col gap-3">
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
      <Button onClick={form.handleSubmit((data) => signIn(data))}>
        Sign In
      </Button>
      <div className="text-sm">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
