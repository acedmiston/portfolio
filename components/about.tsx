"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

const About = () => {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      id="about"
    >
      <SectionHeading>About Me</SectionHeading>
      <p className="mb-3">
        While pursuing dual degrees in Marketing and International Business
        Studies at California State University Long Beach, I delved into a world
        of real-world experiences that shaped my current outlook. It&apos;s
        these adventures that truly built my foundations, adding depth to both
        my work and life outside the code editor. Even back then, I had an
        inkling that mixing coding with a splash of adventure and creativity
        would be my sweet spot.
      </p>
      <p className="font-medium">
        Fast forward to today—I&apos;m a Full-Stack Software Engineer thriving
        in NYC. Coding&apos;s my forte; JavaScript, React, and Node keep my days
        buzzing with problem solving and innovation. But life&apos;s more than
        just code. I&apos;m all about nurturing connections and growth, whether
        it&apos;s mentoring junior developers or crafting experiences that blend
        art, music, and genuine human interaction. And when I&apos;m not coding,
        I&apos;m plunging into the depths of the ocean, exploring reefs, or
        soaking up the sun on a beach in Australia. With experiences in 60
        countries and a year living the nomad life, each adventure continues to
        fuel my passion for tech and creativity.
      </p>
    </motion.section>
  );
};

export default About;
