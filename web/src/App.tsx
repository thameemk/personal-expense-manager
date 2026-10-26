import {CssBaseline, Snackbar, ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";
import * as auth from "./api/auth.ts";
import {setUnauthorizedHandler} from "./api/client.ts";
import * as tagsApi from "./api/tags.ts";
import * as expensesApi from "./api/expenses.ts";
import * as groupsApi from "./api/groups.ts";
import type {Expense} from "./lib/money.ts";
import {AppShell} from "./components/AppShell.tsx";
import {AuthPage} from "./features/auth/AuthPage.tsx";
import {GroupSidebar} from "./features/groups/GroupSidebar.tsx";
import {NewGroupDialog} from "./features/groups/NewGroupDialog.tsx";
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
    const [query, setQuery] = useState("");
    const [toast, setToast] = useState("");
    const groups = usePaged((c) => groupsApi.listGroups(token, c), token);
    const expenses = usePaged((c) => expensesApi.listExpenses(token, open ?? undefined, query, c), `${open ?? "all"}|${query}`);
    const [tags, setTags] = useState<string[]>([]); // the user's existing tags, offered as suggestions
    useEffect(() => {
        tagsApi.listTags(token).then(setTags, () => {
        });
    }, [token]);
    const addTags = (e: Expense) => setTags((ts) => [...new Set([...ts, ...e.tags])].sort());
    const g = groups.items.find((x) => x.id === open);
    const fail = (e: unknown) => setToast((e as Error).message);

    return (
        <>
            <AppShell
                title={profile ? "Profile" : g ? g.name : "All expenses"}
                onBack={profile ? () => setProfile(false) : undefined}
                sidebar={<GroupSidebar groups={groups.items} selected={open} paging={groups} onAdd={() => setCreating(true)}
                                       onSelect={(id) => {
                                           setOpen(id);
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
                    <GroupPage g={g} onQuery={setQuery} expenses={expenses.items} paging={expenses} tags={tags}
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
            {creating && <NewGroupDialog onClose={() => setCreating(false)} onSave={async (d) => {
                const gr = await groupsApi.createGroup(token, d.name, d.currency);
                groups.setItems((xs) => [gr, ...xs]);
                setOpen(gr.id);
                setProfile(false);
                setCreating(false);
            }}/>}
            <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast("")} message={toast}/>
        </>
    );
}
