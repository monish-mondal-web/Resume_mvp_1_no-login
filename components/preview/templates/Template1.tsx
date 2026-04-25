'use client';

import React from 'react';
import type { ResumeData, TemplateOptions } from '@/types/resume.types';
import { ACCENT_COLORS, FONT_FAMILY_MAP } from '@/types/resume.types';

interface Props {
  data: ResumeData;
  options: TemplateOptions;
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

const V = <T extends { isHidden?: boolean }>(arr: T[] | undefined): T[] =>
  (arr ?? []).filter(e => !e.isHidden);

function fmtDate(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  if (!m) return y;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1] ?? m} ${y}`;
}

function bullets(text: string) {
  return text.split('\n').filter(Boolean).map((line, i) => (
    <li key={i} style={{ marginBottom: 1.5, lineHeight: 1.45 }}>
      {line.replace(/^[-•]\s*/, '')}
    </li>
  ));
}

export function Template1({ data, options, activeSection, onSectionClick }: Props) {
  const { personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null }, experience, education, skills, sectionOrder, enabledSections } = data;
  const accent  = ACCENT_COLORS[options.accentColor]?.hex ?? '#6366f1';
  const font    = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fsBase  = options.fontSize === 'sm' ? 9.5 : options.fontSize === 'lg' ? 11.5 : 10.5;
  const gap     = options.spacing === 'compact' ? 7 : options.spacing === 'relaxed' ? 14 : 10;

  const sectionRing = (id: string): React.CSSProperties =>
    activeSection === id
      ? { outline: `2px solid ${accent}`, outlineOffset: 2, borderRadius: 3, transition: 'outline 200ms ease' }
      : {};

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onSectionClick?.(id);
  };

  // tcolorbox-style gray section header matching teemplete1.tex
  const SectionHeader = ({ label }: { label: string }) => (
    <div style={{ backgroundColor: '#d1d5db', padding: '2.5px 6px', marginBottom: 6, marginTop: 2 }}>
      <h2 style={{ fontSize: fsBase, fontWeight: 700, letterSpacing: '0.04em', color: '#111827', textTransform: 'uppercase' }}>
        {label}
      </h2>
    </div>
  );

  const DateStr = ({ start, end, current }: { start?: string; end?: string; current?: boolean }) => (
    <span style={{ fontSize: fsBase - 1, color: '#374151', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
      {fmtDate(start ?? '')}{(end || current) ? ` – ${current ? 'Present' : fmtDate(end ?? '')}` : ''}
    </span>
  );

  const orderedIds = [
    ...sectionOrder.filter(id => id !== 'personal'),
    ...enabledSections.filter(id => id !== 'personal' && !sectionOrder.includes(id)),
  ];

  const renderSection = (id: string): React.ReactNode => {
    switch (id) {
      case 'experience': {
        const items = V(experience);
        if (!enabledSections.includes('experience') || !items.length) return null;
        return (
          <div key="experience" data-section="experience" style={{ marginBottom: gap, ...sectionRing('experience') }} onClick={handleClick('experience')} className="cursor-pointer">
            <SectionHeader label="Experience" />
            {items.map(e => (
              <div key={e.id} style={{ marginBottom: gap * 0.75 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: fsBase, fontWeight: 700 }}>{e.role}</span>
                  <DateStr start={e.start} end={e.end} current={e.currentlyWorking} />
                </div>
                <div style={{ fontSize: fsBase - 0.5, fontStyle: 'italic', color: '#374151' }}>
                  {e.company}{e.location ? `, ${e.location}` : ''}
                </div>
                {e.description && (
                  <ul style={{ margin: '2px 0 0', paddingLeft: 16, fontSize: fsBase - 0.5, color: '#1f2937', listStyleType: 'disc' }}>
                    {bullets(e.description)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      }

      case 'internships': {
        const items = V(data.internships);
        if (!enabledSections.includes('internships') || !items.length) return null;
        return (
          <div key="internships" data-section="internships" style={{ marginBottom: gap, ...sectionRing('internships') }} onClick={handleClick('internships')} className="cursor-pointer">
            <SectionHeader label="Internships" />
            {items.map(e => (
              <div key={e.id} style={{ marginBottom: gap * 0.75 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: fsBase, fontWeight: 700 }}>{e.role}</span>
                  <DateStr start={e.start} end={e.end} current={e.currentlyWorking} />
                </div>
                <div style={{ fontSize: fsBase - 0.5, fontStyle: 'italic', color: '#374151' }}>
                  {e.company}{e.location ? `, ${e.location}` : ''}
                </div>
                {e.description && (
                  <ul style={{ margin: '2px 0 0', paddingLeft: 16, fontSize: fsBase - 0.5, color: '#1f2937', listStyleType: 'disc' }}>
                    {bullets(e.description)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      }

      case 'freelance': {
        const items = V(data.freelance);
        if (!enabledSections.includes('freelance') || !items.length) return null;
        return (
          <div key="freelance" data-section="freelance" style={{ marginBottom: gap, ...sectionRing('freelance') }} onClick={handleClick('freelance')} className="cursor-pointer">
            <SectionHeader label="Freelance Work" />
            {items.map(e => (
              <div key={e.id} style={{ marginBottom: gap * 0.75 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: fsBase, fontWeight: 700 }}>{e.role}</span>
                  <DateStr start={e.start} end={e.end} current={e.currentlyWorking} />
                </div>
                <div style={{ fontSize: fsBase - 0.5, fontStyle: 'italic', color: '#374151' }}>{e.client}</div>
                {e.description && (
                  <ul style={{ margin: '2px 0 0', paddingLeft: 16, fontSize: fsBase - 0.5, color: '#1f2937', listStyleType: 'disc' }}>
                    {bullets(e.description)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      }

      case 'projects': {
        const items = V(data.projects);
        if (!enabledSections.includes('projects') || !items.length) return null;
        return (
          <div key="projects" data-section="projects" style={{ marginBottom: gap, ...sectionRing('projects') }} onClick={handleClick('projects')} className="cursor-pointer">
            <SectionHeader label="Projects" />
            {items.map(p => (
              <div key={p.id} style={{ marginBottom: gap * 0.75 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 2 }}>
                  <span style={{ fontSize: fsBase, fontWeight: 700 }}>
                    {p.title}
                    {p.tech && <span style={{ fontSize: fsBase - 1, fontWeight: 400, fontStyle: 'italic', color: '#374151', marginLeft: 5 }}>| {p.tech}</span>}
                  </span>
                  {(p.start || p.end || p.ongoing) && (
                    <span style={{ fontSize: fsBase - 1, color: '#374151', fontStyle: 'italic' }}>
                      {fmtDate(p.start)}{p.end || p.ongoing ? ` – ${p.ongoing ? 'Ongoing' : fmtDate(p.end)}` : ''}
                    </span>
                  )}
                </div>
                {p.url && <div style={{ fontSize: fsBase - 1, color: accent }}>{p.url}</div>}
                {p.description && (
                  <ul style={{ margin: '2px 0 0', paddingLeft: 16, fontSize: fsBase - 0.5, color: '#1f2937', listStyleType: 'disc' }}>
                    {bullets(p.description)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      }

      case 'education': {
        const items = V(education);
        if (!enabledSections.includes('education') || !items.length) return null;
        return (
          <div key="education" data-section="education" style={{ marginBottom: gap, ...sectionRing('education') }} onClick={handleClick('education')} className="cursor-pointer">
            <SectionHeader label="Education" />
            {items.map(e => (
              <div key={e.id} style={{ marginBottom: gap * 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: fsBase, fontWeight: 700 }}>
                    {e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}
                  </span>
                  {e.gpa && <span style={{ fontSize: fsBase - 1, color: '#374151', fontStyle: 'italic' }}>CGPA: {e.gpa}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: fsBase - 0.5, fontStyle: 'italic', color: '#374151' }}>{e.school}</span>
                  <span style={{ fontSize: fsBase - 1, color: '#374151', fontStyle: 'italic' }}>
                    {e.startYear}{e.endYear ? ` – ${e.endYear}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case 'skills': {
        if (!enabledSections.includes('skills') || !skills.length) return null;
        return (
          <div key="skills" data-section="skills" style={{ marginBottom: gap, ...sectionRing('skills') }} onClick={handleClick('skills')} className="cursor-pointer">
            <SectionHeader label="Technical Skills" />
            <div style={{ fontSize: fsBase - 0.5, color: '#1f2937', lineHeight: 1.65 }}>
              {skills.join(' · ')}
            </div>
          </div>
        );
      }

      case 'softskills': {
        const items = V(data.softskills);
        if (!enabledSections.includes('softskills') || !items.length) return null;
        return (
          <div key="softskills" data-section="softskills" style={{ marginBottom: gap, ...sectionRing('softskills') }} onClick={handleClick('softskills')} className="cursor-pointer">
            <SectionHeader label="Soft Skills" />
            <div style={{ fontSize: fsBase - 0.5, color: '#1f2937' }}>
              {items.map(s => s.skill).join(' · ')}
            </div>
          </div>
        );
      }

      case 'languages': {
        const items = V(data.languages);
        if (!enabledSections.includes('languages') || !items.length) return null;
        return (
          <div key="languages" data-section="languages" style={{ marginBottom: gap, ...sectionRing('languages') }} onClick={handleClick('languages')} className="cursor-pointer">
            <SectionHeader label="Languages" />
            <div style={{ columns: 2, fontSize: fsBase - 0.5 }}>
              {items.map(l => (
                <div key={l.id} style={{ breakInside: 'avoid' }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  {l.proficiency && <span style={{ color: '#374151' }}> [{l.proficiency}]</span>}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'certificates': {
        const items = V(data.certificates);
        if (!enabledSections.includes('certificates') || !items.length) return null;
        return (
          <div key="certificates" data-section="certificates" style={{ marginBottom: gap, ...sectionRing('certificates') }} onClick={handleClick('certificates')} className="cursor-pointer">
            <SectionHeader label="Certifications" />
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: fsBase - 0.5, listStyleType: 'disc' }}>
              {items.map(c => (
                <li key={c.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  {c.issuer && <span style={{ color: '#374151' }}> – {c.issuer}</span>}
                  {c.issueDate && <span style={{ color: '#6b7280' }}> ({fmtDate(c.issueDate)})</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      case 'coursework': {
        const items = V(data.coursework);
        if (!enabledSections.includes('coursework') || !items.length) return null;
        return (
          <div key="coursework" data-section="coursework" style={{ marginBottom: gap, ...sectionRing('coursework') }} onClick={handleClick('coursework')} className="cursor-pointer">
            <SectionHeader label="Relevant Coursework" />
            <div style={{ fontSize: fsBase - 0.5, color: '#1f2937', lineHeight: 1.65 }}>
              {items.map(c => c.course).join(' · ')}
            </div>
          </div>
        );
      }

      case 'involvement': {
        const items = V(data.involvement);
        if (!enabledSections.includes('involvement') || !items.length) return null;
        return (
          <div key="involvement" data-section="involvement" style={{ marginBottom: gap, ...sectionRing('involvement') }} onClick={handleClick('involvement')} className="cursor-pointer">
            <SectionHeader label="Positions of Responsibility" />
            {items.map(e => (
              <div key={e.id} style={{ marginBottom: gap * 0.75 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: fsBase, fontWeight: 700 }}>{e.organization}</span>
                  <DateStr start={e.start} end={e.end} current={e.current} />
                </div>
                <div style={{ fontSize: fsBase - 0.5, fontStyle: 'italic', color: '#374151' }}>{e.role}</div>
                {e.description && (
                  <ul style={{ margin: '2px 0 0', paddingLeft: 16, fontSize: fsBase - 0.5, listStyleType: 'disc' }}>
                    {bullets(e.description)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      }

      case 'awards': {
        const items = V(data.awards);
        if (!enabledSections.includes('awards') || !items.length) return null;
        return (
          <div key="awards" data-section="awards" style={{ marginBottom: gap, ...sectionRing('awards') }} onClick={handleClick('awards')} className="cursor-pointer">
            <SectionHeader label="Awards & Honors" />
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: fsBase - 0.5, listStyleType: 'disc' }}>
              {items.map(a => (
                <li key={a.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 600 }}>{a.name}</span>
                  {a.issuer && <span style={{ color: '#374151' }}> · {a.issuer}</span>}
                  {a.description && <span style={{ color: '#374151' }}> – {a.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      case 'achievements': {
        const items = V(data.achievements);
        if (!enabledSections.includes('achievements') || !items.length) return null;
        return (
          <div key="achievements" data-section="achievements" style={{ marginBottom: gap, ...sectionRing('achievements') }} onClick={handleClick('achievements')} className="cursor-pointer">
            <SectionHeader label="Achievements" />
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: fsBase - 0.5, listStyleType: 'disc' }}>
              {items.map(a => (
                <li key={a.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 600 }}>{a.title}</span>
                  {a.description && <span style={{ color: '#374151' }}> – {a.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      case 'publications': {
        const items = V(data.publications);
        if (!enabledSections.includes('publications') || !items.length) return null;
        return (
          <div key="publications" data-section="publications" style={{ marginBottom: gap, ...sectionRing('publications') }} onClick={handleClick('publications')} className="cursor-pointer">
            <SectionHeader label="Publications" />
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: fsBase - 0.5, listStyleType: 'disc' }}>
              {items.map(p => (
                <li key={p.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 600 }}>{p.title}</span>
                  {p.publisher && <span style={{ color: '#374151' }}> · {p.publisher}</span>}
                  {p.date && <span style={{ color: '#6b7280' }}> ({fmtDate(p.date)})</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      case 'leadership': {
        const items = V(data.leadership);
        if (!enabledSections.includes('leadership') || !items.length) return null;
        return (
          <div key="leadership" data-section="leadership" style={{ marginBottom: gap, ...sectionRing('leadership') }} onClick={handleClick('leadership')} className="cursor-pointer">
            <SectionHeader label="Leadership" />
            {items.map(e => (
              <div key={e.id} style={{ marginBottom: gap * 0.75 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: fsBase, fontWeight: 700 }}>{e.organization}</span>
                  <DateStr start={e.start} end={e.end} current={e.current} />
                </div>
                <div style={{ fontSize: fsBase - 0.5, fontStyle: 'italic', color: '#374151' }}>{e.role}</div>
                {e.description && (
                  <ul style={{ margin: '2px 0 0', paddingLeft: 16, fontSize: fsBase - 0.5, listStyleType: 'disc' }}>
                    {bullets(e.description)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      }

      case 'volunteering': {
        const items = V(data.volunteering);
        if (!enabledSections.includes('volunteering') || !items.length) return null;
        return (
          <div key="volunteering" data-section="volunteering" style={{ marginBottom: gap, ...sectionRing('volunteering') }} onClick={handleClick('volunteering')} className="cursor-pointer">
            <SectionHeader label="Volunteering" />
            {items.map(e => (
              <div key={e.id} style={{ marginBottom: gap * 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: fsBase, fontWeight: 700 }}>{e.role}</span>
                  <DateStr start={e.start} end={e.end} current={e.current} />
                </div>
                <div style={{ fontSize: fsBase - 0.5, fontStyle: 'italic', color: '#374151' }}>{e.organization}</div>
              </div>
            ))}
          </div>
        );
      }

      case 'extracurricular': {
        const items = V(data.extracurricular);
        if (!enabledSections.includes('extracurricular') || !items.length) return null;
        return (
          <div key="extracurricular" data-section="extracurricular" style={{ marginBottom: gap, ...sectionRing('extracurricular') }} onClick={handleClick('extracurricular')} className="cursor-pointer">
            <SectionHeader label="Extracurricular" />
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: fsBase - 0.5, listStyleType: 'disc' }}>
              {items.map(e => (
                <li key={e.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 600 }}>{e.activity}</span>
                  {e.organization && <span style={{ color: '#374151' }}> · {e.organization}</span>}
                  {e.description && <span style={{ color: '#374151' }}> – {e.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      case 'hobbies': {
        const items = V(data.hobbies);
        if (!enabledSections.includes('hobbies') || !items.length) return null;
        return (
          <div key="hobbies" data-section="hobbies" style={{ marginBottom: gap, ...sectionRing('hobbies') }} onClick={handleClick('hobbies')} className="cursor-pointer">
            <SectionHeader label="Interests" />
            <div style={{ fontSize: fsBase - 0.5, color: '#1f2937' }}>
              {items.map(h => h.name).join(' · ')}
            </div>
          </div>
        );
      }

      case 'conferences': {
        const items = V(data.conferences);
        if (!enabledSections.includes('conferences') || !items.length) return null;
        return (
          <div key="conferences" data-section="conferences" style={{ marginBottom: gap, ...sectionRing('conferences') }} onClick={handleClick('conferences')} className="cursor-pointer">
            <SectionHeader label="Conferences" />
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: fsBase - 0.5, listStyleType: 'disc' }}>
              {items.map(c => (
                <li key={c.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 600 }}>{c.title}</span>
                  {c.organizer && <span style={{ color: '#374151' }}> · {c.organizer}</span>}
                  {c.date && <span style={{ color: '#6b7280' }}> ({fmtDate(c.date)})</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      case 'patents': {
        const items = V(data.patents);
        if (!enabledSections.includes('patents') || !items.length) return null;
        return (
          <div key="patents" data-section="patents" style={{ marginBottom: gap, ...sectionRing('patents') }} onClick={handleClick('patents')} className="cursor-pointer">
            <SectionHeader label="Patents" />
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: fsBase - 0.5, listStyleType: 'disc' }}>
              {items.map(p => (
                <li key={p.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 600 }}>{p.title}</span>
                  {p.issuer && <span style={{ color: '#374151' }}> · {p.issuer}</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      case 'references': {
        const items = V(data.references);
        if (!enabledSections.includes('references') || !items.length) return null;
        return (
          <div key="references" data-section="references" style={{ marginBottom: gap, ...sectionRing('references') }} onClick={handleClick('references')} className="cursor-pointer">
            <SectionHeader label="References" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {items.map(r => (
                <div key={r.id} style={{ fontSize: fsBase - 0.5, minWidth: 160 }}>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  {r.title && <div style={{ color: '#374151' }}>{r.title}{r.company ? `, ${r.company}` : ''}</div>}
                  {r.email && <div style={{ color: '#6b7280', fontSize: fsBase - 1 }}>{r.email}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const contactItems = [
    personal.phone,
    personal.email,
    personal.location,
    ...personal.links.filter(l => l.url).map(l => l.url),
  ].filter(Boolean);

  return (
    <div
      id="resume-template1"
      style={{
        fontFamily: font,
        fontSize: fsBase,
        color: '#111827',
        backgroundColor: '#ffffff',
        padding: '16px 28px',
        minHeight: '100%',
        lineHeight: 1.4,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        data-section="personal"
        onClick={handleClick('personal')}
        className="cursor-pointer"
        style={{ marginBottom: gap, marginTop: 0, ...sectionRing('personal') }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: fsBase + 7, fontWeight: 700, letterSpacing: '0.01em', color: '#111827', lineHeight: 1.1, marginBottom: 2, marginTop: 0 }}>
              {personal.firstName} {personal.lastName}
            </h1>
            {personal.professionalTitle && (
              <p style={{ fontSize: fsBase, color: '#374151', fontStyle: 'italic' }}>{personal.professionalTitle}</p>
            )}
          </div>
          {options.showPhoto && personal.image?.url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={personal.image.url}
              alt="Profile"
              width={60}
              height={60}
              style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb', flexShrink: 0 }}
              crossOrigin="anonymous"
            />
          )}
        </div>
        {contactItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16, rowGap: 1, marginTop: 4, fontSize: fsBase - 1, color: '#374151' }}>
            {contactItems.map((item, i) => <span key={i}>{item}</span>)}
          </div>
        )}
        {personal.summary && (
          <p style={{ marginTop: 7, fontSize: fsBase - 0.5, color: '#374151', lineHeight: 1.55 }}>
            {personal.summary}
          </p>
        )}
      </div>

      {/* ── Dynamic sections ──────────────────────────────────────────────── */}
      {orderedIds.map(id => renderSection(id))}
    </div>
  );
}
