import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {AppBar, Container, IconButton, Toolbar, Typography} from "@mui/material";
import type {ReactNode} from "react";

export function AppShell({title, onBack, onProfile, children}: {
    title: string; onBack?: () => void; onProfile?: () => void; children: ReactNode;
}) {
    return (
        <>
            <AppBar position="sticky" elevation={0} color="inherit"
                    sx={{bgcolor: "background.paper", borderBottom: 1, borderColor: "divider"}}>
                <Toolbar>
                    {onBack && <IconButton edge="start" aria-label="Back" onClick={onBack} sx={{mr: 1}}><ArrowBackIcon/></IconButton>}
                    <Typography variant="h6" fontWeight={700} noWrap sx={{flexGrow: 1}}>{title}</Typography>
                    {onProfile &&
                        <IconButton aria-label="Profile" onClick={onProfile}><AccountCircleIcon/></IconButton>}
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" sx={{py: 3}}>{children}</Container>
        </>
    );
}
