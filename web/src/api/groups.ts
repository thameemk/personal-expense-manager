import {get, post, qs, type Page} from "./client.ts";
import type {Group} from "../lib/money.ts";

export const listGroups = (token: string, cursor?: string) =>
    get<Page<Group>>(`/groups?${qs({cursor})}`, token);

export const createGroup = (token: string, name: string, currency: string) =>
    post<Group>("/groups", {name, currency}, token);
