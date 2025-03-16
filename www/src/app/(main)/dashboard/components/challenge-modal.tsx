"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Copy, Loader2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createChallengeApi } from "~/api/challenge";
import { getUserApi } from "~/api/user";
import { Button } from "~/components/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/dialog";
import { Input } from "~/components/input";
import { LOCAL_STORAGE_KEYS, QUERY_KEYS } from "~/utils/keys";
import { withToast } from "~/utils/with-toast";

export default function ChallengeModal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN));
  }, []);

  const { data: me } = useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: async () => {
      return await withToast(getUserApi());
    },
  });

  const {
    data,
    mutate: createChallenge,
    isPending: isCreatingChallenge,
  } = useMutation({
    mutationKey: [QUERY_KEYS.CREATE_CHALLENGE],
    mutationFn: async (email: string) => {
      return await withToast(createChallengeApi(email));
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(
      z.object({
        email: z
          .string({ message: "Email is required" })
          .email({ message: "Enter a valid email" }),
      }),
    ),
  });

  if (!isLoggedIn) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit self-end font-semibold">
          Challenge a Friend
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Input
          name="email"
          placeholder="Email"
          register={form.register}
          errorMessage={form.formState.errors.email?.message}
        />
        {!data && (
          <Button
            onClick={form.handleSubmit(({ email }) => createChallenge(email))}
          >
            {isCreatingChallenge ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "Challenge"
            )}
          </Button>
        )}
        {data && (
          <div className="flex items-center gap-2">
            <Input
              className="grow"
              name="challengeLink"
              value={`${process.env.NEXT_PUBLIC_APP_URL}/challenge/${data.id}`}
            />
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_APP_URL}/challenge/${data.id}`,
                );
                toast.success("Copied to clipboard");
              }}
            >
              <Copy size={16} />
            </Button>
            {me && (
              <Button variant="outline" asChild>
                <a
                  href={`https://wa.me?text=${encodeURIComponent(`I challenge you to the ultimate game!\n\n${process.env.NEXT_PUBLIC_APP_URL}/challenge/${data.id}`)}`}
                  target="_blank"
                >
                  <MessageCircle size={16} />
                </a>
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
