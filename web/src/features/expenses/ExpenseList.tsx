import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import {useState} from "react";
import {Empty} from "../../components/Empty.tsx";
import {Section} from "../../components/Section.tsx";
import {fmt, total, type Expense} from "../../lib/money.ts";

const monthLabel = (ym: string) =>
    new Date(ym + "-01T00:00").toLocaleDateString(undefined, {month: "long", year: "numeric"});

const part = (d: string, opt: Intl.DateTimeFormatOptions) =>
    new Date(d + "T00:00").toLocaleDateString(undefined, opt);

// Expects newest first; groups keep that order.
function byMonth(expenses: Expense[]): [string, Expense[]][] {
    const months = new Map<string, Expense[]>();
    for (const e of expenses) months.set(e.date.slice(0, 7), [...(months.get(e.date.slice(0, 7)) ?? []), e]);
    return [...months];
}

export function ExpenseList({expenses, currency, loading, searching, onEdit, onDelete}: {
    expenses: Expense[]; currency?: string; loading: boolean; searching?: boolean; onEdit: (e: Expense) => void; onDelete: (id: string) => void | Promise<void>
}) {
    const cur = (e: Expense) => e.group?.currency ?? currency;
    const [confirm, setConfirm] = useState<Expense | null>(null);
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
                <Empty icon={<ReceiptLongIcon fontSize="large"/>} text={searching ? "No matching expenses." : "No expenses yet. Tap “Add expense”."}/>
            </Section>
        );
    return (
        <>
            {byMonth(expenses).map(([ym, items]) => {
                const currencies = new Set(items.map(cur)); // a month total only makes sense in one currency
                return (
                <Section key={ym} title={currencies.size === 1 ? `${monthLabel(ym)} · ${fmt(total(items), cur(items[0]))}` : monthLabel(ym)}>
                    <List disablePadding>
                        {items.map((e, i) => (
                            <Box key={e.id}>
                                {i > 0 && <Divider component="li"/>}
                                <ListItem sx={{py: 1.25, "&:hover": {bgcolor: "action.hover"}}} secondaryAction={<>
                                    <IconButton size="small" aria-label={`Edit ${e.description}`} onClick={() => onEdit(e)}><EditOutlinedIcon/></IconButton>
                                    <IconButton size="small" edge="end" color="error" aria-label={`Delete ${e.description}`}
                                                disabled={deleting.has(e.id)} onClick={() => setConfirm(e)}><DeleteOutlineIcon/></IconButton>
                                </>}>
                                    <Box sx={{width: 40, mr: 2, textAlign: "center", lineHeight: 1, color: "text.secondary"}}>
                                        <Typography variant="caption" sx={{textTransform: "uppercase"}}>{part(e.date, {month: "short"})}</Typography>
                                        <Typography variant="h6" component="div" fontWeight={500}>{part(e.date, {day: "numeric"})}</Typography>
                                    </Box>
                                    <Avatar variant="rounded" sx={{mr: 2, bgcolor: "action.selected", color: "text.secondary"}}><ReceiptLongIcon/></Avatar>
                                    <ListItemText primary={e.description}
                                                  secondary={(e.group || e.tags.length > 0) && <>
                                                      {e.group && <Chip label={e.group.name} size="small" variant="outlined" sx={{mr: 0.5, mt: 0.5}}/>}
                                                      {e.tags.map((t) => <Chip key={t} label={t} size="small" sx={{mr: 0.5, mt: 0.5}}/>)}
                                                  </>}
                                                  slotProps={{primary: {noWrap: true, fontWeight: 500}, secondary: {component: "div"}}} sx={{minWidth: 0}}/>
                                    <Typography fontWeight={600} sx={{mr: 9, minWidth: 72, textAlign: "right", ml: 1, flexShrink: 0, fontVariantNumeric: "tabular-nums"}}>{fmt(e.cents, cur(e))}</Typography>
                                </ListItem>
                            </Box>
                        ))}
                    </List>
                </Section>
                );
            })}
            <Dialog open={!!confirm} onClose={() => setConfirm(null)}>
                <DialogTitle>Delete expense?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        “{confirm?.description}” will be permanently deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 2}}>
                    <Button onClick={() => setConfirm(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={() => {
                        remove(confirm!.id);
                        setConfirm(null);
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
