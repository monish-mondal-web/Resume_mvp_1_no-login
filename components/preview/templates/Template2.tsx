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
    <li key={i} style={{ marginBottom: 2, lineHeight: 1.45 }}>
      {line.replace(/^[-•]\s*/, '')}
    </li>
  ));
}

export function Template2({ data, options, activeSection, onSectionClick }: Props) {
  const { personal, experience, education, skills, sectionOrder, enabledSections } = data;
  const accent  = ACCENT_COLORS[options.accentColor]?.hex ?? '#1a1a1a';
  const font    = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fsBase  = options.fontSize === 'sm' ? 10 : options.fontSize === 'lg' ? 12 : 11;
  const gap     = options.spacing === 'compact' ? 8 : options.spacing === 'relaxed' ? 16 : 11;

  const sectionRing = (id: string): React.CSSProperties =>
    activeSection === id
      ? { outline: `2px solid ${accent}`, outlineOffset: 3, borderRadius: 4, transition: 'outline 200ms ease' }
      : {};

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onSectionClick?.(id);
  };

  // moderncv banking-style section header: uppercase bold + full-width underline
  const SectionHeader = ({ label }: { label: string }) => (
    <div style={{ marginBottom: 7 }}>
      <h2 style={{ fontSize: fsBase + 0.5, fontWeight: 700, color: '#1a1a1a', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </h2>
      <div style={{ height: 1.5, backgroundColor: '#1a1a1a', borderRadius: 1 }} />
    </div>
  );

  const DateStr = ({ start, end, current }: { start?: string; end?: string; current?: boolean }) => (
    <span style={{ fontSize: fsBase - 1, color: '#6b7280', whiteSpace: 'nowrap' }}>
      {fmtDate(start ?? '')}{(end || current) ? ` – ${current ? 'Present' : fmtDate(end ?? '')}` : ''}
    </span>
  );

  // Reusable entry layout used by experience, internships, leadership, etc.
  const Entry = ({ role, org, sub, start, end, current, description }: {
    role: string; org?: string; sub?: string;
    start?: string; end?: string; current?: boolean; description?: string;
  }) => (
    <div style={{ marginBottom: gap * 0.8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <div>
          <span style={{ fontSize: fsBase, fontWeight: 700, color: '#111827' }}>{role}</span>
          {org && <span style={{ fontSize: fsBase - 0.5, color: '#374151', marginLeft: 6 }}>({org})</span>}
          {sub && <div style={{ fontSize: fsBase - 1, color: '#6b7280', fontStyle: 'italic' }}>{sub}</div>}
        </div>
        {(start || end || current) && <DateStr start={start} end={end} current={current} />}
      </div>
      {description && (
        <ul style={{ margin: '3px 0 0', paddingLeft: 16, fontSize: fsBase - 0.5, color: '#374151', listStyleType: 'disc' }}>
          {bullets(description)}
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
          <div key="experience" data-section="experience" style={{ marginBottom: gap, ...sectionRing('experience') }} onClick={handleClick('experience')} className="cursor-pointer">
            <SectionHeader label="Professional Experience" />
            {items.map(e => <Entry key={e.id} role={e.role} org={e.company} sub={e.location} start={e.start} end={e.end} current={e.currentlyWorking} description={e.description} />)}
          </div>
        );
      }

      case 'internships': {
        const items = V(data.internships);
        if (!enabledSections.includes('internships') || !items.length) return null;
        return (
          <div key="internships" data-section="internships" style={{ marginBottom: gap, ...sectionRing('internships') }} onClick={handleClick('internships')} className="cursor-pointer">
            <SectionHeader label="Internships" />
            {items.map(e => <Entry key={e.id} role={e.role} org={e.company} sub={e.location} start={e.start} end={e.end} current={e.currentlyWorking} description={e.description} />)}
          </div>
        );
      }

      case 'freelance': {
        const items = V(data.freelance);
        if (!enabledSections.includes('freelance') || !items.length) return null;
        return (
          <div key="freelance" data-section="freelance" style={{ marginBottom: gap, ...sectionRing('freelance') }} onClick={handleClick('freelance')} className="cursor-pointer">
            <SectionHeader label="Freelance Work" />
            {items.map(e => <Entry key={e.id} role={e.role} org={e.client} start={e.start} end={e.end} current={e.currentlyWorking} description={e.description} />)}
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
              <div key={p.id} style={{ marginBottom: gap * 0.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                  <div>
                    <span style={{ fontSize: fsBase, fontWeight: 700, color: '#111827' }}>{p.title}</span>
                    {p.tech && <span style={{ fontSize: fsBase - 1, color: '#6b7280', marginLeft: 6, fontStyle: 'italic' }}>{p.tech}</span>}
                    {p.url && <span style={{ fontSize: fsBase - 1, color: accent, marginLeft: 6 }}>↗ {p.url}</span>}
                  </div>
                  {(p.start || p.end || p.ongoing) && (
                    <span style={{ fontSize: fsBase - 1, color: '#6b7280' }}>
                      {fmtDate(p.start)}{p.end || p.ongoing ? ` – ${p.ongoing ? 'Ongoing' : fmtDate(p.end)}` : ''}
                    </span>
                  )}
                </div>
                {p.description && (
                  <ul style={{ margin: '3px 0 0', paddingLeft: 16, fontSize: fsBase - 0.5, color: '#374151', listStyleType: 'disc' }}>
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
              <div key={e.id} style={{ marginBottom: gap * 0.7, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <div>
                  <div style={{ fontSize: fsBase, fontWeight: 700, color: '#111827' }}>{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}</div>
                  <div style={{ fontSize: fsBase - 0.5, color: '#374151' }}>{e.school}</div>
                  {e.gpa && <div style={{ fontSize: fsBase - 1, color: '#6b7280' }}>GPA: {e.gpa}</div>}
                </div>
                <span style={{ fontSize: fsBase - 1, color: '#6b7280' }}>
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
          <div key="skills" data-section="skills" style={{ marginBottom: gap, ...sectionRing('skills') }} onClick={handleClick('skills')} className="cursor-pointer">
            <SectionHeader label="Areas of Expertise" />
            <p style={{ fontSize: fsBase - 0.5, color: '#374151', lineHeight: 1.65 }}>
              {skills.join(' · ')}
            </p>
          </div>
        );
      }

      case 'softskills': {
        const items = V(data.softskills);
        if (!enabledSections.includes('softskills') || !items.length) return null;
        return (
          <div key="softskills" data-section="softskills" style={{ marginBottom: gap, ...sectionRing('softskills') }} onClick={handleClick('softskills')} className="cursor-pointer">
            <SectionHeader label="Soft Skills" />
            <p style={{ fontSize: fsBase - 0.5, color: '#374151' }}>{items.map(s => s.skill).join(' · ')}</p>
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
          <div key="certificates" data-section="certificates" style={{ marginBottom: gap, ...sectionRing('certificates') }} onClick={handleClick('certificates')} className="cursor-pointer">
            <SectionHeader label="Online Courses & Certifications" />
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: fsBase - 0.5, listStyleType: 'disc' }}>
              {items.map(c => (
                <li key={c.id} style={{ marginBottom: 3 }}>
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
          <div key="coursework" data-section="coursework" style={{ marginBottom: gap, ...sectionRing('coursework') }} onClick={handleClick('coursework')} className="cursor-pointer">
            <SectionHeader label="Relevant Coursework" />
            <p style={{ fontSize: fsBase - 0.5, color: '#374151', lineHeight: 1.65 }}>
              {items.map(c => c.course).join(' · ')}
            </p>
          </div>
        );
      }

      case 'involvement': {
        const items = V(data.involvement);
        if (!enabledSections.includes('involvement') || !items.length) return null;
        return (
          <div key="involvement" data-section="involvement" style={{ marginBottom: gap, ...sectionRing('involvement') }} onClick={handleClick('involvement')} className="cursor-pointer">
            <SectionHeader label="Involvement" />
            {items.map(e => <Entry key={e.id} role={e.role} org={e.organization} start={e.start} end={e.end} current={e.current} description={e.description} />)}
          </div>
        );
      }

      case 'awards': {
        const items = V(data.awards);
        if (!enabledSections.includes('awards') || !items.length) return null;
        return (
          <div key="awards" data-section="awards" style={{ marginBottom: gap, ...sectionRing('awards') }} onClick={handleClick('awards')} className="cursor-pointer">
            <SectionHeader label="Awards & Honors" />
            {items.map(a => (
              <div key={a.id} style={{ marginBottom: gap * 0.6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <div>
                  <span style={{ fontSize: fsBase, fontWeight: 600 }}>{a.name}</span>
                  {a.issuer && <span style={{ fontSize: fsBase - 0.5, color: '#374151', marginLeft: 6 }}>{a.issuer}</span>}
                  {a.description && <div style={{ fontSize: fsBase - 1, color: '#6b7280', marginTop: 1 }}>{a.description}</div>}
                </div>
                {a.date && <span style={{ fontSize: fsBase - 1, color: '#6b7280' }}>{a.date}</span>}
              </div>
            ))}
          </div>
        );
      }

      case 'achievements': {
        const items = V(data.achievements);
        if (!enabledSections.includes('achievements') || !items.length) return null;
        return (
          <div key="achievements" data-section="achievements" style={{ marginBottom: gap, ...sectionRing('achievements') }} onClick={handleClick('achievements')} className="cursor-pointer">
            <SectionHeader label="Achievements" />
            {items.map(a => (
              <div key={a.id} style={{ marginBottom: gap * 0.6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <div>
                  <span style={{ fontSize: fsBase, fontWeight: 600 }}>{a.title}</span>
                  {a.issuer && <span style={{ fontSize: fsBase - 0.5, color: '#374151', marginLeft: 6 }}>{a.issuer}</span>}
                  {a.description && <div style={{ fontSize: fsBase - 1, color: '#6b7280', marginTop: 1 }}>{a.description}</div>}
                </div>
                {a.date && <span style={{ fontSize: fsBase - 1, color: '#6b7280' }}>{a.date}</span>}
              </div>
            ))}
          </div>
        );
      }

      case 'publications': {
        const items = V(data.publications);
        if (!enabledSections.includes('publications') || !items.length) return null;
        return (
          <div key="publications" data-section="publications" style={{ marginBottom: gap, ...sectionRing('publications') }} onClick={handleClick('publications')} className="cursor-pointer">
            <SectionHeader label="Publications" />
            {items.map(p => (
              <div key={p.id} style={{ marginBottom: gap * 0.6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <div>
                  <span style={{ fontSize: fsBase, fontWeight: 600 }}>{p.title}</span>
                  {p.publisher && <span style={{ fontSize: fsBase - 0.5, color: accent, marginLeft: 6 }}>{p.publisher}</span>}
                  {p.description && <div style={{ fontSize: fsBase - 1, color: '#6b7280', marginTop: 1 }}>{p.description}</div>}
                </div>
                {p.date && <span style={{ fontSize: fsBase - 1, color: '#6b7280' }}>{fmtDate(p.date)}</span>}
              </div>
            ))}
          </div>
        );
      }

      case 'leadership': {
        const items = V(data.leadership);
        if (!enabledSections.includes('leadership') || !items.length) return null;
        return (
          <div key="leadership" data-section="leadership" style={{ marginBottom: gap, ...sectionRing('leadership') }} onClick={handleClick('leadership')} className="cursor-pointer">
            <SectionHeader label="Leadership" />
            {items.map(e => <Entry key={e.id} role={e.role} org={e.organization} start={e.start} end={e.end} current={e.current} description={e.description} />)}
          </div>
        );
      }

      case 'volunteering': {
        const items = V(data.volunteering);
        if (!enabledSections.includes('volunteering') || !items.length) return null;
        return (
          <div key="volunteering" data-section="volunteering" style={{ marginBottom: gap, ...sectionRing('volunteering') }} onClick={handleClick('volunteering')} className="cursor-pointer">
            <SectionHeader label="Volunteering" />
            {items.map(e => <Entry key={e.id} role={e.role} org={e.organization} start={e.start} end={e.end} current={e.current} description={e.description} />)}
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
            <p style={{ fontSize: fsBase - 0.5, color: '#374151' }}>{items.map(h => h.name).join(' · ')}</p>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {items.map(r => (
                <div key={r.id} style={{ fontSize: fsBase - 0.5, minWidth: 160 }}>
                  <div style={{ fontWeight: 700 }}>{r.name}</div>
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
      id="resume-template2"
      style={{
        fontFamily: font,
        fontSize: fsBase,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        padding: '20px 36px',
        minHeight: '100%',
        lineHeight: 1.45,
      }}
    >
      {/* ── Header — centered moderncv banking style ──────────────────────── */}
      <div
        data-section="personal"
        onClick={handleClick('personal')}
        className="cursor-pointer"
        style={{ textAlign: 'center', marginBottom: gap + 4, marginTop: 0, ...sectionRing('personal') }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 14 }}>
          {options.showPhoto && personal.image?.url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={personal.image.url}
              alt="Profile"
              width={64}
              height={64}
              style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb', flexShrink: 0, marginTop: 4 }}
              crossOrigin="anonymous"
            />
          )}
          <div>
            <h1 style={{ fontSize: fsBase + 10, fontWeight: 700, letterSpacing: '0.05em', color: '#1a1a1a', lineHeight: 1.05, marginBottom: 3, marginTop: 0 }}>
              {personal.firstName} {personal.lastName}
            </h1>
            {personal.professionalTitle && (
              <p style={{ fontSize: fsBase + 0.5, color: '#374151', fontWeight: 500 }}>{personal.professionalTitle}</p>
            )}
          </div>
        </div>

        {/* Rule + contact row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0 0' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#9ca3af' }} />
          {contactItems.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 12px', fontSize: fsBase - 1.5, color: '#374151' }}>
              {contactItems.map((item, i) => <span key={i}>{item}</span>)}
            </div>
          )}
          <div style={{ flex: 1, height: 1, backgroundColor: '#9ca3af' }} />
        </div>
      </div>

      {/* ── Profile/Summary ────────────────────────────────────────────────── */}
      {personal.summary && (
        <div
          data-section="personal"
          onClick={handleClick('personal')}
          className="cursor-pointer"
          style={{ marginBottom: gap }}
        >
          <SectionHeader label="Profile" />
          <p style={{ fontSize: fsBase - 0.5, color: '#374151', lineHeight: 1.6 }}>{personal.summary}</p>
        </div>
      )}

      {/* ── Dynamic sections ──────────────────────────────────────────────── */}
      {orderedIds.map(id => renderSection(id))}
    </div>
  );
}
