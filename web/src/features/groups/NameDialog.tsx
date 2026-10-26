import {TextField} from "@mui/material";
import {FormDialog} from "../../components/FormDialog.tsx";

// One-field dialog for naming or renaming a tag or group. Pass `name` to rename.
export function NameDialog({title, label, name, maxLength, onSave, onDelete, onClose}: {
    title: string; label: string; name?: string; maxLength: number;
    onSave: (name: string) => void | Promise<void>; onDelete?: () => void | Promise<void>; onClose: () => void
}) {
    return (
        <FormDialog title={title} submitLabel="Save" onClose={onClose} onDelete={onDelete}
                    onSubmit={(f) => onSave(String(f.get("name")).trim())}>
            <TextField name="name" label={label} defaultValue={name} required autoFocus
                       slotProps={{htmlInput: {maxLength}}}/>
        </FormDialog>
    );
}
