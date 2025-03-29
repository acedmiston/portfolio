import { personalInfo } from '@/lib/personalInfo';
import { conceptMaps } from '@/lib/wordConceptMaps';

export function getRelevantContext(message: string): string {
  // Convert to lowercase for case-insensitive matching
  const query = message.toLowerCase();

  // Helper function to check if query contains any word from a concept
  function matchesConcept(conceptTerms: string[]): boolean {
    return conceptTerms.some((term) => query.includes(term));
  }

  // Match against concept maps
  if (matchesConcept(conceptMaps.workExperience)) {
    return `Work History: ${JSON.stringify(personalInfo.techWorkHistory, null, 2)}`;
  }

  if (matchesConcept(conceptMaps.projects)) {
    return `Projects: ${JSON.stringify(personalInfo.projects, null, 2)}`;
  }

  if (matchesConcept(conceptMaps.skills)) {
    return `Skills: ${JSON.stringify(personalInfo.skills, null, 2)}`;
  }

  if (matchesConcept(conceptMaps.education)) {
    return `Education: ${JSON.stringify(personalInfo.education, null, 2)}`;
  }

  if (matchesConcept(conceptMaps.interests)) {
    return `Interests and Hobbies: ${JSON.stringify(personalInfo.interests, null, 2)}`;
  }

  // Handle potential confusion between programming languages and spoken languages
  if (
    matchesConcept(conceptMaps.languages) &&
    !query.includes('programming') &&
    !query.includes('code') &&
    !query.includes('coding')
  ) {
    return `Languages: ${JSON.stringify(personalInfo.languages, null, 2)}`;
  }

  if (matchesConcept(conceptMaps.certifications)) {
    return `Certifications: ${JSON.stringify(personalInfo.certifications, null, 2)}`;
  }

  if (matchesConcept(conceptMaps.about)) {
    return `About: ${JSON.stringify(personalInfo.basics, null, 2)}
Non-tech experience: ${JSON.stringify(personalInfo.nonTechWorkHistory, null, 2)}`;
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
