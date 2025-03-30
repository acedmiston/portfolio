'use client';

import React from 'react';
import SectionHeading from './section-heading';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/lib/hooks';
import { useLanguage } from '@/providers/language-provider';

const About = () => {
  const { ref } = useSectionInView('nav.about');
  const { t } = useLanguage();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      className="mb-28 max-w-[45rem] scroll-mt-28 text-center leading-8 sm:mb-40"
      id="about"
    >
      <SectionHeading>{t('about.title')}</SectionHeading>
      <p className="mb-3">{t('about.description1')}</p>
      <p className="font-medium">{t('about.description2')}</p>
    </motion.section>
  );
};

export default About;
