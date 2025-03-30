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
    titleKey: 'experience.contractor.title',
    companyKey: 'experience.contractor.company',
    locationKey: 'experience.contractor.location',
    descriptionKey: 'experience.contractor.description',
    dateKey: 'experience.contractor.date',
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
