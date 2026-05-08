export type SuggestionTextField =
  | `projects.${number}.description`
  | `involvement.${number}.description`
  | `internships.${number}.description`
  | `freelance.${number}.description`
  | `leadership.${number}.description`
  | `volunteering.${number}.description`
  | `extracurricular.${number}.description`;

export const PROFICIENCY_LEVELS = [
  'Elementary',
  'Limited Working',
  'Professional Working',
  'Full Professional',
  'Native / Bilingual',
];
