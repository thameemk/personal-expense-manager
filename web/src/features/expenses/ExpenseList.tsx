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

export function ExpenseList({expenses, currency, onDelete}: {
    expenses: Expense[]; currency: string; onDelete: (id: string) => void
}) {
    if (expenses.length === 0)
        return (
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
                                                                       onClick={() => onDelete(e.id)}><DeleteOutlineIcon/></IconButton>}>
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
