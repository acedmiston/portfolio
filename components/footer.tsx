'use client';

import React from 'react';
import { useLanguage } from '@/providers/language-provider';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 mb-10 text-center text-[0.75rem] text-gray-500 leading-relaxed max-w-4xl mx-auto pb-10">
      <p className="block mb-2">
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
