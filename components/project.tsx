'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { projectsData } from '@/lib/data';
import { useLanguage } from '@/providers/language-provider';

type ProjectProps = (typeof projectsData)[number];

const Project = ({
  titleKey,
  descriptionKey,
  tags,
  imageUrl,
}: ProjectProps) => {
  const { t } = useLanguage();
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
      className="group mb-3 last:mb-0 sm:mb-8"
    >
      <section className="relative max-w-[42rem] overflow-hidden rounded-lg border-black/5 bg-gray-100 transition hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 sm:h-[20rem] sm:pr-8 sm:group-even:pl-8">
        <div className="flex h-full flex-col px-5 pb-7 pt-4 sm:max-w-[50%] sm:pl-10 sm:pr-2 sm:pt-10 sm:group-even:ml-[18rem]">
          <h3 className="text-2xl font-semibold">{t(titleKey)}</h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-white/40">
            {t(descriptionKey)}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 sm:mt-auto">
            {tags.map((tag, index) => (
              <li
                key={index}
                className="rounded-full bg-black/[0.7] px-3 py-1 text-[0.68rem] uppercase tracking-wider text-white dark:text-white/70"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <Image
          src={imageUrl}
          alt={t(titleKey)}
          quality={90}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="absolute -right-40 top-8 hidden w-[28.25rem] rounded-t-lg shadow-2xl transition group-even:-left-40 group-even:right-[initial] group-even:h-[19rem] group-hover:translate-x-3 group-hover:translate-y-3 group-hover:-rotate-3 group-hover:scale-[1.04] group-even:group-hover:translate-x-3 group-even:group-hover:translate-y-3 group-even:group-hover:rotate-3 sm:block"
        />
      </section>
    </motion.div>
  );
};

export default Project;
