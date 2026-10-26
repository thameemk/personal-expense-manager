import {TextField} from "@mui/material";
import {FormDialog} from "../../components/FormDialog.tsx";
import type {Tag} from "../../lib/money.ts";

// Pass `tag` to rename it instead of adding a new one.
export function TagDialog({tag, onSave, onClose}: {
    tag?: Tag; onSave: (name: string) => void | Promise<void>; onClose: () => void
}) {
    return (
        <FormDialog title={tag ? "Rename tag" : "New tag"} submitLabel="Save" onClose={onClose}
                    onSubmit={(f) => onSave(String(f.get("name")).trim())}>
            <TextField name="name" label="Tag name" defaultValue={tag?.name} required autoFocus
                       slotProps={{htmlInput: {maxLength: 30}}}/>
        </FormDialog>
    );
}
