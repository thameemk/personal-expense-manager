import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import type {FormEvent, ReactNode} from "react";

export function FormDialog({title, submitLabel, onSubmit, onClose, children}: {
    title: string; submitLabel: string; onSubmit: (f: FormData) => void; onClose: () => void; children: ReactNode;
}) {
    function submit(e: FormEvent<HTMLElement>) {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget as HTMLFormElement));
    }

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="xs"
                slotProps={{paper: {component: "form", onSubmit: submit}}}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent
                sx={{display: "flex", flexDirection: "column", gap: 2, pt: "8px !important"}}>{children}</DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">{submitLabel}</Button>
            </DialogActions>
        </Dialog>
    );
}
