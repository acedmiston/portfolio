'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';

export default function NotFound() {
  const { t } = useLanguage();

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
