'use client';

import React from 'react';
import SectionHeading from './section-heading';
import { projectsData } from '@/lib/data';
import Project from './project';
import { useSectionInView } from '@/lib/hooks';
import { useLanguage } from '@/providers/language-provider';

const Projects = () => {
  const { ref } = useSectionInView('nav.projects', 0.5);
  const { t } = useLanguage();

  return (
    <section ref={ref} className="mb-28 scroll-mt-28" id="projects">
      <SectionHeading>{t('projects.title')}</SectionHeading>
      <div>
        {projectsData.map((project, index) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default Projects;
