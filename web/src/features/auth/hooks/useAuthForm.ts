import { FormEvent, useState } from "react";
import { loginUser, registerUser } from "../../../api/auth";
import { validateAuthForm } from "../auth.validation";
import { AuthFormErrors, AuthFormValues, AuthMode } from "../auth.types";

const emptyValues: AuthFormValues = { name: "", email: "", password: "", terms: false };

export function useAuthForm(onAuthenticated: () => void) {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [values, setValues] = useState<AuthFormValues>(emptyValues);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [status, setStatus] = useState("");
  const [statusIsError, setStatusIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrors({});
    setStatus("");
    setStatusIsError(false);
    setValues((current) => ({ ...current, password: "" }));
  }

  function updateValue(field: keyof AuthFormValues, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
    setStatusIsError(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAuthForm(values, mode);
    setErrors(nextErrors);
    setStatusIsError(Object.keys(nextErrors).length > 0);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("Check the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");
    try {
      if (mode === "signup") {
        await registerUser({
          display_name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        });
      }

      const token = await loginUser({ email: values.email.trim(), password: values.password });
      localStorage.setItem("ledgerly_access_token", token.access_token);
      setStatus(mode === "signup" ? "Your account is ready." : "You’re signed in.");
      onAuthenticated();
    } catch (error) {
      setStatusIsError(true);
      setStatus(error instanceof Error ? error.message : "Unable to connect to the API.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    mode,
    values,
    errors,
    status,
    statusIsError,
    isSubmitting,
    showPassword,
    isSignup: mode === "signup",
    switchMode,
    updateValue,
    submit,
    togglePassword: () => setShowPassword((current) => !current),
  };
}
