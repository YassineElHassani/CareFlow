import { InputHTMLAttributes, forwardRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div>
        <div className="flex items-start">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`checkbox ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            {...props}
          />
          {label && (
            <label htmlFor={checkboxId} className="ml-2 text-sm text-gray-700 cursor-pointer">
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <p id={`${checkboxId}-error`} className="form-error ml-6">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="form-help ml-6">{helperText}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;