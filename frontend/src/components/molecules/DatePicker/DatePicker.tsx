import { forwardRef } from 'react';
import Input, { InputProps } from '@/components/atoms/Input/';

export interface DatePickerProps extends Omit<InputProps, 'type'> {
  minDate?: string;
  maxDate?: string;
  format?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ minDate, maxDate, format, ...props }, ref) => {
    const CalendarIcon = () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    );

    return (
      <Input
        ref={ref}
        type="date"
        min={minDate}
        max={maxDate}
        rightIcon={<CalendarIcon />}
        {...props}
      />
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;