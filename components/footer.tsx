'use client';

import React from 'react';
import { useLanguage } from '@/providers/language-provider';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto mb-10 max-w-4xl px-4 pb-10 text-center text-[0.75rem] leading-relaxed text-gray-500">
      <p className="mb-2 block">
        {t('footer.copyright', { year: currentYear })}
      </p>
      <p className="px-2 sm:px-0">
        <span className="font-semibold">{t('footer.aboutSite')}</span>{' '}
        {t('footer.techStack')}
        <span className="hidden sm:inline"> </span>
        <span className="block sm:inline">{t('footer.aiFeatures')}</span>
      </p>
    </footer>
  );
};

export default Footer;
