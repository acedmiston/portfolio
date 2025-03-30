'use client';

import React from 'react';
import { useLanguage } from '@/providers/language-provider';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 mb-10 text-center text-gray-500">
      <small className="block mb-2 text-xs">
        {t('footer.copyright', { year: currentYear })}
      </small>
      <p className="text-xs">
        <span className="font-semibold">{t('footer.aboutSite')}</span>{' '}
        {t('footer.techStack')}
        <br />
        {t('footer.aiFeatures')}
      </p>
    </footer>
  );
};

export default Footer;
