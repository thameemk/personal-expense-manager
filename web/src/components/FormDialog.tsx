import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useState, type FormEvent, type ReactNode} from "react";

// onSubmit may be async: the dialog stays open with the buttons disabled while it runs,
// and shows the error inline if it rejects. The caller closes the dialog on success.
export function FormDialog({title, submitLabel, onSubmit, onClose, children}: {
    title: string; submitLabel: string; onSubmit: (f: FormData) => void | Promise<void>; onClose: () => void;
    children: ReactNode;
}) {
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    async function submit(e: FormEvent<HTMLElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget as HTMLFormElement);
        setBusy(true);
        setErr("");
        try {
            await onSubmit(data);
        } catch (x) {
            setErr((x as Error).message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <Dialog open onClose={busy ? undefined : onClose} fullWidth maxWidth="xs"
                slotProps={{paper: {component: "form", onSubmit: submit}}}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent
                sx={{display: "flex", flexDirection: "column", gap: 2, pt: "8px !important"}}>
                {children}
                {err && <Alert severity="error">{err}</Alert>}
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={onClose} disabled={busy}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={busy}>{busy ? "Saving…" : submitLabel}</Button>
            </DialogActions>
        </Dialog>
    );
}
