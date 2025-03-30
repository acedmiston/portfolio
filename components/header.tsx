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
    <>
      <header className="fixed top-0 left-0 z-[1000] w-full">
        <nav className="w-full sm:fixed sm:left-1/2 sm:top-5 sm:-translate-x-1/2 sm:w-auto">
          <div className="relative inline-block w-full px-0 sm:w-auto sm:px-4">
            <motion.div
              className="absolute inset-0 
              border border-white border-opacity-40 bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] 
              dark:border-black/40 dark:bg-gray-950 dark:bg-opacity-75 
              mobile:rounded-full rounded-none"
            />
            <ul
              className="relative flex items-center justify-center 
             gap-x-2 px-2
             text-[0.65rem] font-medium text-gray-500 
             md-xs:text-[0.75rem] md-xs:gap-x-3
             xs:text-[0.9rem] xs:gap-5
             whitespace-nowrap overflow-hidden"
            >
              {links.map((link) => (
                <motion.li
                  key={link.hash}
                  className="relative flex items-center justify-center"
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Link
                    href={link.hash}
                    onClick={() => {
                      setActiveSection(link.nameKey);
                      setTimeOfLastClick(Date.now());
                    }}
                    className={clsx(
                      'relative px-2 py-2 transition hover:text-gray-950 dark:text-gray-500 dark:hover:text-gray-300',
                      'md-xs:px-2.5 md-xs:py-2.5',
                      'xs:px-3 xs:py-3',
                      {
                        'text-gray-950 dark:text-white/80':
                          activeSection === t(link.nameKey),
                      }
                    )}
                  >
                    {t(link.nameKey)}
                    {activeSection === t(link.nameKey) && (
                      <motion.span
                        className="absolute inset-0 bg-gray-100 rounded-md -z-10 dark:bg-gray-800 sm:rounded-full"
                        layoutId="activeSection"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
      <div className="block mobile:hidden h-[3.5rem]" />
    </>
  );
};

export default Header;
