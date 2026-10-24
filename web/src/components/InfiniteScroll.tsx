import {Box, Button, CircularProgress, Typography} from "@mui/material";
import {useEffect, useRef} from "react";

// Sentinel rendered after a list: calls onMore whenever it is in view. `count` re-arms the
// observer after each page, so a page that doesn't fill the screen keeps loading.
export function InfiniteScroll({onMore, onRetry, hasMore, count, error}: {
    onMore: () => void; onRetry: () => void; hasMore: boolean; count: number; error?: string;
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
    return hasMore ? <Box ref={ref} sx={{display: "flex", justifyContent: "center", py: 2}}><CircularProgress
        size={24}/></Box> : null;
}
