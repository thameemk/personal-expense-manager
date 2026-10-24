import {get, post} from "./client.ts";

export const register = (display_name: string, email: string, password: string) =>
    post("/users", {display_name, email, password});
export const login = (email: string, password: string) =>
    post<{ access_token: string }>("/auth/login", {email, password}).then((r) => r.access_token);
export const logout = (token: string) => post("/auth/logout", {}, token);

export type User = { id: string; display_name: string | null; email: string };
export const me = (token: string) => get<User>("/users/me", token);
