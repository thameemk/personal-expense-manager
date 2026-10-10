import { FormEvent, useState } from "react";
import { validateAuthForm } from "../auth.validation";
import { AuthFormErrors, AuthFormValues, AuthMode } from "../auth.types";

const emptyValues: AuthFormValues = { name: "", email: "", password: "", terms: false };

export function useAuthForm() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [values, setValues] = useState<AuthFormValues>(emptyValues);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrors({});
    setStatus("");
    setValues((current) => ({ ...current, password: "" }));
  }

  function updateValue(field: keyof AuthFormValues, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAuthForm(values, mode);
    setErrors(nextErrors);
    setStatus(
      Object.keys(nextErrors).length > 0
        ? "Check the highlighted fields and try again."
        : mode === "signup"
          ? "Your account is ready — API connection coming next."
          : "You’re signed in — API connection coming next.",
    );
  }

  return {
    mode,
    values,
    errors,
    status,
    showPassword,
    isSignup: mode === "signup",
    switchMode,
    updateValue,
    submit,
    togglePassword: () => setShowPassword((current) => !current),
  };
}
