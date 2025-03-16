import { LOCAL_STORAGE_KEYS } from "~/utils/keys";
import { API, ApiResponse } from "./config";

export const startGameApi = async () => {
  const res = await fetch(
    API.BASE_URL + API.ENDPOINTS.GAME.BASE_URL() + API.ENDPOINTS.GAME.START(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)}`,
      },
    },
  );

  const data = (await res.json()) as ApiResponse<{
    gameSession: {
      id: string;
      score: number;
      isActive: boolean;
    };
    game: {
      id: string;
      clue: string;
      funFact: string;
      trivia: string;
    };
  }>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};

export const guessApi = async (gameGuess: {
  gameSessionId: string;
  gameId: string;
  guess: string;
}) => {
  const res = await fetch(
    API.BASE_URL + API.ENDPOINTS.GAME.BASE_URL() + API.ENDPOINTS.GAME.GUESS(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)}`,
      },
      body: JSON.stringify(gameGuess),
    },
  );

  const data = (await res.json()) as ApiResponse<{
    gameSession: {
      id: string;
      score: number;
      isActive: boolean;
    };
    isCorrect: boolean;
  }>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};

export const nextGameApi = async (gameSessionId: string) => {
  const res = await fetch(
    API.BASE_URL + API.ENDPOINTS.GAME.BASE_URL() + API.ENDPOINTS.GAME.NEXT(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)}`,
      },
      body: JSON.stringify({ gameSessionId }),
    },
  );

  const data = (await res.json()) as ApiResponse<{
    gameSession: {
      id: string;
      score: number;
      isActive: boolean;
    };
  }>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};

export const getGameStateApi = async (gameSessionId: string) => {
  const res = await fetch(
    API.BASE_URL +
      API.ENDPOINTS.GAME.BASE_URL() +
      API.ENDPOINTS.GAME.GAME_STATE(gameSessionId),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)}`,
      },
    },
  );

  const data = (await res.json()) as ApiResponse<{
    gameSession: {
      id: string;
      score: number;
      isActive: boolean;
    };
    game: {
      id: string;
      guessCount: number;
      isCorrect: boolean;
      canContinue: boolean;
      clues: string[];
      funFacts: string[];
      trivia: string[];
    };
  }>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};

export const endGameApi = async () => {
  const res = await fetch(
    API.BASE_URL + API.ENDPOINTS.GAME.BASE_URL() + API.ENDPOINTS.GAME.END(),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)}`,
      },
    },
  );

  const data = (await res.json()) as ApiResponse<never>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return true;
};
