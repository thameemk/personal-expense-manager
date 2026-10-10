import { useCallback, useState } from "react";
import AppShell from "./components/AppShell";
import HomePage from "./features/home/HomePage";
import AuthPage from "./features/auth/components/AuthPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem("ledgerly_access_token")),
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("ledgerly_access_token");
    window.history.replaceState({}, "", "/");
    setIsAuthenticated(false);
  }, []);

  const showHome = useCallback(() => {
    window.history.replaceState({}, "", "/home");
    setIsAuthenticated(true);
  }, []);

  return isAuthenticated ? (
    <AppShell onSignOut={signOut}>
      <HomePage onSignOut={signOut} />
    </AppShell>
  ) : (
    <AuthPage onAuthenticated={showHome} />
  );
}

export default App;
