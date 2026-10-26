import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import {AppBar, Box, Container, Drawer, IconButton, Toolbar, Typography} from "@mui/material";
import {useState, type ReactNode} from "react";

const WIDTH = 260;

// `sidebar` is a fixed left panel from md up, and a drawer behind a menu button below that.
export function AppShell({title, onBack, onProfile, sidebar, children}: {
    title: string; onBack?: () => void; onProfile?: () => void; sidebar: ReactNode; children: ReactNode;
}) {
    const [menu, setMenu] = useState(false);
    return (
        <Box sx={{display: "flex"}}>
            <Box component="nav" sx={{
                display: {xs: "none", md: "block"}, width: WIDTH, flexShrink: 0, position: "sticky", top: 0,
                height: "100vh", overflowY: "auto", bgcolor: "background.paper", borderRight: 1, borderColor: "divider"
            }}>{sidebar}</Box>
            <Drawer open={menu} onClose={() => setMenu(false)} sx={{display: {md: "none"}}}
                    slotProps={{paper: {sx: {width: WIDTH}}}}>
                <Box onClick={() => setMenu(false)}>{sidebar}</Box>
            </Drawer>
            <Box sx={{flex: 1, minWidth: 0}}>
                <AppBar position="sticky" elevation={0} color="inherit"
                        sx={{bgcolor: "background.paper", borderBottom: 1, borderColor: "divider"}}>
                    <Toolbar>
                        <IconButton edge="start" aria-label="Menu" onClick={() => setMenu(true)}
                                    sx={{mr: 1, display: {md: "none"}}}><MenuIcon/></IconButton>
                        {onBack && <IconButton edge="start" aria-label="Back" onClick={onBack} sx={{mr: 1}}><ArrowBackIcon/></IconButton>}
                        <Typography variant="h6" fontWeight={700} noWrap sx={{flexGrow: 1}}>{title}</Typography>
                        {onProfile &&
                            <IconButton aria-label="Profile" onClick={onProfile}><AccountCircleIcon/></IconButton>}
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md" sx={{py: 3}}>{children}</Container>
            </Box>
        </Box>
    );
}
