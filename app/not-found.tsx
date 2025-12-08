import Link from 'next/link';
import { cookies } from 'next/headers';

// Translation helper function
function getTranslation(messages: any, key: string): string {
  const keys = key.split('.');
  let value: any = messages;

  for (const k of keys) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      value = value[k];
    } else {
      return key;
    }
  }

  // Handle defaultMessage format
  if (value && typeof value === 'object' && 'defaultMessage' in value) {
    return value.defaultMessage;
  }

  return typeof value === 'string' ? value : key;
}

export default async function NotFound() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale');

  // Define allowed locales and validate cookie value to prevent path traversal
  const allowedLocales: readonly string[] = ['en', 'fr', 'es', 'pt'];
  const cookieValue = localeCookie?.value || 'en';
  // Validate that the cookie value is one of the allowed locales
  // This prevents path traversal attacks by ensuring only whitelisted values are used
  const locale = allowedLocales.includes(cookieValue)
    ? (cookieValue as 'en' | 'fr' | 'es' | 'pt')
    : 'en';

  // Load messages for the current locale
  let messages;
  try {
    const messagesModule = await import(`@/messages/${locale}.json`);
    messages = messagesModule.default || messagesModule;
  } catch {
    // Fallback to English if locale file doesn't exist
    try {
      const enMessages = await import('@/messages/en.json');
      messages = enMessages.default || enMessages;
    } catch {
      // Final fallback: use empty object to prevent crashes
      // The getTranslation function will return the key if translation is missing
      messages = {};
    }
  }

  const t = (key: string) => getTranslation(messages, key);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
          {t('errorPages.404.title')}
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          {t('errorPages.404.message')}
        </p>
        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {t('errorPages.404.backHome')}
        </Link>
      </div>
    </div>
  );
}
