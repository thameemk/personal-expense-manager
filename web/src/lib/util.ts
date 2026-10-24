export const uid = () => crypto.randomUUID();
export const today = () => new Date().toISOString().slice(0, 10);
export const day = (d: string) => new Date(d + "T00:00").toLocaleDateString(undefined, {
    day: "numeric",
    month: "short"
});
export const PALETTE = ["#6366f1", "#0ea5e9", "#14b8a6", "#f59e0b", "#ec4899", "#8b5cf6", "#f97316", "#22c55e"];
export const colorOf = (s: string) => PALETTE[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
