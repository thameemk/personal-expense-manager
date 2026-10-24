const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

async function request<T>(method: string, path: string, body?: unknown, token?: string): Promise<T> {
    const res = await fetch(BASE + path, {
        method,
        headers: {"Content-Type": "application/json", ...(token && {Authorization: `Bearer ${token}`})},
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.detail ?? "Request failed");
    return res.status === 204 ? (undefined as T) : res.json();
}

export const post = <T>(path: string, body: unknown, token?: string) => request<T>("POST", path, body, token);
export const get = <T>(path: string, token: string) => request<T>("GET", path, undefined, token);
