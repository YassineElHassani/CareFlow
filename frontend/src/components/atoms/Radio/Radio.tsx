import { InputHTMLAttributes, forwardRef } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={`radio ${className}`}
          {...props}
        />
        {label && (
          <label htmlFor={radioId} className="ml-2 text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;