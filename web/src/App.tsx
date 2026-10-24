import {CssBaseline, Snackbar, ThemeProvider} from "@mui/material";
import {useState} from "react";
import * as auth from "./api/auth.ts";
import {AppShell} from "./components/AppShell.tsx";
import {AuthPage} from "./features/auth/AuthPage.tsx";
import {GroupListPage} from "./features/groups/GroupListPage.tsx";
import {ProfilePage} from "./features/profile/ProfilePage.tsx";
import {GroupPage} from "./features/groups/GroupPage.tsx";
import type {Expense, Group} from "./lib/money.ts";
import {useStored} from "./lib/storage.ts";
import {theme} from "./theme.ts";

export default function App() {
    const [token, setToken] = useStored<string | null>("token", null);
    const [groups, setGroups] = useStored<Group[]>("groups", []);
    const [expenses, setExpenses] = useStored<Expense[]>("expenses", []);
    const [open, setOpen] = useState<string | null>(null);
    const [profile, setProfile] = useState(false);
    const [toast, setToast] = useState("");
    const g = groups.find((x) => x.id === open);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {!token ? (
                <AuthPage onToken={setToken}/>
            ) : (
                <>
                    <AppShell
                        title={profile ? "Profile" : g ? g.name : "Expense Manager"}
                        onBack={profile ? () => setProfile(false) : g ? () => setOpen(null) : undefined}
                        onProfile={profile ? undefined : () => setProfile(true)}
                    >
                        {profile ? (
                            <ProfilePage token={token} groups={groups} expenses={expenses}
                                         onLogout={() => {
                                             auth.logout(token).catch(() => {
                                             });
                                             setToken(null);
                                             setOpen(null);
                                             setProfile(false);
                                         }}/>
                        ) : g ? (
                            <GroupPage g={g} expenses={expenses}
                                       onAdd={(e) => {
                                           setExpenses([...expenses, e]);
                                           setToast("Expense added");
                                       }}
                                       onDelete={(id) => {
                                           setExpenses(expenses.filter((e) => e.id !== id));
                                           setToast("Expense deleted");
                                       }}/>
                        ) : (
                            <GroupListPage groups={groups} expenses={expenses} onOpen={setOpen}
                                           onCreate={(gr) => {
                                               setGroups([...groups, gr]);
                                               setOpen(gr.id);
                                           }}/>
                        )}
                    </AppShell>
                    <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast("")} message={toast}/>
                </>
            )}
        </ThemeProvider>
    );
}
