'use client';

/* eslint-disable react-hooks/static-components */

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

const IC: React.CSSProperties = { display: 'inline-block', verticalAlign: 'middle', marginRight: 3, color: '#6b7280' };

const PhoneIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);
const EmailIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-9 6H7v10h3V9zm6.5 0c-1.93 0-2.8 1.06-3 1.8V9H10v10h3v-5.5c0-1.38 1.12-2.5 2.5-2.5S18 12.12 18 13.5V19h3v-5.5c0-2.49-2.01-4.5-4.5-4.5zM8.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);
const DiscordIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);
const FigmaIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5zM12 2h3.5a3.5 3.5 0 110 7H12V2zM5 12a3.5 3.5 0 013.5-3.5H12v7H8.5A3.5 3.5 0 015 12zm3.5 3.5H12V22H8.5a3.5 3.5 0 110-7z"/>
  </svg>
);
const DribbbleIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.424 25.424 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.814 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"/>
  </svg>
);
const BehanceIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.477.603.406.274.718.633.937 1.08.22.445.328.985.328 1.618 0 .692-.157 1.275-.47 1.753-.315.478-.79.876-1.425 1.193.858.245 1.503.682 1.93 1.31.425.63.638 1.39.638 2.28 0 .7-.13 1.304-.39 1.81a3.52 3.52 0 01-1.056 1.24 4.57 4.57 0 01-1.58.714 7.65 7.65 0 01-1.93.237H0V4.503h6.938zm-.32 5.53c.558 0 1.01-.13 1.358-.39.348-.26.522-.666.522-1.218 0-.31-.056-.566-.168-.768a1.28 1.28 0 00-.46-.49 1.95 1.95 0 00-.678-.264 3.85 3.85 0 00-.824-.083H2.68v3.214h3.94zm.17 5.776c.31 0 .605-.03.882-.093.278-.062.52-.165.726-.308.206-.143.37-.34.49-.588.12-.247.18-.558.18-.932 0-.738-.207-1.27-.622-1.596-.414-.326-.967-.49-1.657-.49H2.68v4.007h4.107zM17.717 9.12c-.525 0-.996.09-1.41.268a3.06 3.06 0 00-1.04.74 3.14 3.14 0 00-.632 1.1 4.37 4.37 0 00-.216 1.374c0 .505.072.978.216 1.415.144.437.358.817.64 1.138.283.32.632.572 1.048.754.416.183.892.274 1.427.274.74 0 1.363-.174 1.87-.52.508-.347.867-.893 1.08-1.64h2.05c-.217.975-.69 1.76-1.418 2.354-.73.594-1.693.89-2.893.89a5.48 5.48 0 01-2.005-.356 4.47 4.47 0 01-1.528-1.003 4.5 4.5 0 01-.977-1.572A5.83 5.83 0 0115.3 12c0-.74.116-1.423.35-2.05a4.65 4.65 0 011.01-1.597c.44-.45.97-.798 1.59-1.048.617-.25 1.31-.375 2.077-.375.63 0 1.22.09 1.776.27.554.18 1.04.44 1.456.78.415.34.745.756.99 1.25.245.493.383 1.05.41 1.67h-2.113c-.08-.766-.35-1.32-.812-1.663-.46-.342-1.043-.514-1.746-.514l.43.396zM15.95 6.38h5.28V7.8h-5.28V6.38z"/>
  </svg>
);
const SketchIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={IC}>
    <path d="M4.987 3.193L12 2l7.013 1.193L24 8.89l-12 13.11L0 8.89l4.987-5.697zM5.5 9.5l6.5 7 6.5-7H5.5zm.85-1.5h11.3L12 3.9 6.35 8zM2.5 9.5l3.5 4-4-4.5.5.5zm16.5 4l3.5-4 .5-.5-4 4.5z"/>
  </svg>
);
const ExternalLinkIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={IC}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

function getLinkIcon(type: string) {
  switch (type) {
    case 'linkedin':  return <LinkedInIcon />;
    case 'github':    return <GitHubIcon />;
    case 'twitter':   return <TwitterIcon />;
    case 'website':   return <GlobeIcon />;
    case 'portfolio': return <GlobeIcon />;
    case 'discord':   return <DiscordIcon />;
    case 'figma':     return <FigmaIcon />;
    case 'dribbble':  return <DribbbleIcon />;
    case 'behance':   return <BehanceIcon />;
    case 'sketch':    return <SketchIcon />;
    default:          return <ExternalLinkIcon />;
  }
}

// Centered header template — "John Doe" style
export function Template1({ data, options, activeSection, onSectionClick }: Props) {
  const {
    personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null },
    experience = [], education = [], skills = [], sectionOrder = [], enabledSections = [],
  } = data;

  const accent     = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#4f46e5';
  const linkColor  = options.linkColor || accent;
  const font       = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const headFont   = options.headingFont ? FONT_FAMILY_MAP[options.headingFont] : font;
  const fs         = options.fontSize === 'sm' ? 9.5 : options.fontSize === 'lg' ? 11.5 : 10.5;
  const gap        = options.spacing === 'compact' ? 7 : options.spacing === 'relaxed' ? 14 : 10;
  const pad        = options.pagePadding === 'narrow' ? '10px 16px' : options.pagePadding === 'wide' ? '24px 40px' : '16px 28px';
  const lw         = options.lineWeight === 'thin' ? 0.6 : options.lineWeight === 'thick' ? 1.6 : 1;
  const showIcons  = options.showContactIcons !== false;
  const imgPx      = options.imageSize === 'sm' ? 48 : options.imageSize === 'lg' ? 80 : 64;
  const imgRadius  = options.imageShape === 'square' ? 4 : options.imageShape === 'rounded' ? 10 : '50%';

  const ring = (id: string): React.CSSProperties =>
    activeSection === id ? { outline: `2px solid ${accent}`, outlineOffset: 2, borderRadius: 3 } : {};
  const click = (id: string) => (e: React.MouseEvent) => { e.stopPropagation(); onSectionClick?.(id); };

  const SectionHeader = ({ label }: { label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5, marginTop: 2 }}>
      <h2 style={{
        fontSize: fs - 1, fontWeight: 700, color: '#111827',
        textTransform: 'uppercase', whiteSpace: 'nowrap', marginRight: 8, flexShrink: 0,
        lineHeight: 1.2, fontFamily: headFont,
      }}>
        {label}
      </h2>
      <div style={{ flex: 1, height: 0.75 * lw, backgroundColor: accent }} />
    </div>
  );

  const DateStr = ({ start, end, current }: { start?: string; end?: string; current?: boolean }) => (
    <span style={{ fontSize: fs - 1.5, color: '#4b5563', fontStyle: 'italic', whiteSpace: 'nowrap', flexShrink: 0 }}>
      {fmtDate(start ?? '')}{(end || current) ? ` – ${current ? 'Present' : fmtDate(end ?? '')}` : ''}
    </span>
  );

  const WorkEntry = ({ role, org, location, start, end, current, desc }: {
    role?: string; org?: string; location?: string;
    start?: string; end?: string; current?: boolean; desc?: string;
  }) => (
    <div style={{ marginBottom: gap * 0.75, breakInside: 'avoid' as const }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4 }}>
        {/* Left: Bold Role, (italic accent Company) */}
        <span style={{ fontSize: fs, color: '#111827' }}>
          <span style={{ fontWeight: 700 }}>{role}</span>
          {org && (
            <span style={{ fontWeight: 400 }}>
              {', '}
              <span style={{ fontStyle: 'italic', color: accent }}>({org})</span>
            </span>
          )}
        </span>
        {/* Right: Location  Start–End */}
        <span style={{ fontSize: fs - 1.5, color: '#4b5563', fontStyle: 'italic', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {location ? `${location}  ` : ''}
          <DateStr start={start} end={end} current={current} />
        </span>
      </div>
      {desc && (
        <ul style={{ margin: '2px 0 0', paddingLeft: 14, color: '#1f2937', listStyleType: 'disc' }}>
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
                  <span style={{ fontSize: fs, fontWeight: 700, color: '#111827' }}>
                    {p.title}
                    {p.tech && <span style={{ fontSize: fs - 1, fontWeight: 400, fontStyle: 'italic', color: '#4b5563', marginLeft: 6 }}>| {p.tech}</span>}
                  </span>
                  {(p.start || p.end || p.ongoing) && (
                    <span style={{ fontSize: fs - 1.5, color: '#4b5563', fontStyle: 'italic', flexShrink: 0 }}>
                      {fmtDate(p.start)}{(p.end || p.ongoing) ? ` – ${p.ongoing ? 'Ongoing' : fmtDate(p.end)}` : ''}
                    </span>
                  )}
                </div>
                {p.url && <div style={{ fontSize: fs - 1, color: linkColor }}>{p.url}</div>}
                {p.description && (
                  <ul style={{ margin: '2px 0 0', paddingLeft: 14, color: '#1f2937', listStyleType: 'disc' }}>
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
                  <span style={{ fontSize: fs, fontWeight: 700, color: '#111827' }}>
                    {e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}
                  </span>
                  {e.gpa && <span style={{ fontSize: fs - 1.5, color: '#4b5563', fontStyle: 'italic', flexShrink: 0 }}>{e.gpaType === 'percentage' ? `Percentage: ${e.gpa}%` : `CGPA: ${e.gpa}`}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: fs - 0.5, fontStyle: 'italic', color: '#374151' }}>{e.school}</span>
                  <span style={{ fontSize: fs - 1.5, color: '#4b5563', fontStyle: 'italic', flexShrink: 0 }}>
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
                  {l.proficiency && <span style={{ color: '#4b5563' }}> – {l.proficiency}</span>}
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
                  <span style={{ fontSize: fs, fontWeight: 700 }}>{e.role}</span>
                  <span style={{ fontSize: fs - 1.5, color: '#4b5563', fontStyle: 'italic', flexShrink: 0 }}>
                    {fmtDate(e.start ?? '')}{(e.end || e.current) ? ` – ${e.current ? 'Present' : fmtDate(e.end ?? '')}` : ''}
                  </span>
                </div>
                <div style={{ fontSize: fs - 0.5, fontStyle: 'italic', color: '#374151' }}>{e.organization}</div>
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

  // Contact row items
  const contactRow1: { icon: React.ReactNode; text: string }[] = [];
  if (personal.phone) contactRow1.push({ icon: <PhoneIcon />, text: personal.phone });
  if (personal.email) contactRow1.push({ icon: <EmailIcon />, text: personal.email });
  if (personal.location) contactRow1.push({ icon: <LocationIcon />, text: personal.location });

  const linkItems = (personal.links ?? []).filter(l => l.url);

  const contactItemStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', fontSize: 8.5, color: '#4b5563',
  };

  return (
    <div
      id="resume-template1"
      style={{ fontFamily: font, fontSize: fs, color: '#111827', backgroundColor: '#ffffff', padding: pad, minHeight: '100%', lineHeight: 1.4 }}
    >
      {/* ── Header: fully centered ──────────────────────────────────────── */}
      <div
        data-section="personal"
        onClick={click('personal')}
        className="cursor-pointer"
        style={{ textAlign: 'center', marginBottom: gap * 0.5, ...ring('personal') }}
      >
        {/* Profile photo — wrapper div guarantees 1:1 ratio via overflow:hidden */}
        {options.showPhoto && personal.image?.url && (
          <div style={{
            width: imgPx, height: imgPx, borderRadius: imgRadius, overflow: 'hidden',
            border: options.imageBorder !== false ? `2px solid ${accent}` : 'none',
            marginBottom: 6, marginLeft: 'auto', marginRight: 'auto',
            flexShrink: 0,
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

        {/* Name */}
        <h1 style={{
          fontSize: 24, fontWeight: 800, color: '#0f172a',
          lineHeight: 1.1, margin: 0, fontFamily: headFont,
        }}>
          {personal.firstName} {personal.lastName}
        </h1>

        {/* Professional title */}
        {personal.professionalTitle && (
          <div style={{ fontSize: 10, color: '#4b5563', fontStyle: 'italic', marginTop: 2 }}>
            {personal.professionalTitle}
          </div>
        )}

        {/* Contact row 1: phone, email, location */}
        {contactRow1.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 5 }}>
            {showIcons
              ? contactRow1.map((item, i) => (
                  <span key={i} style={contactItemStyle}>
                    {item.icon}{item.text}
                  </span>
                ))
              : contactRow1.map((item, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span style={{ color: '#9ca3af', fontSize: 8.5 }}>·</span>}
                    <span style={{ fontSize: 8.5, color: '#4b5563' }}>{item.text}</span>
                  </React.Fragment>
                ))
            }
          </div>
        )}

        {/* Links row: linkedin, github, twitter, etc. */}
        {linkItems.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 3 }}>
            {showIcons
              ? linkItems.map((lnk, i) => (
                  <span key={i} style={contactItemStyle}>
                    {getLinkIcon(lnk.type)}{lnk.url}
                  </span>
                ))
              : linkItems.map((lnk, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span style={{ color: '#9ca3af', fontSize: 8.5 }}>·</span>}
                    <span style={{ fontSize: 8.5, color: '#4b5563' }}>{lnk.url}</span>
                  </React.Fragment>
                ))
            }
          </div>
        )}
      </div>

      {/* ── Full-width accent rule ───────────────────────────────────── */}
      <div style={{ height: 1.5 * lw, backgroundColor: accent, marginBottom: gap * 0.8 }} />

      {/* ── Profile / Summary ─────────────────────────────────────────── */}
      {personal.summary && (
        <div data-section="personal" onClick={click('personal')} className="cursor-pointer" style={{ marginBottom: gap, ...ring('personal') }}>
          <SectionHeader label="Profile" />
          <p style={{ fontSize: fs - 0.5, color: '#374151', lineHeight: 1.6, margin: 0, textAlign: 'justify' }}>{personal.summary}</p>
        </div>
      )}

      {/* ── Sections ────────────────────────────────────────────────── */}
      {orderedIds.map(id => renderSection(id))}
    </div>
  );
}
