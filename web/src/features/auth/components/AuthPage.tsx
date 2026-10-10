import { useAuthForm } from "../hooks/useAuthForm";
import AuthForm from "./AuthForm";
import BrandPanel from "./BrandPanel";

type AuthPageProps = {
  onAuthenticated: () => void;
};

function AuthPage({ onAuthenticated }: AuthPageProps) {
  const authForm = useAuthForm(onAuthenticated);

  return (
    <main className="auth-shell">
      <BrandPanel />
      <AuthForm
        {...authForm}
        onModeChange={authForm.switchMode}
        onValueChange={authForm.updateValue}
        onSubmit={authForm.submit}
        onTogglePassword={authForm.togglePassword}
      />
    </main>
  );
}

export default AuthPage;
