export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  ENDPOINTS: {
    USER: {
      BASE_URL: () => "/user",
      REGISTER: () => "/create",
      SIGN_IN: () => "/sign-in",
      ME: () => "/me",
    },
  },
};

export type ApiResponse<T> =
  | { success: false; error: string }
  | { success: true; message: string; data: T };
