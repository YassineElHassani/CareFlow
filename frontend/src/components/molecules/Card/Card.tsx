import { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  variant?: 'default' | 'compact' | 'spacious';
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  footer,
  children,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'card',
    compact: 'card card-compact',
    spacious: 'card card-spacious',
  };

  const classes = [
    variantClasses[variant],
    hoverable ? 'card-hover' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      
      <div className="card-body">{children}</div>
      
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;