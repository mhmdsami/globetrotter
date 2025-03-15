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
      username: string;
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
  username: string;
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
      username: string;
      email: string;
      score: number;
    };
  }>;
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
};
