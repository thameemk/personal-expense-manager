export type AuthMode = "signup" | "login";

export type AuthFormValues = {
  name: string;
  email: string;
  password: string;
  terms: boolean;
};

export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;
