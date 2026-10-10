import { FormEvent } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import BrandMark from "../../../components/BrandMark";
import FormField from "../../../components/FormField";
import PasswordField from "../../../components/PasswordField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AuthFormErrors, AuthFormValues, AuthMode } from "../auth.types";

type AuthFormProps = {
  values: AuthFormValues;
  errors: AuthFormErrors;
  status: string;
  statusIsError: boolean;
  isSubmitting: boolean;
  showPassword: boolean;
  isSignup: boolean;
  onModeChange: (mode: AuthMode) => void;
  onValueChange: (field: keyof AuthFormValues, value: string | boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTogglePassword: () => void;
};

function AuthForm({
  values,
  errors,
  status,
  statusIsError,
  isSubmitting,
  showPassword,
  isSignup,
  onModeChange,
  onValueChange,
  onSubmit,
  onTogglePassword,
}: AuthFormProps) {
  const mode = isSignup ? "signup" : "login";
  return (
    <section className="flex min-h-svh items-center justify-center px-6 py-10 sm:px-8 sm:py-12">
      <div className="w-full max-w-sm">
        <div className="mb-12 flex items-center gap-2.5 text-lg font-bold lg:hidden">
          <BrandMark />
          <span>ledgerly</span>
        </div>
        <div className="mb-7">
          <p className="mb-4 text-xs font-bold tracking-widest text-primary uppercase">
            {isSignup ? "Start your journey" : "Welcome back"}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {isSignup ? "Create your account" : "Log in to Ledgerly"}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {isSignup
              ? "A clearer view of your money starts here."
              : "Pick up right where you left off."}
          </p>
        </div>
        <Tabs
          value={mode}
          onValueChange={(value) => onModeChange(value as AuthMode)}
          className="gap-6"
        >
          <TabsList className="w-full" aria-label="Account access">
            <TabsTrigger value="signup">Sign up</TabsTrigger>
            <TabsTrigger value="login">Log in</TabsTrigger>
          </TabsList>
          <TabsContent value={mode}>
            <form onSubmit={onSubmit} noValidate className="space-y-4" aria-busy={isSubmitting}>
              {isSignup && (
                <FormField
                  id="name"
                  label="Full name"
                  value={values.name}
                  placeholder="Alex Morgan"
                  error={errors.name}
                  onChange={(value) => onValueChange("name", value)}
                />
              )}
              <FormField
                id="email"
                label="Email address"
                type="email"
                value={values.email}
                placeholder="alex@example.com"
                error={errors.email}
                autoComplete="email"
                onChange={(value) => onValueChange("email", value)}
              />
              <PasswordField
                value={values.password}
                error={errors.password}
                autoComplete={isSignup ? "new-password" : "current-password"}
                visible={showPassword}
                onChange={(value) => onValueChange("password", value)}
                onToggleVisibility={onTogglePassword}
              />
              {isSignup && (
                <div className="grid gap-2">
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="terms"
                      checked={values.terms}
                      aria-invalid={Boolean(errors.terms)}
                      aria-describedby={errors.terms ? "terms-error" : undefined}
                      onCheckedChange={(checked) => onValueChange("terms", checked === true)}
                    />
                    <Label
                      htmlFor="terms"
                      className="block text-xs leading-relaxed font-normal text-muted-foreground"
                    >
                      I agree to the{" "}
                      <a className="font-medium text-primary hover:underline" href="#terms">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a className="font-medium text-primary hover:underline" href="#privacy">
                        Privacy Policy
                      </a>
                      .
                    </Label>
                  </div>
                  <p id="terms-error" className="min-h-4 pl-6 text-xs text-destructive">
                    {errors.terms}
                  </p>
                </div>
              )}
              <Button
                className="w-full justify-between"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                <span>
                  {isSubmitting ? "Please wait…" : isSignup ? "Create account" : "Log in"}
                </span>
                <ArrowRight aria-hidden="true" />
              </Button>
              <p
                className={cn(
                  "min-h-4 text-center text-xs text-primary",
                  statusIsError && "text-destructive",
                )}
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
            </form>
          </TabsContent>
        </Tabs>
        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          Your information is encrypted and secure.
        </p>
      </div>
    </section>
  );
}

export default AuthForm;
