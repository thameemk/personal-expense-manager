import {TextField} from "@mui/material";
import {FormDialog} from "../../components/FormDialog.tsx";
import type {Group} from "../../lib/money.ts";
import {uid} from "../../lib/util.ts";

export function NewGroupDialog({onSave, onClose}: { onSave: (g: Group) => void; onClose: () => void }) {
    return (
        <FormDialog title="New group" submitLabel="Create" onClose={onClose}
                    onSubmit={(f) => onSave({id: uid(), name: String(f.get("name")).trim()})}>
            <TextField name="name" label="Group name" helperText="e.g. Home, Goa trip" required autoFocus/>
        </FormDialog>
    );
}
