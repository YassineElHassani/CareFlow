import { ImgHTMLAttributes } from 'react';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  shape?: 'circle' | 'square';
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const classes = [
    'inline-flex items-center justify-center overflow-hidden',
    sizeClasses[size],
    shapeClasses[shape],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`${classes} object-cover`}
        {...props}
      />
    );
  }

  return (
    <div
      className={`${classes} bg-primary-100 text-primary-700 font-semibold`}
      {...props}
    >
      {name ? getInitials(name) : '?'}
    </div>
  );
};

export default Avatar;