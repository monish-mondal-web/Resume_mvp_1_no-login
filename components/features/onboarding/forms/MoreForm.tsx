'use client';

import React from 'react';
import {
  FiFileText, FiBriefcase, FiCpu, FiAward, FiBookOpen, FiUsers, FiFlag,
  FiShield, FiGlobe, FiHeart, FiStar, FiSmile, FiMic, FiActivity, FiLink, FiCheck,
} from 'react-icons/fi';
import { useOnboardingContext } from '../OnboardingContext';

const MORE_SECTION_DEFS = [
  { id: 'projects',       title: 'Projects',        subtitle: 'Work & side projects',   icon: <FiFileText />,  group: 'EXPERIENCE' },
  { id: 'internships',    title: 'Internships',      subtitle: 'Learning & growth',      icon: <FiBriefcase />, group: 'EXPERIENCE' },
  { id: 'freelance',      title: 'Freelance Work',   subtitle: 'Independent projects',   icon: <FiCpu />,       group: 'EXPERIENCE' },
  { id: 'certificates',   title: 'Certificates',     subtitle: 'Credentials & courses',  icon: <FiAward />,     group: 'OTHERS' },
  { id: 'coursework',     title: 'Coursework',       subtitle: 'Relevant courses',       icon: <FiBookOpen />,  group: 'ACADEMIC' },
  { id: 'involvement',    title: 'Involvement',      subtitle: 'Activities & clubs',     icon: <FiUsers />,     group: 'OTHERS' },
  { id: 'awards',         title: 'Awards & Honors',  subtitle: 'Academic achievements',  icon: <FiAward />,     group: 'ACADEMIC' },
  { id: 'achievements',   title: 'Achievements',     subtitle: 'Key milestones',         icon: <FiFlag />,      group: 'OTHERS' },
  { id: 'publications',   title: 'Publications',     subtitle: 'Papers & articles',      icon: <FiFileText />,  group: 'ACADEMIC' },
  { id: 'patents',        title: 'Patents',          subtitle: 'Intellectual property',  icon: <FiShield />,    group: 'ACADEMIC' },
  { id: 'languages',      title: 'Languages',        subtitle: 'Global communication',   icon: <FiGlobe />,     group: 'SKILLS' },
  { id: 'softskills',     title: 'Soft Skills',      subtitle: 'Human & interpersonal',  icon: <FiHeart />,     group: 'SKILLS' },
  { id: 'leadership',     title: 'Leadership',       subtitle: 'Teams & direction',      icon: <FiStar />,      group: 'OTHERS' },
  { id: 'volunteering',   title: 'Volunteering',     subtitle: 'Giving back',            icon: <FiHeart />,     group: 'OTHERS' },
  { id: 'hobbies',        title: 'Hobbies',          subtitle: 'Personal interests',     icon: <FiSmile />,     group: 'OTHERS' },
  { id: 'conferences',    title: 'Conferences',      subtitle: 'Events & workshops',     icon: <FiMic />,       group: 'ACADEMIC' },
  { id: 'extracurricular',title: 'Extracurricular',  subtitle: 'Student life',           icon: <FiActivity />,  group: 'ACADEMIC' },
  { id: 'references',     title: 'References',       subtitle: 'Professional contacts',  icon: <FiLink />,      group: 'OTHERS' },
] as const;

export function MoreForm() {
  const { selectedMoreIds, toggleMoreSection } = useOnboardingContext();

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        Select sections to add to your resume. They&apos;ll appear in Build Steps for you to fill in.
      </p>

      {(['EXPERIENCE', 'SKILLS', 'ACADEMIC', 'OTHERS'] as const).map((group) => {
        const items = MORE_SECTION_DEFS.filter((s) => s.group === group);
        return (
          <div key={group}>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{group}</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {items.map((item) => {
                const sel = selectedMoreIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleMoreSection(item.id)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                      sel
                        ? 'border-indigo-200 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-base ${sel ? 'text-indigo-500' : 'text-slate-400'}`}>{item.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm ${sel ? 'text-indigo-700' : 'text-slate-700'}`}>{item.title}</p>
                      <p className="text-xs text-slate-400">{item.subtitle}</p>
                    </div>
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                        sel ? 'border-indigo-500 bg-indigo-600' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {sel && <FiCheck className="text-[10px] text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {selectedMoreIds.length > 0 && (
        <p className="text-xs text-indigo-600">
          {selectedMoreIds.length} section{selectedMoreIds.length > 1 ? 's' : ''} added — navigate from the sidebar to fill them in.
        </p>
      )}
    </div>
  );
}
