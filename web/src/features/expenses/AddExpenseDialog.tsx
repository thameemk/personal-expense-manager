import {InputAdornment, TextField} from "@mui/material";
import {FormDialog} from "../../components/FormDialog.tsx";
import type {ExpenseDraft} from "../../api/expenses.ts";
import type {Expense} from "../../lib/money.ts";
import {today} from "../../lib/util.ts";

// Pass `expense` to edit it instead of adding a new one.
export function AddExpenseDialog({groupId, currency, expense, onSave, onClose}: {
    groupId: string;
    expense?: Expense;
    currency: string;
    onSave: (e: ExpenseDraft) => void | Promise<void>;
    onClose: () => void
}) {
    return (
        <FormDialog title={expense ? "Edit expense" : "Add expense"} submitLabel="Save" onClose={onClose}
                    onSubmit={(f) => onSave({
                        groupId, description: String(f.get("desc")).trim(),
                        cents: Math.round(Number(f.get("amount")) * 100), date: String(f.get("date")),
                    })}>
            <TextField name="desc" label="Description" defaultValue={expense?.description} required autoFocus/>
            <TextField name="amount" label="Amount" type="number" defaultValue={expense && expense.cents / 100} required
                       slotProps={{
                           htmlInput: {min: 0.01, step: 0.01, inputMode: "decimal"},
                           input: {startAdornment: <InputAdornment position="start">{currency}</InputAdornment>}
                       }}/>
            <TextField name="date" label="Date" type="date" defaultValue={expense?.date ?? today()} required
                       slotProps={{inputLabel: {shrink: true}}}/>
        </FormDialog>
    );
}
