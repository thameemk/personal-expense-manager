import {InputAdornment, TextField} from "@mui/material";
import {FormDialog} from "../../components/FormDialog.tsx";
import type {Expense} from "../../lib/money.ts";
import {today, uid} from "../../lib/util.ts";

export function AddExpenseDialog({groupId, onSave, onClose}: {
    groupId: string;
    onSave: (e: Expense) => void;
    onClose: () => void
}) {
    return (
        <FormDialog title="Add expense" submitLabel="Save" onClose={onClose}
                    onSubmit={(f) => onSave({
                        id: uid(), groupId, description: String(f.get("desc")).trim(),
                        cents: Math.round(Number(f.get("amount")) * 100), date: String(f.get("date")),
                    })}>
            <TextField name="desc" label="Description" required autoFocus/>
            <TextField name="amount" label="Amount" type="number" required
                       slotProps={{
                           htmlInput: {min: 0.01, step: 0.01, inputMode: "decimal"},
                           input: {startAdornment: <InputAdornment position="start">₹</InputAdornment>}
                       }}/>
            <TextField name="date" label="Date" type="date" defaultValue={today()} required
                       slotProps={{inputLabel: {shrink: true}}}/>
        </FormDialog>
    );
}
