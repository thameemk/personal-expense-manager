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

function FormField({ id, label, value, placeholder, error, type = "text", autoComplete, onChange }: FormFieldProps) {
  return (
    <div className={`field ${error ? "invalid" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} autoComplete={autoComplete ?? id} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      <small className="field-error">{error}</small>
    </div>
  );
}

export default FormField;
