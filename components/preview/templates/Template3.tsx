import React from 'react';
import type { ResumeData, TemplateOptions } from '@/types/resume.types';
import { ACCENT_COLORS, FONT_FAMILY_MAP } from '@/types/resume.types';
import type { ResumePageRenderLayout } from '@/lib/resumePageLayout';

interface Props {
  data: ResumeData;
  options: TemplateOptions;
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
  pageLayout?: ResumePageRenderLayout;
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

function skillLine(s: string, fs: number) {
  const colon = s.indexOf(': ');
  if (colon > 0) {
    return <li style={{ fontSize: fs - 0.5, color: '#1f2937', marginBottom: 2, lineHeight: 1.55 }}>
      <span style={{ fontWeight: 700 }}>{s.slice(0, colon)}</span>
      <span style={{ color: '#374151' }}>: {s.slice(colon + 2)}</span>
    </li>;
  }
  return <li style={{ fontSize: fs - 0.5, color: '#1f2937', marginBottom: 2, lineHeight: 1.55 }}>{s}</li>;
}

function bullets(text: string, fs: number) {
  return text.split('\n').filter(Boolean).map((line, i) => (
    <li key={i} style={{ marginBottom: 1.5, lineHeight: 1.45, fontSize: fs - 0.5 }}>
      {line.replace(/^[-•]\s*/, '')}
    </li>
  ));
}

const IC3: React.CSSProperties = { display: 'inline-block', verticalAlign: 'middle', marginRight: 3, color: '#6b7280' };

const T3PhoneIcon    = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC3}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;
const T3EmailIcon    = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC3}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
const T3LocationIcon = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC3}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
const T3LinkedInIcon = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC3}><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-9 6H7v10h3V9zm6.5 0c-1.93 0-2.8 1.06-3 1.8V9H10v10h3v-5.5c0-1.38 1.12-2.5 2.5-2.5S18 12.12 18 13.5V19h3v-5.5c0-2.49-2.01-4.5-4.5-4.5zM8.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>;
const T3GitHubIcon   = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC3}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>;
const T3TwitterIcon  = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC3}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const T3GlobeIcon    = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC3}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
const T3DiscordIcon  = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC3}><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>;
const T3FigmaIcon    = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC3}><path d="M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5zM12 2h3.5a3.5 3.5 0 110 7H12V2zM5 12a3.5 3.5 0 013.5-3.5H12v7H8.5A3.5 3.5 0 015 12zm3.5 3.5H12V22H8.5a3.5 3.5 0 110-7z"/></svg>;
const T3ExtLinkIcon  = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={IC3}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

function getLinkIcon3(type: string) {
  switch (type) {
    case 'linkedin':  return <T3LinkedInIcon />;
    case 'github':    return <T3GitHubIcon />;
    case 'twitter':   return <T3TwitterIcon />;
    case 'website':   return <T3GlobeIcon />;
    case 'portfolio': return <T3GlobeIcon />;
    case 'discord':   return <T3DiscordIcon />;
    case 'figma':     return <T3FigmaIcon />;
    default:          return <T3ExtLinkIcon />;
  }
}

// Professional Executive template — centered header with accent title, dot contacts, prominent sections
export function Template3({ data, options, activeSection, onSectionClick, pageLayout }: Props) {
  const {
    personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null },
    experience = [], education = [], skills = [], sectionOrder = [], enabledSections = [],
  } = data;

  const accent     = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#0f766e';
  const linkColor  = options.linkColor || accent;
  const font       = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fs         = options.fontSize === 'sm' ? 9.5 : options.fontSize === 'lg' ? 11.5 : 10.5;
  const gap        = options.spacing === 'compact' ? 7 : options.spacing === 'relaxed' ? 14 : 10;
  const pad        = options.pagePadding === 'narrow' ? '10px 16px' : options.pagePadding === 'wide' ? '24px 40px' : '16px 28px';
  const lw         = options.lineWeight === 'thin' ? 0.6 : options.lineWeight === 'thick' ? 1.6 : 1;
  const showIcons  = options.showContactIcons !== false;
  const imgPx      = options.imageSize === 'sm' ? 56 : options.imageSize === 'lg' ? 88 : 72;
  const imgRadius  = options.imageShape === 'square' ? 4 : options.imageShape === 'rounded' ? 12 : '50%';
  const pageStyle: React.CSSProperties = pageLayout?.mode === 'columns'
    ? {
        width: pageLayout.contentWidth,
        height: pageLayout.contentHeight,
        minHeight: pageLayout.contentHeight,
        padding: 0,
        columnWidth: pageLayout.contentWidth,
        columnGap: 0,
        columnFill: 'auto',
      }
    : pageLayout?.mode === 'print'
      ? { width: '100%', minHeight: 0, padding: 0 }
      : { minHeight: '100%', padding: pad };

  const ring = (id: string): React.CSSProperties =>
    activeSection === id
      ? {
          boxShadow: `inset 0 0 0 2px ${accent}`,
          borderRadius: 3,
          boxDecorationBreak: 'clone',
          WebkitBoxDecorationBreak: 'clone',
        }
      : {};
  const click = (id: string) => (e: React.MouseEvent) => { e.stopPropagation(); onSectionClick?.(id); };

  // Professional: larger UPPERCASE + thin gray rule
  const SectionHeader = ({ label }: { label: string }) => (
    <div style={{ marginBottom: 6, marginTop: 2 }}>
      <h2 style={{
        fontSize: fs + 0.5, fontWeight: 700, color: '#111827',
        textTransform: 'uppercase', lineHeight: 1.2, marginBottom: 3,
      }}>
        {label}
      </h2>
      <div style={{ height: 0.75 * lw, backgroundColor: '#d1d5db' }} />
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
                {p.url && <div style={{ fontSize: fs - 1, color: linkColor, marginTop: 1 }}>{p.url}</div>}
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
                {e.gpa && <div style={{ fontSize: fs - 1, color: '#6b7280', marginTop: 1 }}>{e.gpaType === 'percentage' ? `Percentage: ${e.gpa}%` : `CGPA: ${e.gpa}`}</div>}
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
            <ul style={{ margin: 0, paddingLeft: 14, listStyleType: 'disc' }}>
              {skills.map((s, i) => React.cloneElement(skillLine(s, fs), { key: i }))}
            </ul>
          </div>
        );
      }
      case 'softskills': {
        const items = V(data.softskills);
        if (!enabledSections.includes('softskills') || !items.length) return null;
        return (
          <div key="softskills" data-section="softskills" style={{ marginBottom: gap, ...ring('softskills') }} onClick={click('softskills')} className="cursor-pointer">
            <SectionHeader label="Soft Skills" />
            <ul style={{ margin: 0, paddingLeft: 14, listStyleType: 'disc' }}>
              {items.map(s => (
                <li key={s.id} style={{ fontSize: fs - 0.5, color: '#1f2937', marginBottom: 2, lineHeight: 1.55 }}>
                  <span style={{ fontWeight: 600 }}>{s.skill}</span>
                  {s.description && <span style={{ color: '#4b5563', fontWeight: 400 }}> – {s.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      case 'languages': {
        const items = V(data.languages);
        if (!enabledSections.includes('languages') || !items.length) return null;
        return (
          <div key="languages" data-section="languages" style={{ marginBottom: gap, ...ring('languages') }} onClick={click('languages')} className="cursor-pointer">
            <SectionHeader label="Languages" />
            <ul style={{ margin: 0, paddingLeft: 14, listStyleType: 'disc' }}>
              {items.map(l => (
                <li key={l.id} style={{ fontSize: fs - 0.5, marginBottom: 2, lineHeight: 1.55 }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  {l.proficiency && <span style={{ color: '#6b7280' }}> – {l.proficiency}</span>}
                </li>
              ))}
            </ul>
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

  const contactItems: { icon: React.ReactNode; text: string }[] = [];
  if (personal.phone)    contactItems.push({ icon: <T3PhoneIcon />,    text: personal.phone });
  if (personal.email)    contactItems.push({ icon: <T3EmailIcon />,    text: personal.email });
  if (personal.location) contactItems.push({ icon: <T3LocationIcon />, text: personal.location });
  for (const lnk of (personal.links ?? []).filter(l => l.url)) {
    contactItems.push({ icon: getLinkIcon3(lnk.type), text: lnk.url });
  }

  return (
    <div
      id="resume-template3"
      data-resume-layout={pageLayout?.mode}
      style={{ fontFamily: font, fontSize: fs, color: '#111827', backgroundColor: '#ffffff', lineHeight: 1.4, ...pageStyle }}
    >
      {/* ── Header: centered with accent title ───────────────────────── */}
      <div
        data-section="personal"
        onClick={click('personal')}
        className="cursor-pointer"
        style={{ textAlign: 'center', marginBottom: gap * 0.8, ...ring('personal') }}
      >
        {/* Profile photo — centered above name, 1:1 ratio via overflow:hidden */}
        {options.showPhoto && personal.image?.url && (
          <div style={{
            width: imgPx, height: imgPx, borderRadius: imgRadius, overflow: 'hidden',
            border: options.imageBorder !== false ? `2px solid ${accent}` : 'none',
            marginBottom: 8, marginLeft: 'auto', marginRight: 'auto', flexShrink: 0,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={personal.image.url}
              alt="Profile"
              loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}
        <h1 style={{ fontSize: fs + 14, fontWeight: 800, color: '#111827', lineHeight: 1.05, margin: 0 }}>
          {personal.firstName} {personal.lastName}
        </h1>
        {personal.professionalTitle && (
          <p style={{ fontSize: fs + 2, color: accent, fontWeight: 600, margin: '4px 0 0' }}>
            {personal.professionalTitle}
          </p>
        )}
        {/* Contacts: icon + text, dot (●) separators */}
        {contactItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontSize: fs - 1, color: '#4b5563', marginTop: 6, gap: 4 }}>
            {contactItems.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: '#9ca3af', fontSize: fs - 2 }}>●</span>}
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {showIcons && item.icon}
                  {item.text}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* ── Thin decorative rule ──────────────────────────────────────── */}
      <div style={{ height: 2 * lw, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, marginBottom: gap }} />

      {/* ── Summary ──────────────────────────────────────────────────── */}
      {personal.summary && (
        <div data-section="personal" onClick={click('personal')} className="cursor-pointer" style={{ marginBottom: gap, textAlign: 'center', ...ring('personal') }}>
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
