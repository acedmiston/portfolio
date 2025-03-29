import { personalInfo } from '@/lib/personalInfo';

export function getRelevantContext(message: string): string {
  // Convert to lowercase for case-insensitive matching
  const query = message.toLowerCase();

  // Work experience queries
  if (
    query.includes('experience') ||
    query.includes('work') ||
    query.includes('job') ||
    query.includes('career') ||
    query.includes('company') ||
    query.includes('rotaready')
  ) {
    return `Work History: ${JSON.stringify(personalInfo.techWorkHistory, null, 2)}`;
  }

  // Project queries
  if (
    query.includes('project') ||
    query.includes('portfolio') ||
    query.includes('build') ||
    query.includes('develop') ||
    query.includes('create') ||
    query.includes('app') ||
    query.includes('website')
  ) {
    return `Projects: ${JSON.stringify(personalInfo.projects, null, 2)}`;
  }

  // Skills queries
  if (
    query.includes('skill') ||
    query.includes('technology') ||
    query.includes('tech stack') ||
    query.includes('framework') ||
    query.includes('language') ||
    query.includes('react') ||
    query.includes('javascript') ||
    query.includes('typescript')
  ) {
    return `Skills: ${JSON.stringify(personalInfo.skills, null, 2)}`;
  }

  // Education queries
  if (
    query.includes('education') ||
    query.includes('degree') ||
    query.includes('university') ||
    query.includes('college') ||
    query.includes('study') ||
    query.includes('school')
  ) {
    return `Education: ${JSON.stringify(personalInfo.education, null, 2)}`;
  }

  // Bio/about queries
  if (
    query.includes('about') ||
    query.includes('who') ||
    query.includes('introduce') ||
    query.includes('background') ||
    query.includes('aaron') ||
    query.includes('tell me about') ||
    query.includes('bio')
  ) {
    return `About: ${JSON.stringify(personalInfo.basics, null, 2)}
Non-tech experience: ${JSON.stringify(personalInfo.nonTechWorkHistory, null, 2)}`;
  }

  // Interest/hobby queries
  if (
    query.includes('interest') ||
    query.includes('hobby') ||
    query.includes('passion') ||
    query.includes('personal') ||
    query.includes('free time') ||
    query.includes('outside of work')
  ) {
    return `Interests: ${JSON.stringify(personalInfo.interests, null, 2)}`;
  }

  // Language queries
  if (
    query.includes('language') ||
    query.includes('speak') ||
    query.includes('spanish') ||
    query.includes('portuguese')
  ) {
    return `Languages: ${JSON.stringify(personalInfo.languages, null, 2)}`;
  }

  // Certification queries
  if (
    query.includes('certification') ||
    query.includes('license') ||
    query.includes('qualified')
  ) {
    return `Certifications: ${JSON.stringify(personalInfo.certifications, null, 2)}`;
  }

  // Default: general info
  return `General Info: ${JSON.stringify(
    {
      basics: personalInfo.basics,
      overview:
        'Full Stack Software Engineer with 4+ years of experience, specializing in React, TypeScript, and Node.js.',
    },
    null,
    2
  )}`;
}
