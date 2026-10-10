type PasswordFieldProps = {
  value: string;
  error?: string;
  autoComplete: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
};

function PasswordField({ value, error, autoComplete, visible, onChange, onToggleVisibility }: PasswordFieldProps) {
  return (
    <div className={`field ${error ? "invalid" : ""}`}>
      <label htmlFor="password">Password</label>
      <div className="password-input">
        <input id="password" type={visible ? "text" : "password"} value={value} autoComplete={autoComplete} placeholder="At least 8 characters" onChange={(event) => onChange(event.target.value)} />
        <button className="password-toggle" type="button" onClick={onToggleVisibility}>{visible ? "Hide" : "Show"}</button>
      </div>
      <small className="field-error">{error}</small>
    </div>
  );
}

export default PasswordField;
