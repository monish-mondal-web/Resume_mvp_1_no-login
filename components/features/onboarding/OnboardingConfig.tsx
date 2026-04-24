import React from 'react';
import {
  FiUser, FiBriefcase, FiBookOpen, FiStar, FiPlusCircle,
  FiAward, FiFileText, FiLink, FiUsers, FiGlobe, FiHeart,
  FiSmile, FiActivity, FiMic, FiShield, FiCpu, FiFlag
} from 'react-icons/fi';
import { StepConfig } from './types';

export const BASE_STEPS: StepConfig[] = [
  { id: 'personal',   title: 'Personal Info', subtitle: 'Contact & basics',   icon: <FiUser /> },
  { id: 'experience', title: 'Experience',    subtitle: 'Roles & impact',      icon: <FiBriefcase /> },
  { id: 'education',  title: 'Education',     subtitle: 'Degrees & study',     icon: <FiBookOpen /> },
  { id: 'skills',     title: 'Skills',        subtitle: 'Tools & tech',        icon: <FiStar /> },
  { id: 'more',       title: 'More',          subtitle: 'Additional sections', icon: <FiPlusCircle /> },
];

export const MORE_SECTION_DEFS: (StepConfig & { group: string })[] = [
  { id: 'projects',     title: 'Projects',        subtitle: 'Work & side projects',  icon: <FiFileText />, group: 'EXPERIENCE' },
  { id: 'internships',  title: 'Internships',     subtitle: 'Learning & growth',     icon: <FiBriefcase />,group: 'EXPERIENCE' },
  { id: 'freelance',    title: 'Freelance Work',  subtitle: 'Independent projects',  icon: <FiCpu />,      group: 'EXPERIENCE' },
  { id: 'certificates', title: 'Certificates',    subtitle: 'Credentials & courses', icon: <FiAward />,    group: 'OTHERS' },
  { id: 'coursework',   title: 'Coursework',      subtitle: 'Relevant courses',      icon: <FiBookOpen />, group: 'ACADEMIC' },
  { id: 'involvement',  title: 'Involvement',     subtitle: 'Activities & clubs',    icon: <FiUsers />,    group: 'OTHERS' },
  { id: 'awards',       title: 'Awards & Honors', subtitle: 'Academic achievements', icon: <FiAward />,    group: 'ACADEMIC' },
  { id: 'achievements', title: 'Achievements',    subtitle: 'Key milestones',        icon: <FiFlag />,     group: 'OTHERS' },
  { id: 'publications', title: 'Publications',    subtitle: 'Papers & articles',     icon: <FiFileText />, group: 'ACADEMIC' },
  { id: 'patents',      title: 'Patents',         subtitle: 'Intellectual property', icon: <FiShield />,   group: 'ACADEMIC' },
  { id: 'languages',    title: 'Languages',       subtitle: 'Global communication',  icon: <FiGlobe />,    group: 'SKILLS' },
  { id: 'softskills',   title: 'Soft Skills',     subtitle: 'Human & interpersonal', icon: <FiHeart />,    group: 'SKILLS' },
  { id: 'leadership',   title: 'Leadership',      subtitle: 'Teams & direction',     icon: <FiStar />,     group: 'OTHERS' },
  { id: 'volunteering', title: 'Volunteering',    subtitle: 'Giving back',           icon: <FiHeart />,    group: 'OTHERS' },
  { id: 'hobbies',      title: 'Hobbies',         subtitle: 'Personal interests',    icon: <FiSmile />,    group: 'OTHERS' },
  { id: 'conferences',  title: 'Conferences',     subtitle: 'Events & workshops',    icon: <FiMic />,      group: 'ACADEMIC' },
  { id: 'extracurricular', title: 'Extracurricular',subtitle: 'Student life',        icon: <FiActivity />, group: 'ACADEMIC' },
  { id: 'references',   title: 'References',      subtitle: 'Professional contacts', icon: <FiLink />,     group: 'OTHERS' },
];
