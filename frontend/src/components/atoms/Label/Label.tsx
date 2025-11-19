import { LabelHTMLAttributes } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
}

const Label: React.FC<LabelProps> = ({ 
  children, 
  isRequired = false, 
  className = '', 
  ...props 
}) => {
  return (
    <label 
      className={`label ${isRequired ? 'label-required' : ''} ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;