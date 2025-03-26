'use client';

import React from 'react';
import Image from 'next/image';
import Aaron from '@/public/Aaron.jpg';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiDownload } from 'react-icons/hi';
import { BsArrowRight, BsGithub, BsLinkedin } from 'react-icons/bs';
import { useActiveSectionContext, useSectionInView } from '@/lib/hooks';

const Intro = () => {
  const { ref } = useSectionInView('Home', 0.5);
  const { setTimeOfLastClick, setActiveSection } = useActiveSectionContext();

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]"
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
              alt={'Aaron Portrait'}
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
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-3xl"
      >
        Hey there, I&apos;m <span className="font-bold">Aaron Edmiston</span>, a
        <span className="font-bold"> full-stack software engineer </span>
        with over<span className="italic"> 4 years</span> of professional
        experience. My focus is mostly front-end development, using{' '}
        <span className="underline">
          React (Next.js), TypeScript, Node, GraphQL, and MySQL.
        </span>
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center justify-center gap-2 px-4 text-lg font-medium sm:flex-row"
      >
        <Link
          href="#contact"
          className="flex items-center gap-2 py-3 text-white transition bg-gray-900 rounded-full outline-none group px-7 focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 curser-pointer"
          onClick={() => {
            setActiveSection('Contact');
            setTimeOfLastClick(Date.now());
          }}
        >
          Contact me here
          <BsArrowRight className="transition opacity-70 group-hover:translate-x-1" />
        </Link>
        <a
          className="flex items-center gap-2 py-3 transition bg-white rounded-full outline-none group px-7 focus:scale-110 hover:scale-110 active:scale-105 curser-pointer borderBlack dark:bg-white/10"
          href="/AaronEdmistonResume.pdf"
          download
        >
          Download résumé
          <HiDownload className="transition opacity-60 group-hover:translate-y-1" />
        </a>
        <a
          className="bg-white p-4 text-gray-700 flex items-center gap-2 rounded-full 
          focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition 
          curser-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://www.linkedin.com/in/aaronedmiston/"
          target="_blank"
        >
          <BsLinkedin />
        </a>
        <a
          className="bg-white p-4 text-gray-700 flex items-center gap-2 rounded-full 
          focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition
           curser-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://www.github.com/acedmiston"
          target="_blank"
        >
          <BsGithub />
        </a>
      </motion.div>
    </section>
  );
};

export default Intro;
