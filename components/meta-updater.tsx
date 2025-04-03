'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/providers/language-provider';

export default function MetaUpdater() {
  const { locale, t } = useLanguage();

  useEffect(() => {
    // Set document title
    document.title = t('meta.title');

    // Meta description
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', t('meta.description'));

    // Open Graph image
    let metaOgImage = document.querySelector("meta[property='og:image']");
    if (!metaOgImage) {
      metaOgImage = document.createElement('meta');
      metaOgImage.setAttribute('property', 'og:image');
      document.head.appendChild(metaOgImage);
    }
    metaOgImage.setAttribute('content', '/PortfolioScreenshot.png');

    // HTML lang attribute
    document.documentElement.lang = locale;
  }, [locale, t]);

  return null;
}
