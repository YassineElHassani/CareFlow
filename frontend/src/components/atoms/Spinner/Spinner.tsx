import { HTMLAttributes } from 'react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'spinner',
    lg: 'spinner-lg',
  };

  const colorClasses = {
    primary: 'border-gray-300 border-t-primary-600',
    secondary: 'border-gray-300 border-t-secondary-600',
    white: 'border-white/30 border-t-white',
  };

  const classes = [
    'inline-block rounded-full animate-spin',
    sizeClasses[size],
    colorClasses[color],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div role="status" {...props}>
      <div className={classes}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;