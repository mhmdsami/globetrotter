"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Lottie from "lottie-react";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { acceptChallengeApi, getChallengeApi } from "~/api/challenge";
import { getUserApi } from "~/api/user";
import paperPlane from "~/assets/paper-plane.json";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { LOCAL_STORAGE_KEYS, QUERY_KEYS } from "~/utils/keys";
import { withToast } from "~/utils/with-toast";

export default function AcceptChallenge() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.ACCEPT_CHALLENGE, id],
    queryFn: async () => {
      return await withToast(getChallengeApi(id));
    },
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN));
  }, [data]);

  const { data: me } = useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: async () => {
      return await withToast(getUserApi());
    },
    enabled: isLoggedIn,
  });

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (data && !data.player.requirePasswordChange && !isLoggedIn) {
      router.push(
        `/sign-in?redirectTo=${encodeURIComponent(`/challenge/${id}`)}`,
      );
    }
  }, [data]);

  useEffect(() => {}, [me]);

  const { mutate: acceptChallenge, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.ACCEPT_CHALLENGE],
    mutationFn: async (password?: string) => {
      if (!data?.player.email) return;

      return await withToast(
        acceptChallengeApi({
          challengeId: id,
          email: data.player.email,
          password,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Challenge accepted");
      router.push("/dashboard");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
    },
  });

  const form = useForm({
    resolver: (values, ctx, options) =>
      zodResolver(
        ctx?.requirePasswordChange
          ? z.object({
              password: z
                .string({ message: "Password is required" })
                .min(8, { message: "Password must be at least 8 characters" }),
            })
          : z.object({
              password: z.string().optional(),
            }),
      )(values, ctx, options),
    context: {
      requirePasswordChange: data?.player.requirePasswordChange ?? false,
    },
  });

  if (!data) return null;

  return (
    <div className="flex grow -translate-y-20 flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-2">
        <div className="from-primary to-secondary rounded-lg bg-linear-to-b px-4 py-5 text-center text-white">
          <div className="text-xs font-medium">Your Score</div>
          <div className="text-2xl font-semibold">{data.player.score}</div>
        </div>
        <div className="from-primary to-secondary rounded-lg bg-linear-to-b px-4 py-5 text-center text-white">
          <div className="text-xs font-medium">Their Score</div>
          <div className="text-2xl font-semibold">{data.creator.score}</div>
        </div>
      </div>
      <Lottie animationData={paperPlane} className="w-[200px]" />
      <div className="flex flex-col items-center gap-3">
        <div className="text-xl">
          <span className="font-semibold">{data.creator.email}</span> has
          challenged you
        </div>
        <div className="flex w-[300px] flex-col gap-3">
          {data.player.requirePasswordChange && (
            <Input
              name="password"
              placeholder="Set a password"
              type="password"
              register={form.register}
              errorMessage={
                typeof form.formState.errors.password?.message === "string"
                  ? form.formState.errors.password?.message
                  : ""
              }
            />
          )}
          {data.isAccepted ? (
            <Button disabled>Challenge Accepted</Button>
          ) : (
            <Button
              onClick={form.handleSubmit((data) =>
                acceptChallenge(data.password),
              )}
              disabled={
                isPending || (me && me.user.email !== data.player.email)
              }
            >
              {isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Accept Challenge"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
