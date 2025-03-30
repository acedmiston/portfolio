import React from 'react';
import { CgWorkAlt } from 'react-icons/cg';
import { FaReact } from 'react-icons/fa';
import { LuGraduationCap } from 'react-icons/lu';
import Dashboard from '@/public/Dashboard.jpg';
import EventPlanner from '@/public/EventPlanner.jpg';
import Nomader from '@/public/Nomader.jpg';
import Stripe from '@/public/Stripe.jpg';

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
    titleKey: 'experience.entries.0.title',
    locationKey: 'experience.entries.0.location',
    companyKey: 'experience.entries.0.company',
    descriptionKey: 'experience.entries.0.description',
    dateKey: 'experience.entries.0.date',
    icon: React.createElement(FaReact),
  },
  {
    titleKey: 'experience.entries.1.title',
    locationKey: 'experience.entries.1.location',
    companyKey: 'experience.entries.1.company',
    descriptionKey: 'experience.entries.1.description',
    dateKey: 'experience.entries.1.date',
    icon: React.createElement(CgWorkAlt),
  },
  {
    titleKey: 'experience.entries.2.title',
    locationKey: 'experience.entries.2.location',
    companyKey: 'experience.entries.2.company',
    descriptionKey: 'experience.entries.2.description',
    dateKey: 'experience.entries.2.date',
    icon: React.createElement(CgWorkAlt),
  },
  {
    titleKey: 'experience.entries.3.title',
    locationKey: 'experience.entries.3.location',
    companyKey: 'experience.entries.3.company',
    descriptionKey: 'experience.entries.3.description',
    dateKey: 'experience.entries.3.date',
    icon: React.createElement(LuGraduationCap),
  },
] as const;

export const projectsData = [
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
  {
    titleKey: 'projects.items.stripe.title',
    descriptionKey: 'projects.items.stripe.description',
    tags: [
      'HTML',
      'CSS',
      'CSS Grid',
      'CSS Flexbox',
      'CSS Animations',
      'Heroku',
    ],
    imageUrl: Stripe,
  },
] as const;

export const skillsData = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Git',
  'Tailwind',
  'MongoDB',
  'Redux',
  'Relay',
  'GraphQL',
  'Express',
  'Framer Motion',
  'MySQL',
  'DynamoDB',
  'Jira',
  'Docker',
  'HTML',
  'CSS',
  'Python',
] as const;
