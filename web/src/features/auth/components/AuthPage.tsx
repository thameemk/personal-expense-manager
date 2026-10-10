import { useAuthForm } from "../hooks/useAuthForm";
import AuthForm from "./AuthForm";
import BrandPanel from "./BrandPanel";

function AuthPage() {
  const authForm = useAuthForm();

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
