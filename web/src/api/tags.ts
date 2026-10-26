import {get, post, put} from "./client.ts";
import type {Tag} from "../lib/money.ts";

export const listTags = (token: string) => get<Tag[]>("/tags", token);

export const createTag = (token: string, name: string) => post<Tag>("/tags", {name}, token);

export const renameTag = (token: string, id: string, name: string) => put<Tag>(`/tags/${id}`, {name}, token);
