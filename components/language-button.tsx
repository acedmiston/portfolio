import React from 'react';

const LanguageButton = ({
  locale,
  label,
  variant,
  isActive,
  onClick,
}: {
  locale: 'en' | 'fr' | 'es' | 'pt';
  label: string;
  variant: 'default' | 'compact' | 'text';
  isActive: boolean;
  onClick: () => void;
}) => {
  const baseStyles = {
    default: `px-3 py-1 text-xs font-medium rounded-md transition-colors`,
    compact: `px-2 py-0.5 text-xs font-medium rounded transition-colors`,
    text: `text-xs font-medium transition-colors`,
  };

  const activeStyles = {
    default: `bg-indigo-600 text-white dark:bg-indigo-700`,
    compact: `bg-indigo-600 text-white dark:bg-indigo-700`,
    text: `text-indigo-600 dark:text-indigo-400 underline`,
  };

  const inactiveStyles = {
    default: `text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800`,
    compact: `text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800`,
    text: `text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200`,
  };

  return (
    <button
      onClick={onClick}
      aria-label={`Switch to ${locale} language`}
      className={`${baseStyles[variant]} ${
        isActive ? activeStyles[variant] : inactiveStyles[variant]
      }`}
    >
      {label}
    </button>
  );
};

export default LanguageButton;
