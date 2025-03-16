export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  ENDPOINTS: {
    USER: {
      BASE_URL: () => "/user",
      REGISTER: () => "/create",
      SIGN_IN: () => "/sign-in",
      ME: () => "/me",
    },
    GAME: {
      BASE_URL: () => "/game",
      START: () => "/start",
      NEXT: () => "/next",
      GUESS: () => "/guess",
      GAME_STATE: (gameSessionId: string) => `/current-state/${gameSessionId}`,
      END: () => "/end",
    },
    CHALLENGE: {
      BASE_URL: () => "/challenge",
      CREATE: () => "/create",
      GET: (id: string) => `/${id}`,
      ACCEPT: () => "/accept",
    },
  },
};

export type ApiResponse<T> =
  | { success: false; error: string }
  | { success: true; message: string; data: T };
