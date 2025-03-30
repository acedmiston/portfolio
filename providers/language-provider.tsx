'use client';

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';

type Locale = 'en' | 'fr' | 'es' | 'pt';

type TranslationValue =
  | string
  | number
  | boolean
  | TranslationObject
  | Array<TranslationValue>;

interface TranslationObject {
  [key: string]: TranslationValue;
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Store all messages in this object
let messages: Record<Locale, TranslationObject> = {
  en: {},
  fr: {},
  es: {},
  pt: {},
};

const AVAILABLE_LOCALES: Locale[] = ['en', 'fr', 'es', 'pt'];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for a saved locale with safe localStorage access
    let savedLocale: Locale | null = null;

    // Safely access localStorage (only available in browser environment)
    if (typeof window !== 'undefined') {
      savedLocale = localStorage.getItem('preferredLocale') as Locale | null;

      if (savedLocale && AVAILABLE_LOCALES.includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
    }

    const loadLocaleMessages = async (loc: Locale) => {
      try {
        // Always load fresh translations directly from files
        const importedModule = await import(`../messages/${loc}.json`);
        messages[loc] = importedModule.default || importedModule;
      } catch (error) {
        console.error(`Failed to load messages for ${loc}`, error);

        // Try to use English as fallback when a translation file fails to load
        if (loc !== 'en') {
          console.warn(`Falling back to English for failed locale: ${loc}`);
          // Make sure English is loaded first
          if (Object.keys(messages.en).length === 0) {
            try {
              const enModule = await import('../messages/en.json');
              messages.en = enModule.default || enModule;
            } catch (enError) {
              console.error(
                'Failed to load English fallback messages',
                enError
              );
            }
          }
          messages[loc] = messages.en;
        }
      }
    };

    // Load all language files concurrently
    Promise.all(AVAILABLE_LOCALES.map((loc) => loadLocaleMessages(loc)))
      .then(() => setIsLoaded(true))
      .catch((error) => {
        console.error('Error loading translations', error);
        setIsLoaded(true);
      });
  }, []);

  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Update state
    setLocaleState(newLocale);

    // Safely store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLocale', newLocale);

      // Set a cookie for server components
      document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  };

  // Translation function that looks up keys; falls back to English if necessary
  const t = (key: string, params: Record<string, string | number> = {}) => {
    const lookup = (loc: Locale): TranslationValue | undefined => {
      const keys = key.split('.');
      let value: TranslationValue | undefined = messages[loc];
      for (const k of keys) {
        if (typeof value !== 'object' || value === null) {
          return undefined;
        }
        value = (value as TranslationObject)[k];
        if (value === undefined) break;
      }
      return value;
    };

    // If translations haven't loaded yet, fall back to English
    let translation = isLoaded ? lookup(locale) : lookup('en');
    if (translation === undefined) translation = lookup('en');
    if (typeof translation !== 'string') return key;

    return translation.replace(/{(\w+)}/g, (_, param) =>
      String(params[param] || '')
    );
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
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
