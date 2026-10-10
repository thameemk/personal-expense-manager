import { apiRequest } from "./client";

type AuthCredentials = {
  email: string;
  password: string;
};

type Registration = AuthCredentials & {
  display_name: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export function registerUser(payload: Registration) {
  return apiRequest<{ id: string; display_name: string | null; email: string; is_active: boolean }>(
    "/users",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function loginUser(payload: AuthCredentials) {
  return apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
