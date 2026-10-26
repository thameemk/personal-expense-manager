import {del, get, patch, post} from "./client.ts";
import type {Tag} from "../lib/money.ts";

export const listTags = (token: string) => get<Tag[]>("/tags", token);

export const createTag = (token: string, name: string) => post<Tag>("/tags", {name}, token);

export const updateTag = (token: string, id: string, name: string) => patch<Tag>(`/tags/${id}`, {name}, token);

export const deleteTag = (token: string, id: string) => del(`/tags/${id}`, token);
