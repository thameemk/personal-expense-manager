import {Box, CircularProgress, Typography} from "@mui/material";
import {useEffect, useRef} from "react";

// Sentinel rendered after a list: calls onMore whenever it is in view. `count` re-arms the
// observer after each page, so a page that doesn't fill the screen keeps loading.
export function InfiniteScroll({onMore, hasMore, count, error}: {
    onMore: () => void; hasMore: boolean; count: number; error?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!hasMore || !ref.current) return;
        const io = new IntersectionObserver(([e]) => e.isIntersecting && onMore(), {rootMargin: "200px"});
        io.observe(ref.current);
        return () => io.disconnect();
    }, [hasMore, count, onMore]);
    if (error) return <Typography color="error" variant="body2" sx={{textAlign: "center", py: 2}}>{error}</Typography>;
    return hasMore ? <Box ref={ref} sx={{display: "flex", justifyContent: "center", py: 2}}><CircularProgress
        size={24}/></Box> : null;
}
