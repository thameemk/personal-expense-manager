import {Stack, Typography} from "@mui/material";
import {type ReactNode} from "react";

export function Empty({icon, text}: { icon: ReactNode; text: string }) {
    return (
        <Stack alignItems="center" spacing={1} sx={{py: 5, color: "text.disabled"}}>
            {icon}
            <Typography color="text.secondary">{text}</Typography>
        </Stack>
    );
}
