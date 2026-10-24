import {Box, Button, CircularProgress, Typography} from "@mui/material";
import {useEffect, useRef} from "react";

// Sentinel rendered after a list: calls onMore whenever it is in view. `count` re-arms the
// observer after each page, so a page that doesn't fill the screen keeps loading.
export function InfiniteScroll({onMore, onRetry, hasMore, loading, count, error}: {
    onMore: () => void; onRetry: () => void; hasMore: boolean; loading: boolean; count: number; error?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!hasMore || !ref.current) return;
        const io = new IntersectionObserver(([e]) => e.isIntersecting && onMore(), {rootMargin: "200px"});
        io.observe(ref.current);
        return () => io.disconnect();
    }, [hasMore, count, onMore]);
    if (error)
        return (
            <Box sx={{textAlign: "center", py: 2}}>
                <Typography color="error" variant="body2">{error}</Typography>
                <Button size="small" onClick={onRetry}>Retry</Button>
            </Box>
        );
    // the button is the keyboard / screen-reader alternative to scrolling
    return hasMore ? (
        <Box ref={ref} sx={{display: "flex", justifyContent: "center", py: 2}}>
            {loading ? <CircularProgress size={24} aria-label="Loading"/> : <Button onClick={onMore}>Load more</Button>}
        </Box>
    ) : null;
}
