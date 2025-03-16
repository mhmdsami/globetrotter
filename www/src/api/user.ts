import { LOCAL_STORAGE_KEYS } from "~/utils/keys";
import { API, ApiResponse } from "./config";

export const signInApi = async (credentials: {
  email: string;
  password: string;
}) => {
  const res = await fetch(
    API.BASE_URL + API.ENDPOINTS.USER.BASE_URL() + API.ENDPOINTS.USER.SIGN_IN(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    },
  );

  const data = (await res.json()) as ApiResponse<{
    token: string;
    user: {
      email: string;
      score: number;
    };
  }>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};

export const signUpApi = async (credentials: {
  email: string;
  password: string;
}) => {
  const res = await fetch(
    API.BASE_URL +
      API.ENDPOINTS.USER.BASE_URL() +
      API.ENDPOINTS.USER.REGISTER(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    },
  );

  const data = (await res.json()) as ApiResponse<{
    token: string;
    user: {
      email: string;
      score: number;
    };
  }>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};

export const getUserApi = async () => {
  const res = await fetch(
    API.BASE_URL + API.ENDPOINTS.USER.BASE_URL() + API.ENDPOINTS.USER.ME(),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)}`,
      },
    },
  );

  const data = (await res.json()) as ApiResponse<{
    user: {
      email: string;
      score: number;
    };
    activeSession?: {
      id: string;
      score: number;
      userId: string;
      isActive: boolean;
    };
    challenges: {
      createdChallenges: Array<{
        id: string;
        isAccepted: boolean;
        player: {
          email: string;
          score: number;
        };
      }>;
      receivedChallenges: Array<{
        id: string;
        isAccepted: boolean;
        creator: {
          email: string;
          score: number;
        };
      }>;
    };
  }>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};
