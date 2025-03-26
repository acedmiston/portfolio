'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { projectsData } from '@/lib/data';

type ProjectProps = (typeof projectsData)[number];

const Project = ({ title, description, tags, imageUrl }: ProjectProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['0 1', '1.33 1'],
  });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      ref={ref}
      className="mb-3 group sm:mb-8 last:mb-0"
    >
      <section
        className="bg-gray-100 max-w-[42rem] border-black/5 overflow-hidden sm:pr-8 
        relative sm:h-[20rem] sm:group-even:pl-8 hover:bg-gray-200 transition rounded-lg
         dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
      >
        <div className="pt-4 pb-7 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[50%] flex flex-col h-full sm:group-even:ml-[18rem]">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-white/40">
            {description}
          </p>
          <ul className="flex flex-wrap gap-2 mt-4 sm:mt-auto">
            {tags.map((tag, index) => (
              <li
                className="bg-black/[0.7] px-3 py-1 text-[0.68rem] uppercase tracking-wider rounded-full text-white dark:text-white/70"
                key={index}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <Image
          src={imageUrl}
          alt={title}
          quality={100}
          className="absolute top-8 hidden sm:block -right-40 w-[28.25rem] rounded-t-lg
             shadow-2xl 
             transition
             group-hover:scale-[1.04]
             group-hover:translate-x-3 
             group-hover:translate-y-3
             group-hover:-rotate-3
             group-even:group-hover:translate-x-3 
             group-even:group-hover:translate-y-3
             group-even:group-hover:rotate-3
             group-even:right-[initial] group-even:-left-40 group-even:h-[19rem]"
        />
      </section>
    </motion.div>
  );
};

export default Project;
