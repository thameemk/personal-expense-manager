export type Expense = { id: string; groupId: string; description: string; cents: number; date: string };

export type Group = { id: string; name: string; currency: string };

export const fmt = (cents: number, currency = "INR") =>
    (cents / 100).toLocaleString(undefined, {style: "currency", currency});

export const total = (expenses: Expense[], groupId?: string) =>
    expenses.reduce((s, e) => s + (groupId && e.groupId !== groupId ? 0 : e.cents), 0);
