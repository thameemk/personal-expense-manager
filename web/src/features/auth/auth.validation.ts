import { AuthFormErrors, AuthFormValues, AuthMode } from "./auth.types";

export function validateAuthForm(values: AuthFormValues, mode: AuthMode): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (mode === "signup" && values.name.trim().length < 2)
    errors.name = "Enter your name to continue.";
  if (!values.email.trim() || !/^\S+@\S+\.\S+$/.test(values.email))
    errors.email = "Enter a valid email address.";
  if (values.password.length < 8) errors.password = "Use at least 8 characters.";
  if (mode === "signup" && !values.terms) errors.terms = "Please accept the terms to continue.";

  return errors;
}
