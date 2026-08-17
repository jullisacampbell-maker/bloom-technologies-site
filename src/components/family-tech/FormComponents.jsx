import './FormComponents.css';

export function FormField({ label, hint, error, required, children, id }) {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      {label && (
        <label htmlFor={id} className="form-field__label">
          {label}
          {required && <span className="form-field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      {hint && <p className="form-field__hint">{hint}</p>}
      {children}
      {error && <p className="form-field__error" role="alert">{error}</p>}
    </div>
  );
}

export function TextInput({ id, value, onChange, placeholder, type = 'text', ...rest }) {
  return (
    <input
      id={id}
      type={type}
      className="form-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      {...rest}
    />
  );
}

export function TextArea({ id, value, onChange, placeholder, rows = 3, ...rest }) {
  return (
    <textarea
      id={id}
      className="form-input form-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      {...rest}
    />
  );
}

export function SelectInput({ id, value, onChange, options, placeholder }) {
  return (
    <select
      id={id}
      className="form-input form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

export function ChipGroup({ options, selected, onChange, multi = true }) {
  const toggle = (value) => {
    if (multi) {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(next);
    } else {
      onChange(selected === value ? '' : value);
    }
  };

  const isSelected = (value) =>
    multi ? selected.includes(value) : selected === value;

  return (
    <div className="chip-group" role={multi ? 'group' : 'radiogroup'}>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        return (
          <button
            key={val}
            type="button"
            className={`chip ${isSelected(val) ? 'chip--selected' : ''}`}
            onClick={() => toggle(val)}
            aria-pressed={isSelected(val)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function ToggleSwitch({ id, checked, onChange, label }) {
  return (
    <label className="toggle" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="toggle__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle__track" aria-hidden="true" />
      <span className="toggle__label">{label}</span>
    </label>
  );
}

export function CardSelect({ options, value, onChange }) {
  return (
    <div className="card-select" role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`card-select__option ${value === opt.value ? 'card-select__option--selected' : ''}`}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
        >
          <span className="card-select__label">{opt.label}</span>
          {opt.description && (
            <span className="card-select__desc">{opt.description}</span>
          )}
        </button>
      ))}
    </div>
  );
}
