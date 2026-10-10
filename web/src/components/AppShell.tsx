import { ReactNode } from "react";
import AppHeader from "./AppHeader";

type AppShellProps = { children: ReactNode; onSignOut: () => void };

function AppShell({ children, onSignOut }: AppShellProps) {
  return (
    <div className="min-h-svh bg-muted/50">
      <AppHeader onSignOut={onSignOut} />
      <main>{children}</main>
    </div>
  );
}

export default AppShell;
