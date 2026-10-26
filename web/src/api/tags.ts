import {get} from "./client.ts";
import type {Tag} from "../lib/money.ts";

export const listTags = (token: string) => get<Tag[]>("/tags", token);
