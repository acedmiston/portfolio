'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/providers/language-provider';

export default function MetaUpdater() {
  const { locale, t } = useLanguage();

  useEffect(() => {
    // Update document title
    document.title = t('meta.title');

    // Update meta description
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', t('meta.description'));

    // Update html lang attribute
    document.documentElement.lang = locale;
  }, [locale, t]);

  return null;
}
