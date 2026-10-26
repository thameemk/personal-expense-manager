import AddIcon from "@mui/icons-material/Add";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
    Avatar,
    Button,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography
} from "@mui/material";
import {InfiniteScroll} from "../../components/InfiniteScroll.tsx";
import type {Group, Tag} from "../../lib/money.ts";
import {colorOf} from "../../lib/util.ts";

const item = {mx: 1, borderRadius: 2, "&.Mui-selected": {bgcolor: "action.selected"}};

// selected = group id, or null for "All expenses"
export function GroupSidebar({groups, selected, tags, selectedTag, onSelect, onAdd, paging}: {
    groups: Group[]; selected: string | null; tags: Tag[]; selectedTag: string | null;
    onSelect: (id: string | null, tag?: string) => void; onAdd: () => void;
    paging: { loadMore: () => void; retry: () => void; hasMore: boolean; loading: boolean; error: string };
}) {
    return (
        <>
            <Typography variant="h6" fontWeight={700} sx={{px: 2.5, pt: 2.5, pb: 1}}>Expense Manager</Typography>
            <List dense sx={{py: 1}}>
                <ListItemButton sx={item} selected={selected === null && selectedTag === null} onClick={() => onSelect(null)}>
                    <ListItemIcon sx={{minWidth: 36, color: "text.primary"}}><ReceiptLongIcon fontSize="small"/></ListItemIcon>
                    <ListItemText primary="All expenses" slotProps={{primary: {fontWeight: 500}}}/>
                </ListItemButton>
                <ListSubheader disableSticky sx={{display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "transparent", mt: 1, lineHeight: "36px", fontSize: 12, letterSpacing: 1}}>
                    GROUPS
                    <Button size="small" startIcon={<AddIcon/>} onClick={onAdd}>add</Button>
                </ListSubheader>
                {groups.map((gr) => (
                    <ListItemButton key={gr.id} sx={item} selected={selected === gr.id && selectedTag === null} onClick={() => onSelect(gr.id)}>
                        <ListItemAvatar sx={{minWidth: 40}}>
                            <Avatar sx={{width: 28, height: 28, fontSize: 14, bgcolor: colorOf(gr.name)}}>{gr.name[0].toUpperCase()}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={gr.name} slotProps={{primary: {noWrap: true}}}/>
                    </ListItemButton>
                ))}
                {groups.length === 0 && !paging.loading && !paging.error &&
                    <Typography variant="caption" color="text.secondary" sx={{px: 2.5}}>No groups yet</Typography>}
                {tags.length > 0 && <ListSubheader disableSticky sx={{bgcolor: "transparent", mt: 1, lineHeight: "36px", fontSize: 12, letterSpacing: 1}}>
                    TAGS
                </ListSubheader>}
                {tags.map((t) => (
                    <ListItemButton key={t.id} sx={item} selected={selectedTag === t.id} onClick={() => onSelect(null, t.id)}>
                        <ListItemIcon sx={{minWidth: 36}}><LabelOutlinedIcon fontSize="small"/></ListItemIcon>
                        <ListItemText primary={t.name} slotProps={{primary: {noWrap: true}}}/>
                    </ListItemButton>
                ))}
            </List>
            <InfiniteScroll onMore={paging.loadMore} onRetry={paging.retry} hasMore={paging.hasMore} loading={paging.loading} count={groups.length} error={paging.error}/>
        </>
    );
}
