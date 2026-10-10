import { FormEvent } from "react";
import BrandMark from "../../../components/BrandMark";
import FormField from "../../../components/FormField";
import PasswordField from "../../../components/PasswordField";
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
  return (
    <section className="form-panel">
      <div className="form-wrap">
        <div className="mobile-brand">
          <BrandMark />
          <span>ledgerly</span>
        </div>
        <div className="form-heading">
          <p className="eyebrow">{isSignup ? "Start your journey" : "Welcome back"}</p>
          <h2>{isSignup ? "Create your account" : "Log in to Ledgerly"}</h2>
          <p>
            {isSignup
              ? "A clearer view of your money starts here."
              : "Pick up right where you left off."}
          </p>
        </div>

        <div className="mode-switch" role="tablist" aria-label="Account access">
          <button
            className={`mode-button ${isSignup ? "active" : ""}`}
            type="button"
            role="tab"
            aria-selected={isSignup}
            onClick={() => onModeChange("signup")}
          >
            Sign up
          </button>
          <button
            className={`mode-button ${!isSignup ? "active" : ""}`}
            type="button"
            role="tab"
            aria-selected={!isSignup}
            onClick={() => onModeChange("login")}
          >
            Log in
          </button>
        </div>

        <form onSubmit={onSubmit} noValidate>
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
            <>
              <label className="terms">
                <input
                  type="checkbox"
                  checked={values.terms}
                  onChange={(event) => onValueChange("terms", event.target.checked)}
                />
                <span>
                  I agree to the <a href="#terms">Terms of Service</a> and{" "}
                  <a href="#privacy">Privacy Policy</a>.
                </span>
              </label>
              <small className="field-error terms-error">{errors.terms}</small>
            </>
          )}

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? "Please wait…" : isSignup ? "Create account" : "Log in"}</span>
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </button>
          <p
            className={`form-status ${statusIsError ? "error" : ""}`}
            role="status"
            aria-live="polite"
          >
            {status}
          </p>
        </form>
        <p className="security-note">
          <span className="lock" aria-hidden="true">
            ⌑
          </span>{" "}
          Your information is encrypted and secure.
        </p>
      </div>
    </section>
  );
}

export default AuthForm;
