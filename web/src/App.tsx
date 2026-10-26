import {CssBaseline, Snackbar, ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";
import * as auth from "./api/auth.ts";
import {setUnauthorizedHandler} from "./api/client.ts";
import * as tagsApi from "./api/tags.ts";
import * as expensesApi from "./api/expenses.ts";
import * as groupsApi from "./api/groups.ts";
import type {Expense, Group, Tag} from "./lib/money.ts";
import {AppShell} from "./components/AppShell.tsx";
import {AuthPage} from "./features/auth/AuthPage.tsx";
import {GroupSidebar} from "./features/groups/GroupSidebar.tsx";
import {NameDialog} from "./features/groups/NameDialog.tsx";
import {GroupDialog} from "./features/groups/GroupDialog.tsx";
import {ProfilePage} from "./features/profile/ProfilePage.tsx";
import {GroupPage} from "./features/groups/GroupPage.tsx";
import {useStored} from "./lib/storage.ts";
import {usePaged} from "./lib/usePaged.ts";
import {theme} from "./theme.ts";

export default function App() {
    const [token, setToken] = useStored<string | null>("token", null);
    useEffect(() => setUnauthorizedHandler(() => setToken(null)), [setToken]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {token ? <Main token={token} onLogout={() => {
                auth.logout(token).catch(() => {
                });
                setToken(null);
            }}/> : <AuthPage onToken={setToken}/>}
        </ThemeProvider>
    );
}

function Main({token, onLogout}: { token: string; onLogout: () => void }) {
    const [open, setOpen] = useState<string | null>(null);
    const [profile, setProfile] = useState(false);
    const [creating, setCreating] = useState(false);
    const [groupDialog, setGroupDialog] = useState<Group | null>(null);
    const [tagDialog, setTagDialog] = useState<{ tag?: Tag } | null>(null);
    const [query, setQuery] = useState("");
    const [tag, setTag] = useState<string | null>(null); // tag view: expenses with this tag across groups
    const [toast, setToast] = useState("");
    const groups = usePaged((c) => groupsApi.listGroups(token, c), token);
    const expenses = usePaged((c) => expensesApi.listExpenses(token, open ?? undefined, query, tag ?? undefined, c), `${open ?? "all"}|${tag}|${query}`);
    const [tags, setTags] = useState<Tag[]>([]); // the user's existing tags, offered as suggestions
    useEffect(() => {
        tagsApi.listTags(token).then(setTags, () => {
        });
    }, [token]);
    const addTags = (e: Expense) => setTags((ts) => {
        const have = new Set(ts.map((t) => t.id));
        return [...ts, ...e.tags.filter((t) => !have.has(t.id))].sort((a, b) => a.name.localeCompare(b.name));
    });
    const g = groups.items.find((x) => x.id === open);
    const tagNames = tags.map((t) => t.name);
    const fail = (e: unknown) => setToast((e as Error).message);

    return (
        <>
            <AppShell
                title={profile ? "Profile" : g ? g.name : tag ? `#${tags.find((t) => t.id === tag)?.name ?? ""}` : "All expenses"}
                onBack={profile ? () => setProfile(false) : undefined}
                sidebar={<GroupSidebar groups={groups.items} selected={open} tags={tags} selectedTag={tag} paging={groups} onAdd={() => setCreating(true)}
                                       onEditGroup={setGroupDialog} onAddTag={() => setTagDialog({})} onEditTag={(t) => setTagDialog({tag: t})}
                                       onSelect={(id, t) => {
                                           setOpen(id);
                                           setTag(t ?? null);
                                           setProfile(false);
                                       }}/>}
                onProfile={profile ? undefined : () => setProfile(true)}
            >
                {profile ? (
                    <ProfilePage token={token} groups={groups.items} expenses={expenses.items}
                                 onLogout={() => {
                                     onLogout();
                                     setOpen(null);
                                     setProfile(false);
                                 }}/>
                ) : (
                    <GroupPage g={g} onQuery={setQuery} expenses={expenses.items} paging={expenses} tags={tagNames}
                               onAdd={(d) => expensesApi.createExpense(token, d).then((e) => {
                                   addTags(e);
                                   expenses.setItems((xs) => [e, ...xs]);
                                   setToast("Expense added");
                               })}
                               onEdit={(id, d) => expensesApi.updateExpense(token, id, d).then((e) => {
                                   addTags(e);
                                   expenses.setItems((xs) => xs.map((x) => (x.id === id ? {...e, group: x.group} : x)));
                                   setToast("Expense updated");
                               })}
                               onDelete={(id) => expensesApi.deleteExpense(token, id).then(() => {
                                   expenses.setItems((xs) => xs.filter((e) => e.id !== id));
                                   setToast("Expense deleted");
                               }, fail)}/>
                )}
            </AppShell>
            {groupDialog && <GroupDialog group={groupDialog} onClose={() => setGroupDialog(null)} onSave={async (d) => {
                const saved = await groupsApi.updateGroup(token, groupDialog.id, d);
                groups.setItems((xs) => xs.map((x) => (x.id === saved.id ? {...x, name: saved.name, currency: saved.currency} : x)));
                // rows in the all-expenses view carry their group's name and currency
                expenses.setItems((xs) => xs.map((x) => (x.groupId === saved.id && x.group ? {...x, group: {name: saved.name, currency: saved.currency}} : x)));
                setGroupDialog(null);
            }}/>}
            {tagDialog && <NameDialog title={tagDialog.tag ? "Edit tag" : "New tag"} label="Tag name" name={tagDialog.tag?.name} maxLength={30}
                                      onClose={() => setTagDialog(null)} onSave={async (name) => {
                const t = tagDialog.tag;
                const saved = t ? await tagsApi.updateTag(token, t.id, name) : await tagsApi.createTag(token, name);
                setTags((ts) => [...ts.filter((x) => x.id !== saved.id), saved].sort((a, b) => a.name.localeCompare(b.name)));
                // listed expenses still carry the old name
                expenses.setItems((xs) => xs.map((x) => ({...x, tags: x.tags.map((y) => (y.id === saved.id ? saved : y))})));
                setTagDialog(null);
            }}/>}
            {creating && <GroupDialog onClose={() => setCreating(false)} onSave={async (d) => {
                const gr = await groupsApi.createGroup(token, d.name, d.currency);
                groups.setItems((xs) => [gr, ...xs]);
                setOpen(gr.id);
                setTag(null);
                setProfile(false);
                setCreating(false);
            }}/>}
            <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast("")} message={toast}/>
        </>
    );
}
