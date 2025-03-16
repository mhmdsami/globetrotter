import { LOCAL_STORAGE_KEYS } from "~/utils/keys";
import { API, ApiResponse } from "./config";

export const getChallengeApi = async (id: string) => {
  const res = await fetch(
    API.BASE_URL +
      API.ENDPOINTS.CHALLENGE.BASE_URL() +
      API.ENDPOINTS.CHALLENGE.GET(id),
  );

  const data = (await res.json()) as ApiResponse<{
    id: string;
    isAccepted: boolean;
    creator: {
      email: string;
      score: number;
    };
    player: {
      email: string;
      score: number;
      requirePasswordChange: boolean;
    };
  }>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};

export const createChallengeApi = async (email: string) => {
  const res = await fetch(
    API.BASE_URL +
      API.ENDPOINTS.CHALLENGE.BASE_URL() +
      API.ENDPOINTS.CHALLENGE.CREATE(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)}`,
      },
      body: JSON.stringify({ email }),
    },
  );

  const data = (await res.json()) as ApiResponse<{
    id: string;
    creatorId: string;
    playerId: string | null;
  }>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};

export const acceptChallengeApi = async (player: {
  challengeId: string;
  email: string;
  password?: string;
}) => {
  const res = await fetch(
    API.BASE_URL +
      API.ENDPOINTS.CHALLENGE.BASE_URL() +
      API.ENDPOINTS.CHALLENGE.ACCEPT(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    },
  );

  const data = (await res.json()) as ApiResponse<null>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};
