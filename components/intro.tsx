'use client';

import React from 'react';
import Image from 'next/image';
import Aaron from '@/public/Aaron.jpg';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiDownload } from 'react-icons/hi';
import { BsArrowRight, BsGithub, BsLinkedin } from 'react-icons/bs';
import { useActiveSectionContext, useSectionInView } from '@/lib/hooks';
import { useLanguage } from '@/providers/language-provider';

const Intro = () => {
  const { ref } = useSectionInView('nav.home', 0.5);
  const { setTimeOfLastClick, setActiveSection } = useActiveSectionContext();
  const { t } = useLanguage();

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[50rem] scroll-mt-[100rem] text-center sm:mb-0"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'tween',
              duration: 0.2,
            }}
          >
            <Image
              src={Aaron}
              priority={true}
              width={200}
              height={200}
              quality={100}
              alt={t('intro.name') + ' Portrait'}
              className="h-26 w-26 rounded-full border-[0.35rem] border-white shadow-xl"
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 125,
              delay: 0.1,
              duration: 0.7,
            }}
            whileHover={{
              scale: 1.1,
              rotate: 50,
              transition: {
                type: 'spring',
                stiffness: 125,
                duration: 0.2,
              },
            }}
            className="absolute bottom-0 right-0 text-6xl focus:scale-110"
          >
            👋
          </motion.span>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 mt-4 px-4 text-[1.4rem] font-medium !leading-[1.5] sm:text-2xl md:text-3xl"
      >
        {t('intro.greeting')}{' '}
        <span className="font-bold">{t('intro.name')}</span>
        {t('intro.experience')} {t('intro.focus')}{' '}
        <span className="underline">{t('intro.technologies')}</span>
        <span> {t('intro.description')}</span>
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center justify-center gap-2 px-4 text-lg font-medium sm:flex-row"
      >
        <Link
          href="#contact"
          className="curser-pointer group flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-white outline-none transition hover:scale-110 hover:bg-gray-950 focus:scale-110 active:scale-105"
          onClick={() => {
            setActiveSection('nav.contact');
            setTimeOfLastClick(Date.now());
          }}
        >
          {t('intro.contactButton')}
          <BsArrowRight className="opacity-70 transition group-hover:translate-x-1" />
        </Link>
        <a
          href="/AaronEdmistonResume.pdf"
          download="Aaron_Edmiston_Resume.pdf"
          className="curser-pointer borderBlack group flex items-center gap-2 rounded-full bg-white px-7 py-3 outline-none transition hover:scale-110 focus:scale-110 active:scale-105 dark:bg-white/10"
        >
          {t('intro.downloadResume')}
          <HiDownload className="opacity-60 transition group-hover:translate-y-1" />
        </a>
        <div className="flex items-center gap-3">
          <a
            className="curser-pointer borderBlack flex items-center gap-2 rounded-full bg-white p-4 text-gray-700 transition hover:scale-[1.15] hover:text-gray-950 focus:scale-[1.15] active:scale-105 dark:bg-white/10 dark:text-white/60"
            href="https://www.linkedin.com/in/aaronedmiston/"
            target="_blank"
          >
            <BsLinkedin />
          </a>
          <a
            className="curser-pointer borderBlack flex items-center gap-2 rounded-full bg-white p-4 text-gray-700 transition hover:scale-[1.15] hover:text-gray-950 focus:scale-[1.15] active:scale-105 dark:bg-white/10 dark:text-white/60"
            href="https://www.github.com/acedmiston"
            target="_blank"
          >
            <BsGithub />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Intro;
