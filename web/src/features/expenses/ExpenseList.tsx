import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from "@mui/material";
import {useState} from "react";
import {Empty} from "../../components/Empty.tsx";
import {Section} from "../../components/Section.tsx";
import {fmt, total, type Expense} from "../../lib/money.ts";
import {day} from "../../lib/util.ts";

const monthLabel = (ym: string) =>
    new Date(ym + "-01T00:00").toLocaleDateString(undefined, {month: "long", year: "numeric"});

// Expects newest first; groups keep that order.
function byMonth(expenses: Expense[]): [string, Expense[]][] {
    const months = new Map<string, Expense[]>();
    for (const e of expenses) months.set(e.date.slice(0, 7), [...(months.get(e.date.slice(0, 7)) ?? []), e]);
    return [...months];
}

export function ExpenseList({expenses, currency, loading, onDelete}: {
    expenses: Expense[]; currency: string; loading: boolean; onDelete: (id: string) => void | Promise<void>
}) {
    const [deleting, setDeleting] = useState<ReadonlySet<string>>(new Set());
    const remove = async (id: string) => {
        setDeleting((s) => new Set(s).add(id));
        try {
            await onDelete(id);
        } finally {
            setDeleting((s) => {
                const n = new Set(s);
                n.delete(id);
                return n;
            });
        }
    };
    if (expenses.length === 0)
        return loading ? null : (
            <Section title="Expenses">
                <Empty icon={<ReceiptLongIcon fontSize="large"/>} text="No expenses yet. Tap “Add expense”."/>
            </Section>
        );
    return (
        <>
            {byMonth(expenses).map(([ym, items]) => (
                <Section key={ym} title={`${monthLabel(ym)} · ${fmt(total(items), currency)}`}>
                    <List disablePadding>
                        {items.map((e, i) => (
                            <Box key={e.id}>
                                {i > 0 && <Divider component="li"/>}
                                <ListItem secondaryAction={<IconButton edge="end" aria-label="Delete"
                                                                       disabled={deleting.has(e.id)} onClick={() => remove(e.id)}><DeleteOutlineIcon/></IconButton>}>
                                    <ListItemAvatar>
                                        <Avatar sx={{
                                            bgcolor: "action.selected",
                                            color: "text.secondary"
                                        }}><ReceiptLongIcon/></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={e.description} secondary={day(e.date)}
                                                  slotProps={{primary: {noWrap: true}}} sx={{minWidth: 0}}/>
                                    <Typography fontWeight={500} sx={{mr: 4}}>{fmt(e.cents, currency)}</Typography>
                                </ListItem>
                            </Box>
                        ))}
                    </List>
                </Section>
            ))}
        </>
    );
}
