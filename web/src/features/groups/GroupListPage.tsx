import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "@mui/icons-material/Groups";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Fab,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";
import {useState} from "react";
import {Empty} from "../../components/Empty.tsx";
import {InfiniteScroll} from "../../components/InfiniteScroll.tsx";
import {Section} from "../../components/Section.tsx";
import {fmt, total, type Expense, type Group} from "../../lib/money.ts";
import {colorOf} from "../../lib/util.ts";
import {NewGroupDialog} from "./NewGroupDialog.tsx";

export function GroupListPage({groups, expenses, onOpen, onCreate, paging}: {
    groups: Group[]; expenses: Expense[]; onOpen: (id: string) => void;
    onCreate: (g: { name: string; currency: string }) => void | Promise<void>;
    paging: { loadMore: () => void; retry: () => void; hasMore: boolean; loading: boolean; error: string };
}) {
    const [creating, setCreating] = useState(false);
    return (
        <>
            <Card sx={{mb: 3, bgcolor: "primary.main", color: "primary.contrastText", border: 0}}>
                <CardContent>
                    <Typography variant="body2" sx={{opacity: 0.7}}>Total spent</Typography>
                    <Typography variant="h4" fontWeight={700}>{fmt(total(expenses))}</Typography>
                </CardContent>
            </Card>
            <Section title="Groups">
                {groups.length === 0 ? (
                    paging.loading || paging.error ? null :
                        <Empty icon={<GroupsIcon fontSize="large"/>} text="Create a group to start tracking"/>
                ) : (
                    <List disablePadding>
                        {groups.map((gr, i) => (
                            <Box key={gr.id}>
                                {i > 0 && <Divider component="li"/>}
                                <ListItemButton onClick={() => onOpen(gr.id)} sx={{py: 1.5}}>
                                    <ListItemAvatar><Avatar
                                        sx={{bgcolor: colorOf(gr.name)}}>{gr.name[0].toUpperCase()}</Avatar></ListItemAvatar>
                                    <ListItemText primary={gr.name}
                                                  secondary={`${expenses.filter((e) => e.groupId === gr.id).length} expenses`}
                                                  slotProps={{primary: {noWrap: true}}} sx={{minWidth: 0, pr: 1}}/>
                                    <Typography fontWeight={500}>{fmt(total(expenses, gr.id), gr.currency)}</Typography>
                                </ListItemButton>
                            </Box>
                        ))}
                    </List>
                )}
            </Section>
            <InfiniteScroll onMore={paging.loadMore} onRetry={paging.retry} hasMore={paging.hasMore} count={groups.length} error={paging.error}/>
            <Box sx={{height: 72}}/>
            <Fab color="primary" variant="extended" onClick={() => setCreating(true)}
                 sx={{position: "fixed", right: 24, bottom: 24}}>
                <AddIcon sx={{mr: 1}}/> New group
            </Fab>
            {creating && <NewGroupDialog onClose={() => setCreating(false)} onSave={async (gr) => {
                await onCreate(gr);
                setCreating(false);
            }}/>}
        </>
    );
}
