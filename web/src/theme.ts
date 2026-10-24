import {createTheme} from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {main: "#1f2937"}, // ink
        success: {main: "#059669"}, // you are owed
        error: {main: "#e11d48"}, // you owe
        background: {default: "#f7f7f5"},
        divider: "#e7e5e4",
    },
    shape: {borderRadius: 16},
    typography: {
        fontFamily: "Roboto, system-ui, sans-serif",
        button: {textTransform: "none", fontWeight: 500},
        overline: {fontWeight: 500, letterSpacing: 1},
    },
    components: {
        MuiCard: {defaultProps: {variant: "outlined"}},
        MuiTextField: {defaultProps: {variant: "outlined", size: "medium"}},
        MuiButton: {styleOverrides: {root: {borderRadius: 999}}},
        MuiFab: {styleOverrides: {root: {textTransform: "none", fontWeight: 500}}},
        MuiDialog: {styleOverrides: {paper: {borderRadius: 28}}},
    },
});
