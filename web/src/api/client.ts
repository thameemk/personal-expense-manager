const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

// Called when an authenticated request gets a 401 (session expired or revoked).
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn: () => void) => {
    onUnauthorized = fn;
};

// FastAPI sends `detail` as a string, or for 422 as a list of {msg}; show it as plain text.
function message(detail: unknown): string {
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail))
        return detail.map((d) => String(d?.msg ?? d).replace(/^Value error, /, "")).join("; ");
    return "Request failed";
}

async function request<T>(method: string, path: string, body?: unknown, token?: string): Promise<T> {
    const res = await fetch(BASE + path, {
        method,
        headers: {"Content-Type": "application/json", ...(token && {Authorization: `Bearer ${token}`})},
        body: body === undefined ? undefined : JSON.stringify(body),
    }).catch(() => {
        throw new Error("Can't reach the server");
    });
    if (res.status === 401 && token) onUnauthorized();
    if (!res.ok) throw new Error(message((await res.json().catch(() => null))?.detail));
    return res.status === 204 ? (undefined as T) : res.json();
}

export const post = <T>(path: string, body: unknown, token?: string) => request<T>("POST", path, body, token);
export const get = <T>(path: string, token: string) => request<T>("GET", path, undefined, token);
export const del = (path: string, token: string) => request<void>("DELETE", path, undefined, token);

export type Page<T> = { items: T[]; next_cursor: string | null };

// query string without the undefined values
export const qs = (params: Record<string, string | undefined>) =>
    new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => e[1] !== undefined)).toString();
