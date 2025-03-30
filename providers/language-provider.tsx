'use client';

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';

type Locale = 'en' | 'fr' | 'es' | 'pt';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Version your translations with the MD5 hashes from build time
interface TranslationHashes {
  [key: string]: string; // locale: hash
}

// This will be populated at build time
const TRANSLATION_HASHES: TranslationHashes = {
  en: '',
  fr: '',
  es: '',
  pt: '',
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// We'll store all messages in this object.
let messages: Record<Locale, Record<string, any>> = {
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
    // Check for a saved locale
    const savedLocale = localStorage.getItem(
      'preferredLocale'
    ) as Locale | null;
    if (savedLocale && AVAILABLE_LOCALES.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }

    let hashesLoaded = false;

    // Function to load messages for a given locale
    const loadLocaleMessages = async (loc: Locale) => {
      // First, try to load hashes if not already loaded
      if (!hashesLoaded) {
        try {
          // Load hashes from a file that's generated during build
          const hashesResponse = await fetch('/translation-hashes.json');
          const hashesData = await hashesResponse.json();
          Object.assign(TRANSLATION_HASHES, hashesData);
          hashesLoaded = true;
        } catch (error) {
          console.warn(
            'Translation hashes not available, cache validation disabled'
          );
        }
      }

      const cached = localStorage.getItem(`messages_${loc}`);
      const cachedHash = localStorage.getItem(`messages_hash_${loc}`);

      // Use cache only if hash matches or hashes aren't available
      if (cached && (cachedHash === TRANSLATION_HASHES[loc] || !hashesLoaded)) {
        try {
          messages[loc] = JSON.parse(cached);
          return;
        } catch (error) {
          console.error(`Failed to parse cached messages for ${loc}`, error);
        }
      }

      // Fetch fresh translations
      try {
        const importedModule = await import(`../messages/${loc}.json`);
        messages[loc] = importedModule.default || importedModule;
        localStorage.setItem(`messages_${loc}`, JSON.stringify(messages[loc]));

        // Store the current hash too
        if (hashesLoaded) {
          localStorage.setItem(`messages_hash_${loc}`, TRANSLATION_HASHES[loc]);
        }
      } catch (error) {
        console.error(`Failed to load messages for ${loc}`, error);
      }
    };

    // Eagerly load all language files concurrently
    Promise.all(AVAILABLE_LOCALES.map((loc) => loadLocaleMessages(loc)))
      .then(() => setIsLoaded(true))
      .catch((error) => {
        console.error('Error loading translations', error);
        setIsLoaded(true);
      });
  }, []);

  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;
    setLocaleState(newLocale);
    localStorage.setItem('preferredLocale', newLocale);
    // Since all languages are preloaded, no reload or dynamic import is needed here.
  };

  // Translation function that looks up keys; falls back to English if necessary.
  const t = (key: string, params: Record<string, string | number> = {}) => {
    const lookup = (loc: Locale) => {
      const keys = key.split('.');
      let value: any = messages[loc];
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
      return value;
    };

    // If translations haven't loaded yet, fall back to English.
    let translation = isLoaded ? lookup(locale) : lookup('en');
    if (!translation) translation = lookup('en');
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
