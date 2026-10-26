import {get} from "./client.ts";

export const listTags = (token: string) => get<string[]>("/tags", token);
