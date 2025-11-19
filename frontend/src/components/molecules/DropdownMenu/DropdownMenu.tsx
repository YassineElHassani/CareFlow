import { useState, useRef, ReactNode } from 'react';
// import { useClickOutside } from '../../../hooks/useClickOutside';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  align?: 'left' | 'right';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  onSelect,
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (value: string, disabled?: boolean) => {
    if (disabled) return;
    onSelect(value);
    setIsOpen(false);
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`dropdown ${alignClasses[align]} animate-slide-down`}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={`divider-${index}`} className="dropdown-divider" />;
            }

            return (
              <div
                key={item.value}
                onClick={() => handleSelect(item.value, item.disabled)}
                className={`dropdown-item flex items-center gap-2 ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ${item.danger ? 'text-error-600 hover:bg-error-50' : ''}`}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;