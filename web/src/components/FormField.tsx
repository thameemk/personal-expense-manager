import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
};

function FormField({
  id,
  label,
  value,
  placeholder,
  error,
  type = "text",
  autoComplete,
  onChange,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete ?? id}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      <p id={`${id}-error`} className="min-h-4 text-xs text-destructive">
        {error}
      </p>
    </div>
  );
}

export default FormField;
