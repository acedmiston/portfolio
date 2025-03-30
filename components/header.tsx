'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { links } from '@/lib/data';
import Link from 'next/link';
import clsx from 'clsx';
import { useActiveSectionContext } from '@/lib/hooks';
import { useLanguage } from '@/providers/language-provider';

const Header = () => {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const { t } = useLanguage();

  return (
    <header className="relative z-[999]">
      <nav className="fixed left-1/2 top-[0.15rem] -translate-x-1/2 py-2 sm:top-[1.7rem]">
        <div className="relative inline-block px-4">
          <motion.div
            className="absolute inset-0 rounded-full border border-white border-opacity-40 bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] dark:border-black/40 dark:bg-gray-950 dark:bg-opacity-75"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
          ></motion.div>
          <ul className="relative flex flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500 sm:gap-5">
            {links.map((link) => (
              <motion.li
                key={link.hash}
                className="relative flex h-3/4 items-center justify-center"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link
                  className={clsx(
                    'flex w-full items-center justify-center px-3 py-3 transition hover:text-gray-950 dark:text-gray-500 dark:hover:text-gray-300',
                    {
                      'text-gray-950 dark:text-white/80':
                        activeSection === t(link.nameKey),
                    }
                  )}
                  href={link.hash}
                  onClick={() => {
                    setActiveSection(link.nameKey);
                    setTimeOfLastClick(Date.now());
                  }}
                >
                  {t(link.nameKey)}
                  {activeSection === t(link.nameKey) && (
                    <motion.span
                      className="absolute inset-0 -z-10 rounded-full bg-gray-100 dark:bg-gray-800"
                      layoutId="activeSection"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    ></motion.span>
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
