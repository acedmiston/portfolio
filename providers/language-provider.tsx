'use client';

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';

type Locale = 'en' | 'fr' | 'es' | 'pt';

type TranslationEntry = {
  defaultMessage: string;
  description?: string;
  id?: string;
  values?: Record<string, string | number>;
};

type TranslationValue =
  | string
  | number
  | boolean
  | TranslationObject
  | Array<TranslationValue>
  | TranslationEntry;

interface TranslationObject {
  [key: string]: TranslationValue;
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Store all messages in this object
const messages: Record<Locale, TranslationObject> = {
  en: {},
  fr: {},
  es: {},
  pt: {},
};

const AVAILABLE_LOCALES: Locale[] = ['en', 'fr', 'es', 'pt'];

// Load a locale's messages (can be called multiple times)
const loadLocaleMessages = async (loc: Locale): Promise<void> => {
  try {
    // Simple and direct loading without excessive logging
    const importedModule = await import(`../messages/${loc}.json`);
    messages[loc] = importedModule.default || importedModule;

    // Just one log statement confirming success
    console.log(`✓ Successfully loaded ${loc} translations`);

    // Note: Pre-files are only used by translation scripts, not needed at runtime
    // Removing import to avoid build errors when pre directory doesn't exist
  } catch (error) {
    console.error(`Failed to load messages for ${loc}`, error);

    // Fallback to English for non-English locales
    if (loc !== 'en') {
      // Load English if needed
      if (Object.keys(messages.en).length === 0) {
        try {
          const enModule = await import('../messages/en.json');
          messages.en = enModule.default || enModule;
        } catch (enError) {
          console.error('Failed to load English fallback messages', enError);
        }
      }

      // Use English as fallback
      if (Object.keys(messages.en).length > 0) {
        messages[loc] = messages.en;
        console.log(`Using English as fallback for ${loc}`);
      }
    }
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // First effect: Initialize from localStorage on mount
  useEffect(() => {
    // Check for a saved locale with safe localStorage access
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem(
        'preferredLocale'
      ) as Locale | null;

      if (savedLocale && AVAILABLE_LOCALES.includes(savedLocale)) {
        console.log(`Initializing with saved locale: ${savedLocale}`);
        setLocaleState(savedLocale);
      }
    }

    // Load all language files initially
    Promise.all(AVAILABLE_LOCALES.map((loc) => loadLocaleMessages(loc)))
      .then(() => setIsLoaded(true))
      .catch((error) => {
        console.error('Error loading initial translations', error);
        setIsLoaded(true);
      });
  }, []);

  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    console.log(`Changing locale from ${locale} to ${newLocale}`);

    // Update state
    setLocaleState(newLocale);

    // Ensure the messages for this locale are loaded
    if (Object.keys(messages[newLocale]).length === 0) {
      setIsLoaded(false);
      await loadLocaleMessages(newLocale);
      setIsLoaded(true);
    }

    // Safely store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLocale', newLocale);

      // Set a cookie for server components
      document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  };

  // Translation function that retrieves localized text by key
  const t = (key: string, params: Record<string, string | number> = {}) => {
    // Lookup helper that traverses nested translation objects to find values
    // Handles both direct string values and objects with defaultMessage format
    const lookup = (loc: Locale): string | undefined => {
      try {
        const keys = key.split('.');
        let value: TranslationValue | undefined = messages[loc];

        // Navigate through the key path
        for (const k of keys) {
          if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return undefined;
          }

          // Type assertion to access the property
          value = (value as TranslationObject)[k];

          if (value === undefined) {
            return undefined;
          }
        }

        // Handle string values directly
        if (typeof value === 'string') {
          return value;
        }

        // Handle defaultMessage format
        if (
          value &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          'defaultMessage' in value
        ) {
          return (value as TranslationEntry).defaultMessage;
        }

        return undefined;
      } catch {
        return undefined;
      }
    };

    // Try current locale first, then fallback to English
    const result = lookup(locale) || lookup('en');

    // If no translation found, use the key itself
    const final = result || key;

    // Replace parameters
    return final.replace(/{(\w+)}/g, (_, param) =>
      String(params[param] !== undefined ? params[param] : `{${param}}`)
    );
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
