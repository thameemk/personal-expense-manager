import AddIcon from "@mui/icons-material/Add";
import {Box, Card, CardContent, Fab, Typography} from "@mui/material";
import {useState} from "react";
import {AddExpenseDialog} from "../expenses/AddExpenseDialog.tsx";
import {InfiniteScroll} from "../../components/InfiniteScroll.tsx";
import type {ExpenseDraft} from "../../api/expenses.ts";
import {ExpenseList} from "../expenses/ExpenseList.tsx";
import {fmt, total, type Expense, type Group} from "../../lib/money.ts";

export function GroupPage({g, expenses, onAdd, onDelete, paging}: {
    g: Group; expenses: Expense[]; onAdd: (e: ExpenseDraft) => void; onDelete: (id: string) => void;
    paging: { loadMore: () => void; hasMore: boolean; error: string };
}) {
    const [adding, setAdding] = useState(false);
    const mine = expenses.filter((e) => e.groupId === g.id).sort((a, b) => b.date.localeCompare(a.date));
    return (
        <>
            <Card sx={{mb: 3, bgcolor: "primary.main", color: "primary.contrastText", border: 0}}>
                <CardContent>
                    <Typography variant="body2" sx={{opacity: 0.7}}>Total spent</Typography>
                    <Typography variant="h4" fontWeight={700}>{fmt(total(mine), g.currency)}</Typography>
                </CardContent>
            </Card>
            <ExpenseList expenses={mine} currency={g.currency} onDelete={onDelete}/>
            <InfiniteScroll onMore={paging.loadMore} hasMore={paging.hasMore} count={expenses.length} error={paging.error}/>
            <Box sx={{height: 72}}/>
            <Fab color="primary" variant="extended" onClick={() => setAdding(true)}
                 sx={{position: "fixed", right: 24, bottom: 24}}>
                <AddIcon sx={{mr: 1}}/> Add expense
            </Fab>
            {adding && <AddExpenseDialog groupId={g.id} currency={g.currency} onClose={() => setAdding(false)} onSave={(e) => {
                onAdd(e);
                setAdding(false);
            }}/>}
        </>
    );
}
