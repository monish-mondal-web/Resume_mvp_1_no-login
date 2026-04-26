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

function bullets(text: string, fs: number) {
  return text.split('\n').filter(Boolean).map((line, i) => (
    <li key={i} style={{ marginBottom: 1.5, lineHeight: 1.45, fontSize: fs - 0.5 }}>
      {line.replace(/^[-•]\s*/, '')}
    </li>
  ));
}

// Professional Executive template — centered header with accent title, dot contacts, prominent sections
export function Template3({ data, options, activeSection, onSectionClick }: Props) {
  const {
    personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null },
    experience = [], education = [], skills = [], sectionOrder = [], enabledSections = [],
  } = data;

  const accent  = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#0f766e';
  const font    = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fs      = options.fontSize === 'sm' ? 9.5 : options.fontSize === 'lg' ? 11.5 : 10.5;
  const gap     = options.spacing === 'compact' ? 7 : options.spacing === 'relaxed' ? 14 : 10;
  const pad     = options.pagePadding === 'narrow' ? '10px 16px' : options.pagePadding === 'wide' ? '24px 40px' : '16px 28px';

  const ring = (id: string): React.CSSProperties =>
    activeSection === id ? { outline: `2px solid ${accent}`, outlineOffset: 2, borderRadius: 3 } : {};
  const click = (id: string) => (e: React.MouseEvent) => { e.stopPropagation(); onSectionClick?.(id); };

  // Professional: larger UPPERCASE + thin gray rule
  const SectionHeader = ({ label }: { label: string }) => (
    <div style={{ marginBottom: 6, marginTop: 2 }}>
      <h2 style={{
        fontSize: fs + 0.5, fontWeight: 700, letterSpacing: '0.08em', color: '#111827',
        textTransform: 'uppercase', lineHeight: 1.2, marginBottom: 3,
      }}>
        {label}
      </h2>
      <div style={{ height: 0.75, backgroundColor: '#d1d5db' }} />
    </div>
  );

  const DateStr = ({ start, end, current }: { start?: string; end?: string; current?: boolean }) => (
    <span style={{ fontSize: fs - 1, color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
      {fmtDate(start ?? '')}{(end || current) ? ` – ${current ? 'Present' : fmtDate(end ?? '')}` : ''}
    </span>
  );

  // Professional: Role bold | Company in accent | Date right; location below
  const WorkEntry = ({ role, org, location, start, end, current, desc }: {
    role?: string; org?: string; location?: string;
    start?: string; end?: string; current?: boolean; desc?: string;
  }) => (
    <div style={{ marginBottom: gap * 0.75, breakInside: 'avoid' as const }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: fs, fontWeight: 700, color: '#111827' }}>{role}</span>
          {org && <span style={{ fontSize: fs, color: accent, marginLeft: 6, fontWeight: 500 }}>{org}</span>}
        </div>
        <DateStr start={start} end={end} current={current} />
      </div>
      {location && (
        <div style={{ fontSize: fs - 1, color: '#6b7280', fontStyle: 'italic', marginTop: 1 }}>{location}</div>
      )}
      {desc && (
        <ul style={{ margin: '3px 0 0', paddingLeft: 14, color: '#374151', listStyleType: 'disc' }}>
          {bullets(desc, fs)}
        </ul>
      )}
    </div>
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
          <div key="experience" data-section="experience" style={{ marginBottom: gap, ...ring('experience') }} onClick={click('experience')} className="cursor-pointer">
            <SectionHeader label="Professional Experience" />
            {items.map(e => <WorkEntry key={e.id} role={e.role} org={e.company} location={e.location} start={e.start} end={e.end} current={e.currentlyWorking} desc={e.description} />)}
          </div>
        );
      }
      case 'internships': {
        const items = V(data.internships);
        if (!enabledSections.includes('internships') || !items.length) return null;
        return (
          <div key="internships" data-section="internships" style={{ marginBottom: gap, ...ring('internships') }} onClick={click('internships')} className="cursor-pointer">
            <SectionHeader label="Internships" />
            {items.map(e => <WorkEntry key={e.id} role={e.role} org={e.company} location={e.location} start={e.start} end={e.end} current={e.currentlyWorking} desc={e.description} />)}
          </div>
        );
      }
      case 'freelance': {
        const items = V(data.freelance);
        if (!enabledSections.includes('freelance') || !items.length) return null;
        return (
          <div key="freelance" data-section="freelance" style={{ marginBottom: gap, ...ring('freelance') }} onClick={click('freelance')} className="cursor-pointer">
            <SectionHeader label="Freelance Work" />
            {items.map(e => <WorkEntry key={e.id} role={e.role} org={e.client} start={e.start} end={e.end} current={e.currentlyWorking} desc={e.description} />)}
          </div>
        );
      }
      case 'projects': {
        const items = V(data.projects);
        if (!enabledSections.includes('projects') || !items.length) return null;
        return (
          <div key="projects" data-section="projects" style={{ marginBottom: gap, ...ring('projects') }} onClick={click('projects')} className="cursor-pointer">
            <SectionHeader label="Projects" />
            {items.map(p => (
              <div key={p.id} style={{ marginBottom: gap * 0.75, breakInside: 'avoid' as const }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: fs, fontWeight: 700, color: '#111827' }}>{p.title}</span>
                    {p.tech && <span style={{ fontSize: fs - 1, color: accent, marginLeft: 6, fontWeight: 500 }}>{p.tech}</span>}
                  </div>
                  {(p.start || p.end || p.ongoing) && (
                    <span style={{ fontSize: fs - 1, color: '#6b7280', flexShrink: 0 }}>
                      {fmtDate(p.start)}{(p.end || p.ongoing) ? ` – ${p.ongoing ? 'Ongoing' : fmtDate(p.end)}` : ''}
                    </span>
                  )}
                </div>
                {p.url && <div style={{ fontSize: fs - 1, color: accent, marginTop: 1 }}>{p.url}</div>}
                {p.description && (
                  <ul style={{ margin: '3px 0 0', paddingLeft: 14, color: '#374151', listStyleType: 'disc' }}>
                    {bullets(p.description, fs)}
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
          <div key="education" data-section="education" style={{ marginBottom: gap, ...ring('education') }} onClick={click('education')} className="cursor-pointer">
            <SectionHeader label="Education" />
            {items.map(e => (
              <div key={e.id} style={{ marginBottom: gap * 0.6, breakInside: 'avoid' as const }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4 }}>
                  <div>
                    <span style={{ fontSize: fs, fontWeight: 700, color: '#111827' }}>
                      {e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}
                    </span>
                    {e.school && <span style={{ fontSize: fs, color: accent, marginLeft: 6, fontWeight: 500 }}>{e.school}</span>}
                  </div>
                  <span style={{ fontSize: fs - 1, color: '#6b7280', flexShrink: 0 }}>
                    {e.startYear}{e.endYear ? ` – ${e.endYear}` : ''}
                  </span>
                </div>
                {e.gpa && <div style={{ fontSize: fs - 1, color: '#6b7280', marginTop: 1 }}>CGPA: {e.gpa}</div>}
              </div>
            ))}
          </div>
        );
      }
      case 'skills': {
        if (!enabledSections.includes('skills') || !skills.length) return null;
        return (
          <div key="skills" data-section="skills" style={{ marginBottom: gap, ...ring('skills') }} onClick={click('skills')} className="cursor-pointer">
            <SectionHeader label="Technical Skills" />
            <div style={{ fontSize: fs - 0.5, color: '#1f2937', lineHeight: 1.65 }}>{skills.join(' · ')}</div>
          </div>
        );
      }
      case 'softskills': {
        const items = V(data.softskills);
        if (!enabledSections.includes('softskills') || !items.length) return null;
        return (
          <div key="softskills" data-section="softskills" style={{ marginBottom: gap, ...ring('softskills') }} onClick={click('softskills')} className="cursor-pointer">
            <SectionHeader label="Soft Skills" />
            <div style={{ fontSize: fs - 0.5, color: '#1f2937' }}>{items.map(s => s.skill).join(' · ')}</div>
          </div>
        );
      }
      case 'languages': {
        const items = V(data.languages);
        if (!enabledSections.includes('languages') || !items.length) return null;
        return (
          <div key="languages" data-section="languages" style={{ marginBottom: gap, ...ring('languages') }} onClick={click('languages')} className="cursor-pointer">
            <SectionHeader label="Languages" />
            <div style={{ columns: 2, fontSize: fs - 0.5 }}>
              {items.map(l => (
                <div key={l.id} style={{ breakInside: 'avoid', marginBottom: 2 }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  {l.proficiency && <span style={{ color: '#6b7280' }}> [{l.proficiency}]</span>}
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
          <div key="certificates" data-section="certificates" style={{ marginBottom: gap, ...ring('certificates') }} onClick={click('certificates')} className="cursor-pointer">
            <SectionHeader label="Certifications" />
            <ul style={{ paddingLeft: 14, margin: 0, listStyleType: 'disc' }}>
              {items.map(c => (
                <li key={c.id} style={{ marginBottom: 2, fontSize: fs - 0.5 }}>
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
          <div key="coursework" data-section="coursework" style={{ marginBottom: gap, ...ring('coursework') }} onClick={click('coursework')} className="cursor-pointer">
            <SectionHeader label="Relevant Coursework" />
            <div style={{ fontSize: fs - 0.5, color: '#1f2937', lineHeight: 1.65 }}>{items.map(c => c.course).join(' · ')}</div>
          </div>
        );
      }
      case 'involvement': {
        const items = V(data.involvement);
        if (!enabledSections.includes('involvement') || !items.length) return null;
        return (
          <div key="involvement" data-section="involvement" style={{ marginBottom: gap, ...ring('involvement') }} onClick={click('involvement')} className="cursor-pointer">
            <SectionHeader label="Positions of Responsibility" />
            {items.map(e => <WorkEntry key={e.id} role={e.role} org={e.organization} start={e.start} end={e.end} current={e.current} desc={e.description} />)}
          </div>
        );
      }
      case 'awards': {
        const items = V(data.awards);
        if (!enabledSections.includes('awards') || !items.length) return null;
        return (
          <div key="awards" data-section="awards" style={{ marginBottom: gap, ...ring('awards') }} onClick={click('awards')} className="cursor-pointer">
            <SectionHeader label="Awards & Honors" />
            <ul style={{ paddingLeft: 14, margin: 0, listStyleType: 'disc' }}>
              {items.map(a => (
                <li key={a.id} style={{ marginBottom: 2, fontSize: fs - 0.5 }}>
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
          <div key="achievements" data-section="achievements" style={{ marginBottom: gap, ...ring('achievements') }} onClick={click('achievements')} className="cursor-pointer">
            <SectionHeader label="Achievements" />
            <ul style={{ paddingLeft: 14, margin: 0, listStyleType: 'disc' }}>
              {items.map(a => (
                <li key={a.id} style={{ marginBottom: 2, fontSize: fs - 0.5 }}>
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
          <div key="publications" data-section="publications" style={{ marginBottom: gap, ...ring('publications') }} onClick={click('publications')} className="cursor-pointer">
            <SectionHeader label="Publications" />
            <ul style={{ paddingLeft: 14, margin: 0, listStyleType: 'disc' }}>
              {items.map(p => (
                <li key={p.id} style={{ marginBottom: 2, fontSize: fs - 0.5 }}>
                  <span style={{ fontWeight: 600 }}>{p.title}</span>
                  {p.publisher && <span style={{ color: accent }}> · {p.publisher}</span>}
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
          <div key="leadership" data-section="leadership" style={{ marginBottom: gap, ...ring('leadership') }} onClick={click('leadership')} className="cursor-pointer">
            <SectionHeader label="Leadership" />
            {items.map(e => <WorkEntry key={e.id} role={e.role} org={e.organization} start={e.start} end={e.end} current={e.current} desc={e.description} />)}
          </div>
        );
      }
      case 'volunteering': {
        const items = V(data.volunteering);
        if (!enabledSections.includes('volunteering') || !items.length) return null;
        return (
          <div key="volunteering" data-section="volunteering" style={{ marginBottom: gap, ...ring('volunteering') }} onClick={click('volunteering')} className="cursor-pointer">
            <SectionHeader label="Volunteering" />
            {items.map(e => (
              <div key={e.id} style={{ marginBottom: gap * 0.6, breakInside: 'avoid' as const }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: fs, fontWeight: 700, color: '#111827' }}>{e.role}</span>
                  <span style={{ fontSize: fs - 1, color: '#6b7280', flexShrink: 0 }}>
                    {fmtDate(e.start ?? '')}{(e.end || e.current) ? ` – ${e.current ? 'Present' : fmtDate(e.end ?? '')}` : ''}
                  </span>
                </div>
                <div style={{ fontSize: fs - 0.5, color: accent, fontWeight: 500 }}>{e.organization}</div>
              </div>
            ))}
          </div>
        );
      }
      case 'extracurricular': {
        const items = V(data.extracurricular);
        if (!enabledSections.includes('extracurricular') || !items.length) return null;
        return (
          <div key="extracurricular" data-section="extracurricular" style={{ marginBottom: gap, ...ring('extracurricular') }} onClick={click('extracurricular')} className="cursor-pointer">
            <SectionHeader label="Extracurricular" />
            <ul style={{ paddingLeft: 14, margin: 0, listStyleType: 'disc' }}>
              {items.map(e => (
                <li key={e.id} style={{ marginBottom: 2, fontSize: fs - 0.5 }}>
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
          <div key="hobbies" data-section="hobbies" style={{ marginBottom: gap, ...ring('hobbies') }} onClick={click('hobbies')} className="cursor-pointer">
            <SectionHeader label="Interests" />
            <div style={{ fontSize: fs - 0.5, color: '#1f2937' }}>{items.map(h => h.name).join(' · ')}</div>
          </div>
        );
      }
      case 'conferences': {
        const items = V(data.conferences);
        if (!enabledSections.includes('conferences') || !items.length) return null;
        return (
          <div key="conferences" data-section="conferences" style={{ marginBottom: gap, ...ring('conferences') }} onClick={click('conferences')} className="cursor-pointer">
            <SectionHeader label="Conferences" />
            <ul style={{ paddingLeft: 14, margin: 0, listStyleType: 'disc' }}>
              {items.map(c => (
                <li key={c.id} style={{ marginBottom: 2, fontSize: fs - 0.5 }}>
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
          <div key="patents" data-section="patents" style={{ marginBottom: gap, ...ring('patents') }} onClick={click('patents')} className="cursor-pointer">
            <SectionHeader label="Patents" />
            <ul style={{ paddingLeft: 14, margin: 0, listStyleType: 'disc' }}>
              {items.map(p => (
                <li key={p.id} style={{ marginBottom: 2, fontSize: fs - 0.5 }}>
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
          <div key="references" data-section="references" style={{ marginBottom: gap, ...ring('references') }} onClick={click('references')} className="cursor-pointer">
            <SectionHeader label="References" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {items.map(r => (
                <div key={r.id} style={{ fontSize: fs - 0.5, minWidth: 160 }}>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  {r.title && <div style={{ color: '#374151' }}>{r.title}{r.company ? `, ${r.company}` : ''}</div>}
                  {r.email && <div style={{ color: '#6b7280', fontSize: fs - 1 }}>{r.email}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      }
      default: return null;
    }
  };

  const contactItems = [
    personal.phone, personal.email, personal.location,
    ...personal.links.filter(l => l.url).map(l => l.url),
  ].filter(Boolean);

  return (
    <div
      id="resume-template3"
      style={{ fontFamily: font, fontSize: fs, color: '#111827', backgroundColor: '#ffffff', padding: pad, minHeight: '100%', lineHeight: 1.4, position: 'relative' }}
    >
      {/* ── Header: centered with accent title ───────────────────────── */}
      <div
        data-section="personal"
        onClick={click('personal')}
        className="cursor-pointer"
        style={{ textAlign: 'center', marginBottom: gap * 0.8, position: 'relative', ...ring('personal') }}
      >
        {options.showPhoto && personal.image?.url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={personal.image.url}
            alt="Profile"
            width={60} height={60}
            style={{ position: 'absolute', top: 0, right: 0, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}50` }}
            crossOrigin="anonymous"
          />
        )}
        <h1 style={{ fontSize: fs + 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
          {personal.firstName} {personal.lastName}
        </h1>
        {personal.professionalTitle && (
          <p style={{ fontSize: fs + 2, color: accent, fontWeight: 600, margin: '4px 0 0', letterSpacing: '0.02em' }}>
            {personal.professionalTitle}
          </p>
        )}
        {/* Contacts with dot separators */}
        {contactItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontSize: fs - 1, color: '#4b5563', marginTop: 6, gap: 4 }}>
            {contactItems.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: '#9ca3af', fontSize: fs - 2 }}>●</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* ── Thin decorative rule ──────────────────────────────────────── */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, marginBottom: gap }} />

      {/* ── Summary ──────────────────────────────────────────────────── */}
      {personal.summary && (
        <div data-section="personal" style={{ marginBottom: gap, textAlign: 'center' }}>
          <p style={{ fontSize: fs - 0.5, color: '#374151', lineHeight: 1.6, margin: '0 auto', maxWidth: '85%' }}>
            {personal.summary}
          </p>
        </div>
      )}

      {/* ── Sections ─────────────────────────────────────────────────── */}
      {orderedIds.map(id => renderSection(id))}
    </div>
  );
}
