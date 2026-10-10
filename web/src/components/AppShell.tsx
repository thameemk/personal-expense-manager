import { ReactNode } from "react";
import AppHeader from "./AppHeader";

type AppShellProps = {
  children: ReactNode;
  onSignOut: () => void;
};

function AppShell({ children, onSignOut }: AppShellProps) {
  return (
    <main className="home-page">
      <AppHeader onSignOut={onSignOut} />
      {children}
    </main>
  );
}

export default AppShell;
