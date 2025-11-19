import { useState, useCallback, InputHTMLAttributes } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  showButton?: boolean;
  buttonText?: string;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  debounceMs = 300,
  showButton = false,
  buttonText = 'Search',
  isLoading = false,
  placeholder = 'Search...',
  className = '',
  ...props
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  // Trigger search when debounced query changes
  useCallback(() => {
    if (!showButton) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, showButton]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!showButton) {
      // Debounced search will trigger automatically
    }
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    } else {
      onSearch('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && showButton) {
      handleSearch();
    }
  };

  const SearchIcon = () => (
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const CloseIcon = () => (
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          leftIcon={<SearchIcon />}
          rightIcon={
            query && (
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )
          }
          {...props}
        />
      </div>

      {showButton && (
        <Button
          type="button"
          onClick={handleSearch}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default SearchBar;