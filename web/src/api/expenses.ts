import {del, get, post, qs, type Page} from "./client.ts";
import type {Expense} from "../lib/money.ts";

// the API sends amount as a decimal string ("12.50"); the UI works in integer cents
type ApiExpense = { id: string; group_id: string; description: string; amount: string; date: string };
const toExpense = (e: ApiExpense): Expense => ({
    id: e.id, groupId: e.group_id, description: e.description,
    cents: Math.round(Number(e.amount) * 100), date: e.date,
});

export type ExpenseDraft = Omit<Expense, "id">;

export const listExpenses = (token: string, groupId: string, cursor?: string) =>
    get<Page<ApiExpense>>(`/expenses?${qs({group_id: groupId, cursor})}`, token)
        .then((p) => ({...p, items: p.items.map(toExpense)}));

export const createExpense = (token: string, d: ExpenseDraft) =>
    post<ApiExpense>("/expenses", {
        group_id: d.groupId, description: d.description, amount: (d.cents / 100).toFixed(2), date: d.date,
    }, token).then(toExpense);


export const deleteExpense = (token: string, id: string) => del(`/expenses/${id}`, token);
