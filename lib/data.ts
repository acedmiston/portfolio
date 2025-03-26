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
    name: 'Home',
    hash: '#home',
  },
  {
    name: 'About',
    hash: '#about',
  },
  {
    name: 'Projects',
    hash: '#projects',
  },
  {
    name: 'Skills',
    hash: '#skills',
  },
  {
    name: 'Experience',
    hash: '#experience',
  },
  {
    name: 'Contact',
    hash: '#contact',
  },
] as const;

export const experiencesData = [
  {
    title: 'Full-Stack Software Engineer',
    location: 'London, UK && New York, NY',
    company: 'Rotaready',
    description:
      "I'm currently working as a full-stack engineer for Rotaready, a SaaS company. My day to day includes building new products and features for our customers, as well as maintaining and improving our existing products.",
    icon: React.createElement(FaReact),
    date: 'June 2022 - present',
  },
  {
    title: 'Full-Stack Software Developer',
    location: 'London, UK && New York, NY',
    company: 'Absolute Magnitude',
    description:
      'I worked as a full-stack developer for a startup company called Absolute Magnitude for about a year. I was responsible for project managing, working directly with clients, and building full-stack web applications.',
    icon: React.createElement(CgWorkAlt),
    date: 'Oct 2021 - July 2022',
  },
  {
    title: 'Full-Stack Software Engineer',
    location: 'Remote',
    company: 'Independent Contractor',
    description:
      'I work as a full-stack software engineer delivering customized web applications, websites, and other software products for clients.',
    icon: React.createElement(CgWorkAlt),
    date: 'June 2021 - present',
  },
  {
    title: 'Full-Stack Engineering Bootcamp',
    location: 'London, UK',
    company: '{The Jump} Digital School',
    description:
      'An eight month intensive full-stack software engineering journey to learn everything I needed to know on how to get my first engineering job.',
    icon: React.createElement(LuGraduationCap),
    date: 'Jan 2021 - Aug 2021',
  },
] as const;

export const projectsData = [
  {
    title: 'Rotaready Dashboard',
    description: `The Dashboard required meticulous planning, hands-on execution, multiple iterations, and a significant learning curve, 
    particularly with React Grid Layout and other cutting-edge technologies. It became a powerful tool for our users, offering a highly customizable, responsive, 
    and visually appealing interface.`,
    tags: ['React', 'TypeScript', 'Redux', 'GraphQL', 'Node', 'Grid Layout'],
    imageUrl: Dashboard,
  },
  {
    title: 'Rotaready Events',
    description: `I spearheaded the development of the Event Planner for Rotaready. I customized React Big Calendar and used GraphQL for precise data retrieval. 
    Through diligent handling of edge cases, I ensured a seamless user experience, resulting in a visually appealing and fully functional planner.`,
    tags: ['React', 'React Big Calendar', 'GraphQL', 'Storybook', 'Redux'],
    imageUrl: EventPlanner,
  },
  {
    title: 'Nomader',
    description:
      "Nomader was a full-stack web application that allows users to search for and save their favorite travel destinations. It used Skyscanner's API to find the cheapest flights and users local currency to their destination.",
    tags: ['React', 'Node', 'Express', 'MySQL', 'REST APIs', 'Heroku'],
    imageUrl: Nomader,
  },
  {
    title: 'Stripe Home Page',
    description:
      'This project was a challenge to make a homage to one of our favorite sites using only CSS and HTML. It was quite difficult because it had a lot of responsiveness, animations, and advanced CSS.',
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
] as const;
