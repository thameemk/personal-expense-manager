import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordFieldProps = {
  value: string;
  error?: string;
  autoComplete: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
};

function PasswordField({
  value,
  error,
  autoComplete,
  visible,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Input
          id="password"
          className="pr-16"
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          placeholder="At least 8 characters"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "password-error" : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1/2 right-1 -translate-y-1/2 text-xs text-primary"
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls="password"
          onClick={onToggleVisibility}
        >
          {visible ? "Hide" : "Show"}
        </Button>
      </div>
      <p id="password-error" className="min-h-4 text-xs text-destructive">
        {error}
      </p>
    </div>
  );
}

export default PasswordField;
