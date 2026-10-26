import {Box, Card, Typography} from "@mui/material";
import {type ReactNode} from "react";

export function Section({title, children}: { title: string; children: ReactNode }) {
    return (
        <Box sx={{mb: 2}}>
            <Typography variant="overline" color="text.secondary" sx={{ml: 1}}>{title}</Typography>
            <Card>{children}</Card>
        </Box>
    );
}
