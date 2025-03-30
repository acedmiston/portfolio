'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/providers/language-provider';

type LocaleOption = {
  code: 'en' | 'fr' | 'es' | 'pt';
  flag: string;
};

const localeOptions: LocaleOption[] = [
  { code: 'en', flag: '🇺🇸' },
  { code: 'fr', flag: '🇫🇷' },
  { code: 'es', flag: '🇪🇸' },
  { code: 'pt', flag: '🇵🇹' },
];

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = localeOptions.find((opt) => opt.code === locale);

  return (
    <div ref={containerRef} className="fixed left-5 top-5 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-[3rem] w-[3rem] items-center justify-center rounded-full border border-gray-600 border-opacity-50 bg-white text-3xl shadow-2xl backdrop-blur-[0.5rem] transition-all hover:scale-[1.15] active:scale-105 dark:border-black"
        aria-label="Select language"
      >
        {currentOption?.flag}
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-24 rounded border border-gray-600 bg-white shadow-lg">
          {localeOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => {
                setLocale(option.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-center py-2 text-3xl transition hover:bg-gray-200"
              aria-label={`Switch to ${option.code}`}
            >
              {option.flag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
