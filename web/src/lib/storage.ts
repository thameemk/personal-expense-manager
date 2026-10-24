import {useEffect, useState} from "react";

// small values (the session token) kept in localStorage
export function useStored<T>(key: string, init: T) {
    const [v, set] = useState<T>(() => JSON.parse(localStorage.getItem(key) ?? "null") ?? init);
    useEffect(() => localStorage.setItem(key, JSON.stringify(v)), [key, v]);
    return [v, set] as const;
}
