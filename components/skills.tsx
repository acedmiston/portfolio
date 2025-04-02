'use client';

import React from 'react';
import SectionHeading from './section-heading';
import { skillsData } from '@/lib/data';
import { useSectionInView } from '@/lib/hooks';
import { motion } from 'framer-motion';
import { useLanguage } from '@/providers/language-provider';

const Skills = () => {
  const { ref } = useSectionInView('nav.skills', 0.5);
  const { t } = useLanguage();

  const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };
  return (
    <section
      ref={ref}
      className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40"
      id="skills"
    >
      <SectionHeading>{t('skills.title')}</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-2 text-lg text-gray-800">
        {skillsData.map((skill, index) => (
          <motion.li
            variants={fadeInVariants}
            transition={{ delay: index * 0.1 }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="borderBlack rounded-xl bg-white px-5 py-3 hover:scale-110 focus:scale-110 active:scale-105 dark:bg-white/10 dark:text-white/80 dark:hover:bg-gray-950"
            key={index}
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default Skills;
