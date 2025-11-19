import { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  outline?: boolean;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  outline = false,
  dot = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'badge';
  
  const variantClasses = outline
    ? `badge-outline badge-outline-${variant}`
    : `badge-${variant}`;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: '',
    lg: 'badge-lg',
  };

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {dot && <span className={`status-dot status-dot-${variant} mr-1`}></span>}
      {children}
    </span>
  );
};

export default Badge;