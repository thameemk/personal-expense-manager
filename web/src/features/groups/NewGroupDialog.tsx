import {TextField} from "@mui/material";
import {FormDialog} from "../../components/FormDialog.tsx";

export function NewGroupDialog({onSave, onClose}: { onSave: (g: { name: string; currency: string }) => void; onClose: () => void }) {
    return (
        <FormDialog title="New group" submitLabel="Create" onClose={onClose}
                    onSubmit={(f) => onSave({name: String(f.get("name")).trim(), currency: String(f.get("currency")).trim().toUpperCase()})}>
            <TextField name="name" label="Group name" helperText="e.g. Home, Goa trip" required autoFocus/>
            <TextField name="currency" label="Currency" defaultValue="INR" helperText="ISO code, e.g. INR, USD" required
                       slotProps={{htmlInput: {maxLength: 3, minLength: 3}}}/>
        </FormDialog>
    );
}
