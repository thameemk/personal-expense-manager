import {InputAdornment, TextField} from "@mui/material";
import {FormDialog} from "../../components/FormDialog.tsx";
import type {ExpenseDraft} from "../../api/expenses.ts";
import {today} from "../../lib/util.ts";

export function AddExpenseDialog({groupId, currency, onSave, onClose}: {
    groupId: string;
    currency: string;
    onSave: (e: ExpenseDraft) => void | Promise<void>;
    onClose: () => void
}) {
    return (
        <FormDialog title="Add expense" submitLabel="Save" onClose={onClose}
                    onSubmit={(f) => onSave({
                        groupId, description: String(f.get("desc")).trim(),
                        cents: Math.round(Number(f.get("amount")) * 100), date: String(f.get("date")),
                    })}>
            <TextField name="desc" label="Description" required autoFocus/>
            <TextField name="amount" label="Amount" type="number" required
                       slotProps={{
                           htmlInput: {min: 0.01, step: 0.01, inputMode: "decimal"},
                           input: {startAdornment: <InputAdornment position="start">{currency}</InputAdornment>}
                       }}/>
            <TextField name="date" label="Date" type="date" defaultValue={today()} required
                       slotProps={{inputLabel: {shrink: true}}}/>
        </FormDialog>
    );
}
