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

// Modern Clean template — centered header, pipe contacts, bold-underline sections
export function Template2({ data, options, activeSection, onSectionClick }: Props) {
  const {
    personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null },
    experience = [], education = [], skills = [], sectionOrder = [], enabledSections = [],
  } = data;

  const accent  = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#1d4ed8';
  const font    = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fs      = options.fontSize === 'sm' ? 10 : options.fontSize === 'lg' ? 12 : 11;
  const gap     = options.spacing === 'compact' ? 8 : options.spacing === 'relaxed' ? 16 : 11;
  const pad     = options.pagePadding === 'narrow' ? '12px 20px' : options.pagePadding === 'wide' ? '28px 48px' : '20px 36px';

  const ring = (id: string): React.CSSProperties =>
    activeSection === id ? { outline: `2px solid ${accent}`, outlineOffset: 2, borderRadius: 3 } : {};
  const click = (id: string) => (e: React.MouseEvent) => { e.stopPropagation(); onSectionClick?.(id); };

  const SectionHeader = ({ label }: { label: string }) => (
    <div style={{ marginBottom: 7, marginTop: 2 }}>
      <h2 style={{
        fontSize: fs, fontWeight: 700, letterSpacing: '0.07em', color: '#111827',
        textTransform: 'uppercase', marginBottom: 3, lineHeight: 1.2,
      }}>
        {label}
      </h2>
      <div style={{ height: 2, backgroundColor: accent, borderRadius: 1 }} />
    </div>
  );

  const DateStr = ({ start, end, current }: { start?: string; end?: string; current?: boolean }) => (
    <span style={{ fontSize: fs - 1, color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
      {fmtDate(start ?? '')}{(end || current) ? ` – ${current ? 'Present' : fmtDate(end ?? '')}` : ''}
    </span>
  );

  const WorkEntry = ({ role, org, location, start, end, current, desc }: {
    role?: string; org?: string; location?: string;
    start?: string; end?: string; current?: boolean; desc?: string;
  }) => (
    <div style={{ marginBottom: gap * 0.8, breakInside: 'avoid' as const }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
        <div>
          <span style={{ fontSize: fs, fontWeight: 700, color: '#111827' }}>{org || role}</span>
          {org && role && (
            <span style={{ fontSize: fs - 0.5, color: '#374151', fontStyle: 'italic', marginLeft: 6 }}>
              {role}{location ? ` · ${location}` : ''}
            </span>
          )}
          {!org && location && (
            <span style={{ fontSize: fs - 0.5, color: '#6b7280', marginLeft: 6 }}>{location}</span>
          )}
        </div>
        <DateStr start={start} end={end} current={current} />
      </div>
      {desc && (
        <ul style={{ margin: '3px 0 0', paddingLeft: 16, color: '#374151', listStyleType: 'disc' }}>
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
            <SectionHeader label="Experience" />
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
              <div key={p.id} style={{ marginBottom: gap * 0.8, breakInside: 'avoid' as const }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: fs, fontWeight: 700, color: '#111827' }}>{p.title}</span>
                    {p.tech && <span style={{ fontSize: fs - 1, color: '#6b7280', fontStyle: 'italic', marginLeft: 6 }}>{p.tech}</span>}
                    {p.url && <span style={{ fontSize: fs - 1, color: accent, marginLeft: 6 }}>↗ {p.url}</span>}
                  </div>
                  {(p.start || p.end || p.ongoing) && (
                    <span style={{ fontSize: fs - 1, color: '#6b7280', flexShrink: 0 }}>
                      {fmtDate(p.start)}{(p.end || p.ongoing) ? ` – ${p.ongoing ? 'Ongoing' : fmtDate(p.end)}` : ''}
                    </span>
                  )}
                </div>
                {p.description && (
                  <ul style={{ margin: '3px 0 0', paddingLeft: 16, color: '#374151', listStyleType: 'disc' }}>
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
              <div key={e.id} style={{ marginBottom: gap * 0.7, breakInside: 'avoid' as const, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: fs, fontWeight: 700, color: '#111827' }}>{e.school}</div>
                  <div style={{ fontSize: fs - 0.5, color: '#374151', fontStyle: 'italic' }}>
                    {e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}
                  </div>
                  {e.gpa && <div style={{ fontSize: fs - 1, color: '#6b7280' }}>GPA: {e.gpa}</div>}
                </div>
                <span style={{ fontSize: fs - 1, color: '#6b7280', flexShrink: 0 }}>
                  {e.startYear}{e.endYear ? ` – ${e.endYear}` : ''}
                </span>
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
            <p style={{ fontSize: fs - 0.5, color: '#374151', lineHeight: 1.65, margin: 0 }}>{skills.join(' · ')}</p>
          </div>
        );
      }
      case 'softskills': {
        const items = V(data.softskills);
        if (!enabledSections.includes('softskills') || !items.length) return null;
        return (
          <div key="softskills" data-section="softskills" style={{ marginBottom: gap, ...ring('softskills') }} onClick={click('softskills')} className="cursor-pointer">
            <SectionHeader label="Soft Skills" />
            <p style={{ fontSize: fs - 0.5, color: '#374151', margin: 0 }}>{items.map(s => s.skill).join(' · ')}</p>
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
            <ul style={{ paddingLeft: 16, margin: 0, listStyleType: 'disc' }}>
              {items.map(c => (
                <li key={c.id} style={{ marginBottom: 3, fontSize: fs - 0.5 }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  {c.issueDate && <span style={{ color: '#6b7280' }}> ({fmtDate(c.issueDate)})</span>}
                  {c.issuer && <span style={{ color: '#374151' }}> – {c.issuer}</span>}
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
            <p style={{ fontSize: fs - 0.5, color: '#374151', lineHeight: 1.65, margin: 0 }}>{items.map(c => c.course).join(' · ')}</p>
          </div>
        );
      }
      case 'involvement': {
        const items = V(data.involvement);
        if (!enabledSections.includes('involvement') || !items.length) return null;
        return (
          <div key="involvement" data-section="involvement" style={{ marginBottom: gap, ...ring('involvement') }} onClick={click('involvement')} className="cursor-pointer">
            <SectionHeader label="Involvement" />
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
            {items.map(a => (
              <div key={a.id} style={{ marginBottom: gap * 0.6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <div>
                  <span style={{ fontSize: fs, fontWeight: 600 }}>{a.name}</span>
                  {a.issuer && <span style={{ fontSize: fs - 0.5, color: '#374151', marginLeft: 6 }}>{a.issuer}</span>}
                  {a.description && <div style={{ fontSize: fs - 1, color: '#6b7280', marginTop: 1 }}>{a.description}</div>}
                </div>
                {a.date && <span style={{ fontSize: fs - 1, color: '#6b7280', flexShrink: 0 }}>{a.date}</span>}
              </div>
            ))}
          </div>
        );
      }
      case 'achievements': {
        const items = V(data.achievements);
        if (!enabledSections.includes('achievements') || !items.length) return null;
        return (
          <div key="achievements" data-section="achievements" style={{ marginBottom: gap, ...ring('achievements') }} onClick={click('achievements')} className="cursor-pointer">
            <SectionHeader label="Achievements" />
            <ul style={{ paddingLeft: 16, margin: 0, listStyleType: 'disc' }}>
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
            {items.map(p => (
              <div key={p.id} style={{ marginBottom: gap * 0.6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <div>
                  <span style={{ fontSize: fs, fontWeight: 600 }}>{p.title}</span>
                  {p.publisher && <span style={{ fontSize: fs - 0.5, color: accent, marginLeft: 6 }}>{p.publisher}</span>}
                  {p.description && <div style={{ fontSize: fs - 1, color: '#6b7280', marginTop: 1 }}>{p.description}</div>}
                </div>
                {p.date && <span style={{ fontSize: fs - 1, color: '#6b7280', flexShrink: 0 }}>{fmtDate(p.date)}</span>}
              </div>
            ))}
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
            {items.map(e => <WorkEntry key={e.id} role={e.role} org={e.organization} start={e.start} end={e.end} current={e.current} />)}
          </div>
        );
      }
      case 'extracurricular': {
        const items = V(data.extracurricular);
        if (!enabledSections.includes('extracurricular') || !items.length) return null;
        return (
          <div key="extracurricular" data-section="extracurricular" style={{ marginBottom: gap, ...ring('extracurricular') }} onClick={click('extracurricular')} className="cursor-pointer">
            <SectionHeader label="Extracurricular" />
            <ul style={{ paddingLeft: 16, margin: 0, listStyleType: 'disc' }}>
              {items.map(e => (
                <li key={e.id} style={{ marginBottom: 2, fontSize: fs - 0.5 }}>
                  <span style={{ fontWeight: 600 }}>{e.activity}</span>
                  {e.organization && <span style={{ color: '#374151' }}> · {e.organization}</span>}
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
            <p style={{ fontSize: fs - 0.5, color: '#374151', margin: 0 }}>{items.map(h => h.name).join(' · ')}</p>
          </div>
        );
      }
      case 'conferences': {
        const items = V(data.conferences);
        if (!enabledSections.includes('conferences') || !items.length) return null;
        return (
          <div key="conferences" data-section="conferences" style={{ marginBottom: gap, ...ring('conferences') }} onClick={click('conferences')} className="cursor-pointer">
            <SectionHeader label="Conferences" />
            <ul style={{ paddingLeft: 16, margin: 0, listStyleType: 'disc' }}>
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
            <ul style={{ paddingLeft: 16, margin: 0, listStyleType: 'disc' }}>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {items.map(r => (
                <div key={r.id} style={{ fontSize: fs - 0.5, minWidth: 160 }}>
                  <div style={{ fontWeight: 700 }}>{r.name}</div>
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
      id="resume-template2"
      style={{ fontFamily: font, fontSize: fs, color: '#1a1a1a', backgroundColor: '#ffffff', padding: pad, minHeight: '100%', lineHeight: 1.45, position: 'relative' }}
    >
      {/* ── Header: centered ──────────────────────────────────────────── */}
      <div
        data-section="personal"
        onClick={click('personal')}
        className="cursor-pointer"
        style={{ marginBottom: gap + 2, textAlign: 'center', position: 'relative', ...ring('personal') }}
      >
        {options.showPhoto && personal.image?.url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={personal.image.url}
            alt="Profile"
            width={64} height={64}
            style={{ position: 'absolute', top: 0, right: 0, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}40` }}
            crossOrigin="anonymous"
          />
        )}
        <h1 style={{ fontSize: fs + 12, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', lineHeight: 1.05, margin: 0 }}>
          {personal.firstName} {personal.lastName}
        </h1>
        {personal.professionalTitle && (
          <p style={{ fontSize: fs + 1, color: '#6b7280', fontWeight: 400, margin: '3px 0 0', letterSpacing: '0.01em' }}>
            {personal.professionalTitle}
          </p>
        )}
        {contactItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontSize: fs - 1, color: '#374151', marginTop: 6, lineHeight: 1.5, gap: 2 }}>
            {contactItems.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: '#d1d5db', margin: '0 6px' }}>|</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <div style={{ height: 2, backgroundColor: accent, margin: '8px 0 0', borderRadius: 1 }} />
      </div>

      {personal.summary && (
        <div data-section="personal" style={{ marginBottom: gap }}>
          <SectionHeader label="Profile" />
          <p style={{ fontSize: fs - 0.5, color: '#374151', lineHeight: 1.6, margin: 0 }}>{personal.summary}</p>
        </div>
      )}

      {orderedIds.map(id => renderSection(id))}
    </div>
  );
}
