import {CssBaseline, Snackbar, ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";
import * as auth from "./api/auth.ts";
import {setUnauthorizedHandler} from "./api/client.ts";
import * as expensesApi from "./api/expenses.ts";
import * as groupsApi from "./api/groups.ts";
import {AppShell} from "./components/AppShell.tsx";
import {AuthPage} from "./features/auth/AuthPage.tsx";
import {GroupListPage} from "./features/groups/GroupListPage.tsx";
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
    const [toast, setToast] = useState("");
    const groups = usePaged((c) => groupsApi.listGroups(token, c), token);
    const expenses = usePaged((c) => expensesApi.listExpenses(token, open!, c), open);
    const g = groups.items.find((x) => x.id === open);
    const fail = (e: unknown) => setToast((e as Error).message);

    return (
        <>
            <AppShell
                title={profile ? "Profile" : g ? g.name : "Expense Manager"}
                onBack={profile ? () => setProfile(false) : g ? () => setOpen(null) : undefined}
                onProfile={profile ? undefined : () => setProfile(true)}
            >
                {profile ? (
                    <ProfilePage token={token} groups={groups.items} expenses={expenses.items}
                                 onLogout={() => {
                                     onLogout();
                                     setOpen(null);
                                     setProfile(false);
                                 }}/>
                ) : g ? (
                    <GroupPage g={g} expenses={expenses.items} paging={expenses}
                               onAdd={(d) => expensesApi.createExpense(token, d).then((e) => {
                                   expenses.setItems((xs) => [e, ...xs]);
                                   setToast("Expense added");
                               })}
                               onEdit={(id, d) => expensesApi.updateExpense(token, id, d).then((e) => {
                                   expenses.setItems((xs) => xs.map((x) => (x.id === id ? e : x)));
                                   setToast("Expense updated");
                               })}
                               onDelete={(id) => expensesApi.deleteExpense(token, id).then(() => {
                                   expenses.setItems((xs) => xs.filter((e) => e.id !== id));
                                   setToast("Expense deleted");
                               }, fail)}/>
                ) : (
                    <GroupListPage groups={groups.items} paging={groups} onOpen={setOpen}
                                   onCreate={(d) => groupsApi.createGroup(token, d.name, d.currency).then((gr) => {
                                       groups.setItems((xs) => [gr, ...xs]);
                                       setOpen(gr.id);
                                   })}/>
                )}
            </AppShell>
            <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast("")} message={toast}/>
        </>
    );
}
