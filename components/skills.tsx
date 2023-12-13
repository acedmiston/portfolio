"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { skillsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";

const Skills = () => {
  const { ref } = useSectionInView("Skills", 0.5);

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
      <SectionHeading>My skills</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-2 text-lg text-gray-800">
        {skillsData.map((skill, index) => (
          <motion.li
            variants={fadeInVariants}
            transition={{ delay: index * 0.1 }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="bg-white borderBlack rounded-xl px-5 py-3 dark:bg-white/10 dark:text-white/80"
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
