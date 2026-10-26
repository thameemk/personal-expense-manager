import {del, get, post, put, qs, type Page} from "./client.ts";
import type {Expense} from "../lib/money.ts";

// the API sends amount as a decimal string ("12.50"); the UI works in integer cents
type ApiExpense = { id: string; group_id: string; description: string; amount: string; date: string; tags: string[]; updated_at: string; group?: { name: string; currency: string } };
const toExpense = (e: ApiExpense): Expense => ({
    id: e.id, groupId: e.group_id, description: e.description,
    cents: Math.round(Number(e.amount) * 100), date: e.date, tags: e.tags, updatedAt: e.updated_at,
    group: e.group && {name: e.group.name, currency: e.group.currency},
});

export type ExpenseDraft = Omit<Expense, "id" | "updatedAt" | "group">;

export const listExpenses = (token: string, groupId: string | undefined, q: string, cursor?: string) =>
    get<Page<ApiExpense>>(`/expenses?${qs({group_id: groupId, q: q || undefined, include: groupId ? undefined : "group", cursor})}`, token)
        .then((p) => ({...p, items: p.items.map(toExpense)}));

export const createExpense = (token: string, d: ExpenseDraft) =>
    post<ApiExpense>("/expenses", {
        group_id: d.groupId, description: d.description, amount: (d.cents / 100).toFixed(2), date: d.date, tags: d.tags,
    }, token).then(toExpense);

export const updateExpense = (token: string, id: string, d: ExpenseDraft) =>
    put<ApiExpense>(`/expenses/${id}`, {
        description: d.description, amount: (d.cents / 100).toFixed(2), date: d.date, tags: d.tags,
    }, token).then(toExpense);

export const deleteExpense = (token: string, id: string) => del(`/expenses/${id}`, token);
