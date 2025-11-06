import React from 'react';
import { CgWorkAlt } from 'react-icons/cg';
import { FaReact } from 'react-icons/fa';
import { LuGraduationCap } from 'react-icons/lu';
import Dashboard from '@/public/Dashboard.jpg';
import EventPlanner from '@/public/EventPlanner.jpg';
import Nomader from '@/public/Nomader.jpg';
import LoopAI from '@/public/LoopAI.png';
import TAK from '@/public/TAK.png';

export const links = [
  {
    nameKey: 'nav.home',
    hash: '#home',
  },
  {
    nameKey: 'nav.about',
    hash: '#about',
  },
  {
    nameKey: 'nav.projects',
    hash: '#projects',
  },
  {
    nameKey: 'nav.skills',
    hash: '#skills',
  },
  {
    nameKey: 'nav.experience',
    hash: '#experience',
  },
  {
    nameKey: 'nav.contact',
    hash: '#contact',
  },
] as const;

export const experiencesData = [
  {
    titleKey: 'experience.rotaready.title',
    companyKey: 'experience.rotaready.company',
    locationKey: 'experience.rotaready.location',
    descriptionKey: 'experience.rotaready.description',
    dateKey: 'experience.rotaready.date',
    icon: React.createElement(FaReact),
  },
  {
    titleKey: 'experience.absoluteMagnitude.title',
    companyKey: 'experience.absoluteMagnitude.company',
    locationKey: 'experience.absoluteMagnitude.location',
    descriptionKey: 'experience.absoluteMagnitude.description',
    dateKey: 'experience.absoluteMagnitude.date',
    icon: React.createElement(CgWorkAlt),
  },
  {
    titleKey: 'experience.nomader.title',
    companyKey: 'experience.nomader.company',
    locationKey: 'experience.nomader.location',
    descriptionKey: 'experience.nomader.description',
    dateKey: 'experience.nomader.date',
    icon: React.createElement(CgWorkAlt),
  },
  {
    titleKey: 'experience.bootcamp.title',
    companyKey: 'experience.bootcamp.company',
    locationKey: 'experience.bootcamp.location',
    descriptionKey: 'experience.bootcamp.description',
    dateKey: 'experience.bootcamp.date',
    icon: React.createElement(LuGraduationCap),
  },
] as const;

export const projectsData = [
  {
    titleKey: 'projects.items.loopai.title',
    descriptionKey: 'projects.items.loopai.description',
    tags: ['LLMs', 'Supabase', 'Twilio', 'PostgreSQL', 'Trigram Indexing'],
    imageUrl: LoopAI,
  },
  {
    titleKey: 'projects.items.tak.title',
    descriptionKey: 'projects.items.tak.description',
    tags: ['TurboRepo', 'Docker', 'PostgreSQL', 'Husky', 'TypeScript', 'React'],
    imageUrl: TAK,
  },
  {
    titleKey: 'projects.items.dashboard.title',
    descriptionKey: 'projects.items.dashboard.description',
    tags: ['React', 'TypeScript', 'Redux', 'GraphQL', 'Node', 'Grid Layout'],
    imageUrl: Dashboard,
  },
  {
    titleKey: 'projects.items.eventPlanner.title',
    descriptionKey: 'projects.items.eventPlanner.description',
    tags: ['React', 'React Big Calendar', 'GraphQL', 'Storybook', 'Redux'],
    imageUrl: EventPlanner,
  },
  {
    titleKey: 'projects.items.nomader.title',
    descriptionKey: 'projects.items.nomader.description',
    tags: ['React', 'Node', 'Express', 'MySQL', 'REST APIs', 'Heroku'],
    imageUrl: Nomader,
  },
] as const;

export const skillsData = [
  // Frontend
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'styled-components',
  'Redux',
  'Relay',
  'GraphQL',
  'Formik',
  'Jest',
  'Framer Motion',
  // Backend
  'Node.js',
  'Express',
  'RESTful APIs',
  'MySQL',
  'PostgreSQL',
  'DynamoDB',
  'Python',
  'Supabase',
  // AI/ML
  'LLMs',
  'OpenAI API',
  'Conversational AI',
  'Natural Language Processing',
  'Fuzzy Matching',
  'Entity Resolution',
  // DevOps & Tools
  'Git',
  'GitHub',
  'AWS',
  'Docker',
  'Vercel',
  'Jira',
  'Figma',
  'Storybook',
  'Postman',
  'Twilio',
] as const;
