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
import {fmt, type Expense} from "../../lib/money.ts";
import {day} from "../../lib/util.ts";

export function ExpenseList({expenses, onDelete}: { expenses: Expense[]; onDelete: (id: string) => void }) {
    return (
        <Section title="Expenses">
            {expenses.length === 0 ? (
                <Empty icon={<ReceiptLongIcon fontSize="large"/>} text="No expenses yet. Tap “Add expense”."/>
            ) : (
                <List disablePadding>
                    {expenses.map((e, i) => (
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
                                <Typography fontWeight={500} sx={{mr: 4}}>{fmt(e.cents)}</Typography>
                            </ListItem>
                        </Box>
                    ))}
                </List>
            )}
        </Section>
    );
}
