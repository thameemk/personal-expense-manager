import {useCallback, useEffect, useRef, useState} from "react";
import type {Page} from "../api/client.ts";

// Cursor-paginated list for infinite scroll. `key` identifies the list (null = disabled);
// changing it resets and loads the first page. Call `loadMore` when the end comes into view.
export function usePaged<T extends {
    id: string
}>(fetchPage: (cursor?: string) => Promise<Page<T>>, key: string | null) {
    const [items, setItems] = useState<T[]>([]);
    const [hasMore, setHasMore] = useState(key !== null);
    const [loading, setLoading] = useState(key !== null);
    const [error, setError] = useState("");
    const [prevKey, setPrevKey] = useState(key);
    const fetchRef = useRef(fetchPage);
    const next = useRef<string>(undefined);
    const done = useRef(true);
    const busy = useRef(false);
    const gen = useRef(0); // ignores responses that belong to a previous key

    // new list: drop the old state during render, so no stale rows are ever painted
    if (key !== prevKey) {
        setPrevKey(key);
        setItems([]);
        setError("");
        setHasMore(key !== null);
        setLoading(key !== null);
    }

    useEffect(() => {
        fetchRef.current = fetchPage;
    });

    const loadMore = useCallback(() => {
        if (busy.current || done.current) return;
        busy.current = true;
        setLoading(true);
        const g = gen.current;
        fetchRef.current(next.current)
            .then((p) => {
                if (g !== gen.current) return;
                // skip rows already present (e.g. created locally while paging)
                setItems((prev) => {
                    const seen = new Set(prev.map((x) => x.id));
                    return [...prev, ...p.items.filter((x) => !seen.has(x.id))];
                });
                next.current = p.next_cursor ?? undefined;
                done.current = !p.next_cursor;
                setHasMore(!done.current);
            })
            .catch((e: Error) => {
                if (g !== gen.current) return;
                setError(e.message);
                done.current = true; // no automatic retry loop
                setHasMore(false);
            })
            .finally(() => {
                if (g !== gen.current) return;
                busy.current = false;
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        gen.current++;
        busy.current = false;
        next.current = undefined;
        done.current = key === null;
        loadMore();
    }, [key, loadMore]);

    // after a failed page: clear the error and try that page again
    const retry = useCallback(() => {
        setError("");
        done.current = false;
        setHasMore(true);
        loadMore();
    }, [loadMore]);

    return {items, setItems, hasMore, loading, error, loadMore, retry};
}
