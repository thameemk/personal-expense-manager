import {TextField} from "@mui/material";
import {FormDialog} from "../../components/FormDialog.tsx";
import type {Group} from "../../lib/money.ts";

// Pass `group` to edit it instead of creating a new one.
export function GroupDialog({group, onSave, onClose}: {
    group?: Group; onSave: (g: { name: string; currency: string }) => void | Promise<void>; onClose: () => void
}) {
    return (
        <FormDialog title={group ? "Edit group" : "New group"} submitLabel={group ? "Save" : "Create"} onClose={onClose}
                    onSubmit={(f) => onSave({name: String(f.get("name")).trim(), currency: String(f.get("currency")).trim().toUpperCase()})}>
            <TextField name="name" label="Group name" defaultValue={group?.name} helperText="e.g. Home, Goa trip" required autoFocus/>
            <TextField name="currency" label="Currency" defaultValue={group?.currency ?? "INR"}
                       helperText={group ? "Only relabels amounts, nothing is converted" : "ISO code, e.g. INR, USD"} required
                       slotProps={{htmlInput: {maxLength: 3, minLength: 3}}}/>
        </FormDialog>
    );
}
