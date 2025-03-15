const QUERY_KEYS = {
  SIGN_IN: "sign_in",
  SIGN_UP: "sign_up",
  ME: "me",

  START_GAME: "start_game",
  GUESS_GAME: "guess_game",
  NEXT_GAME: "next_game",
  GAME_STATE: "game_state",
} as const;

const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: "__globetrotter_auth_token",
} as const;

export { LOCAL_STORAGE_KEYS, QUERY_KEYS };
