import {get, post, qs, type Page} from "./client.ts";
import type {Group} from "../lib/money.ts";

// the list API sends total_amount as a decimal string; the UI works in integer cents
type ApiGroup = { id: string; name: string; currency: string; total_amount?: string; expense_count?: number };
const toGroup = (g: ApiGroup): Group => ({
    id: g.id, name: g.name, currency: g.currency,
    cents: Math.round(Number(g.total_amount ?? 0) * 100), count: g.expense_count ?? 0,
});

export const listGroups = (token: string, cursor?: string) =>
    get<Page<ApiGroup>>(`/groups?${qs({cursor})}`, token)
        .then((p) => ({...p, items: p.items.map(toGroup)}));

export const createGroup = (token: string, name: string, currency: string) =>
    post<ApiGroup>("/groups", {name, currency}, token).then(toGroup);
