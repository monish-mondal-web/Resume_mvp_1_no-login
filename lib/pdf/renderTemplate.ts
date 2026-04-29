import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';
import { ACCENT_COLORS, FONT_FAMILY_MAP } from '@/types/resume.types';

const ENTRY = 'break-inside:avoid;page-break-inside:avoid';

// ── Helpers ──────────────────────────────────────────────────────────────────

function esc(s: unknown): string {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function V<T extends { isHidden?: boolean }>(arr: T[] | undefined): T[] {
  return (arr ?? []).filter(e => !e.isHidden);
}

function fmtDate(d: string): string {
  if (!d) return '';
  const [y, m] = d.split('-');
  if (!m) return y;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1] ?? m} ${y}`;
}

function dateRange(start?: string, end?: string, current?: boolean): string {
  const s = fmtDate(start ?? '');
  const e = current ? 'Present' : fmtDate(end ?? '');
  if (!s && !e) return '';
  return e ? `${s} – ${e}` : s;
}

// disc bullet list
function bulletsHtml(text: string, fs: number): string {
  return text.split('\n').filter(Boolean).map(line =>
    `<li style="font-size:${fs - 0.5}px;margin-bottom:1.5px;line-height:1.45">${esc(line.replace(/^[-•]\s*/, ''))}</li>`
  ).join('');
}

// em-dash bullet divs (Template2 style)
function emDashBulletsHtml(text: string, fs: number): string {
  return text.split('\n').filter(Boolean).map(line =>
    `<div style="font-size:${fs - 0.5}px;margin-bottom:1.5px;line-height:1.45;padding-left:8px">– ${esc(line.replace(/^[-–•]\s*/, ''))}</div>`
  ).join('');
}

// ── Inline SVG icons (9×9) ────────────────────────────────────────────────────

const SVG_STYLE = 'display:inline-block;vertical-align:middle;margin-right:3px;color:#6b7280';

const I = {
  phone:    `<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="${SVG_STYLE}"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
  email:    `<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="${SVG_STYLE}"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
  location: `<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="${SVG_STYLE}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  linkedin: `<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="${SVG_STYLE}"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-9 6H7v10h3V9zm6.5 0c-1.93 0-2.8 1.06-3 1.8V9H10v10h3v-5.5c0-1.38 1.12-2.5 2.5-2.5S18 12.12 18 13.5V19h3v-5.5c0-2.49-2.01-4.5-4.5-4.5zM8.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>`,
  github:   `<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="${SVG_STYLE}"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  twitter:  `<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="${SVG_STYLE}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  globe:    `<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="${SVG_STYLE}"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
  discord:  `<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="${SVG_STYLE}"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>`,
  figma:    `<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="${SVG_STYLE}"><path d="M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5zM12 2h3.5a3.5 3.5 0 110 7H12V2zM5 12a3.5 3.5 0 013.5-3.5H12v7H8.5A3.5 3.5 0 015 12zm3.5 3.5H12V22H8.5a3.5 3.5 0 110-7z"/></svg>`,
  extlink:  `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="${SVG_STYLE}"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};

function linkIcon(type: string): string {
  switch (type) {
    case 'linkedin':  return I.linkedin;
    case 'github':    return I.github;
    case 'twitter':   return I.twitter;
    case 'website':
    case 'portfolio': return I.globe;
    case 'discord':   return I.discord;
    case 'figma':     return I.figma;
    default:          return I.extlink;
  }
}

// ── Work entry renderers ──────────────────────────────────────────────────────

// Template1: Bold Role, (italic accent Company)   italic-date right
function t1WorkEntry(
  role: string | undefined, org: string | undefined, location: string | undefined,
  start: string | undefined, end: string | undefined, current: boolean | undefined,
  description: string | undefined,
  fs: number, gap: number, accent: string,
): string {
  const dr = dateRange(start, end, current);
  const locDate = `${location ? `${esc(location)}  ` : ''}${esc(dr)}`;
  return `<div style="margin-bottom:${gap * 0.75}px;${ENTRY}">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">
      <span style="font-size:${fs}px;color:#111827">
        <span style="font-weight:700">${esc(role)}</span>${org ? `, <span style="font-style:italic;color:${accent}">(${esc(org)})</span>` : ''}
      </span>
      ${locDate ? `<span style="font-size:${fs - 1.5}px;color:#4b5563;font-style:italic;white-space:nowrap;flex-shrink:0">${locDate}</span>` : ''}
    </div>
    ${description ? `<ul style="margin:2px 0 0;padding-left:14px;list-style-type:disc">${bulletsHtml(description, fs)}</ul>` : ''}
  </div>`;
}

// Template2: • Bold Role   date / Company   location / em-dash bullets
function t2WorkEntry(
  role: string | undefined, org: string | undefined, location: string | undefined,
  start: string | undefined, end: string | undefined, current: boolean | undefined,
  description: string | undefined,
  fs: number, gap: number,
): string {
  const dr = dateRange(start, end, current);
  return `<div style="margin-bottom:${gap * 0.8}px;${ENTRY}">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">
      <span style="font-size:${fs}px;font-weight:700;color:#111827">• ${esc(role)}</span>
      ${dr ? `<span style="font-size:${fs - 1}px;color:#6b7280;white-space:nowrap;flex-shrink:0">${esc(dr)}</span>` : ''}
    </div>
    ${org ? `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">
      <span style="font-size:${fs - 0.5}px;color:#374151">${esc(org)}</span>
      ${location ? `<span style="font-size:${fs - 1}px;color:#6b7280;font-style:italic;flex-shrink:0">${esc(location)}</span>` : ''}
    </div>` : ''}
    ${description ? emDashBulletsHtml(description, fs) : ''}
  </div>`;
}

// Template3: Bold Role   accent Company   date / italic location / bullets
function t3WorkEntry(
  role: string | undefined, org: string | undefined, location: string | undefined,
  start: string | undefined, end: string | undefined, current: boolean | undefined,
  description: string | undefined,
  fs: number, gap: number, accent: string,
): string {
  const dr = dateRange(start, end, current);
  return `<div style="margin-bottom:${gap * 0.75}px;${ENTRY}">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px;flex-wrap:wrap">
      <div>
        <span style="font-size:${fs}px;font-weight:700;color:#111827">${esc(role)}</span>
        ${org ? `<span style="font-size:${fs}px;color:${accent};font-weight:500;margin-left:6px">${esc(org)}</span>` : ''}
      </div>
      ${dr ? `<span style="font-size:${fs - 1}px;color:#6b7280;white-space:nowrap;flex-shrink:0">${esc(dr)}</span>` : ''}
    </div>
    ${location ? `<div style="font-size:${fs - 1}px;color:#6b7280;font-style:italic;margin-top:1px">${esc(location)}</div>` : ''}
    ${description ? `<ul style="margin:3px 0 0;padding-left:14px;list-style-type:disc">${bulletsHtml(description, fs)}</ul>` : ''}
  </div>`;
}

// ── Shared section builder ────────────────────────────────────────────────────

type TemplateStyle = 't1' | 't2' | 't3';

function buildSectionRenderer(
  data: ResumeData, fs: number, gap: number, accent: string, linkColor: string,
  style: TemplateStyle,
  sectionHeaderHtml: (label: string) => string,
) {
  const { experience = [], education = [], skills = [], enabledSections = [] } = data;

  function dateStr(start?: string, end?: string, current?: boolean) {
    const dr = dateRange(start, end, current);
    return dr ? `<span style="font-size:${fs - 1}px;color:#6b7280;white-space:nowrap">${esc(dr)}</span>` : '';
  }

  function workEntry(
    role: string | undefined, org: string | undefined, location: string | undefined,
    start: string | undefined, end: string | undefined, current: boolean | undefined,
    desc: string | undefined,
  ) {
    if (style === 't1') return t1WorkEntry(role, org, location, start, end, current, desc, fs, gap, accent);
    if (style === 't2') return t2WorkEntry(role, org, location, start, end, current, desc, fs, gap);
    return t3WorkEntry(role, org, location, start, end, current, desc, fs, gap, accent);
  }

  return function renderSection(id: string): string {
    switch (id) {
      case 'experience': {
        const items = V(experience);
        if (!enabledSections.includes('experience') || !items.length) return '';
        return `<div data-section="experience" style="margin-bottom:${gap}px">${sectionHeaderHtml('Professional Experience')}${items.map(e => workEntry(e.role, e.company, e.location, e.start, e.end, e.currentlyWorking, e.description)).join('')}</div>`;
      }
      case 'internships': {
        const items = V(data.internships);
        if (!enabledSections.includes('internships') || !items.length) return '';
        return `<div data-section="internships" style="margin-bottom:${gap}px">${sectionHeaderHtml('Internships')}${items.map(e => workEntry(e.role, e.company, e.location, e.start, e.end, e.currentlyWorking, e.description)).join('')}</div>`;
      }
      case 'freelance': {
        const items = V(data.freelance);
        if (!enabledSections.includes('freelance') || !items.length) return '';
        return `<div data-section="freelance" style="margin-bottom:${gap}px">${sectionHeaderHtml('Freelance Work')}${items.map(e => workEntry(e.role, e.client, undefined, e.start, e.end, e.currentlyWorking, e.description)).join('')}</div>`;
      }
      case 'projects': {
        const items = V(data.projects);
        if (!enabledSections.includes('projects') || !items.length) return '';
        const entries = items.map(p => {
          const dr = (p.start || p.end || p.ongoing)
            ? `<span style="font-size:${fs - 1}px;color:#6b7280;flex-shrink:0">${esc(fmtDate(p.start))}${(p.end || p.ongoing) ? ` – ${p.ongoing ? 'Ongoing' : esc(fmtDate(p.end))}` : ''}</span>`
            : '';
          const techSpan = p.tech
            ? style === 't3'
              ? `<span style="font-size:${fs - 1}px;color:${accent};font-weight:500;margin-left:6px">${esc(p.tech)}</span>`
              : `<span style="font-size:${fs - 1}px;color:#6b7280;font-style:italic;margin-left:6px">${esc(p.tech)}</span>`
            : '';
          const descHtml = p.description
            ? style === 't2'
              ? emDashBulletsHtml(p.description, fs)
              : `<ul style="margin:3px 0 0;padding-left:14px;list-style-type:disc">${bulletsHtml(p.description, fs)}</ul>`
            : '';
          return `<div style="margin-bottom:${gap * 0.8}px;${ENTRY}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px;flex-wrap:wrap">
              <div><span style="font-size:${fs}px;font-weight:700;color:#111827">${esc(p.title)}</span>${techSpan}</div>
              ${dr}
            </div>
            ${p.url ? `<div style="font-size:${fs - 1}px;color:${linkColor};margin-top:1px">${esc(p.url)}</div>` : ''}
            ${descHtml}
          </div>`;
        }).join('');
        return `<div data-section="projects" style="margin-bottom:${gap}px">${sectionHeaderHtml('Projects')}${entries}</div>`;
      }
      case 'education': {
        const items = V(education);
        if (!enabledSections.includes('education') || !items.length) return '';
        const entries = items.map(e => {
          if (style === 't1') {
            // Template1: degree + italic school inline, date right
            return `<div style="margin-bottom:${gap * 0.6}px;${ENTRY}">
              <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">
                <span style="font-size:${fs}px;color:#111827">
                  <span style="font-weight:700">${esc(e.degree)}${e.fieldOfStudy ? ` in ${esc(e.fieldOfStudy)}` : ''}</span>
                  ${e.school ? `<span style="font-style:italic;color:#374151;margin-left:6px">${esc(e.school)}</span>` : ''}
                </span>
                <span style="font-size:${fs - 1.5}px;color:#4b5563;font-style:italic;flex-shrink:0">${esc(e.startYear)}${e.endYear ? ` – ${esc(e.endYear)}` : ''}</span>
              </div>
              ${e.gpa ? `<div style="font-size:${fs - 1}px;color:#6b7280;margin-top:1px">CGPA: ${esc(e.gpa)}</div>` : ''}
            </div>`;
          }
          if (style === 't2') {
            // Template2: • degree   date / school
            return `<div style="margin-bottom:${gap * 0.6}px;${ENTRY}">
              <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">
                <span style="font-size:${fs}px;font-weight:700;color:#111827">• ${esc(e.degree)}${e.fieldOfStudy ? ` in ${esc(e.fieldOfStudy)}` : ''}</span>
                <span style="font-size:${fs - 1}px;color:#6b7280;flex-shrink:0">${esc(e.startYear)}${e.endYear ? ` – ${esc(e.endYear)}` : ''}</span>
              </div>
              ${e.school ? `<div style="font-size:${fs - 0.5}px;color:#374151">${esc(e.school)}</div>` : ''}
              ${e.gpa ? `<div style="font-size:${fs - 1}px;color:#6b7280">CGPA: ${esc(e.gpa)}</div>` : ''}
            </div>`;
          }
          // t3: degree + accent school inline, date right
          return `<div style="margin-bottom:${gap * 0.6}px;${ENTRY}">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">
              <div>
                <span style="font-size:${fs}px;font-weight:700;color:#111827">${esc(e.degree)}${e.fieldOfStudy ? ` in ${esc(e.fieldOfStudy)}` : ''}</span>
                ${e.school ? `<span style="font-size:${fs}px;color:${accent};font-weight:500;margin-left:6px">${esc(e.school)}</span>` : ''}
              </div>
              <span style="font-size:${fs - 1}px;color:#6b7280;flex-shrink:0">${esc(e.startYear)}${e.endYear ? ` – ${esc(e.endYear)}` : ''}</span>
            </div>
            ${e.gpa ? `<div style="font-size:${fs - 1}px;color:#6b7280;margin-top:1px">CGPA: ${esc(e.gpa)}</div>` : ''}
          </div>`;
        }).join('');
        return `<div data-section="education" style="margin-bottom:${gap}px">${sectionHeaderHtml('Education')}${entries}</div>`;
      }
      case 'skills': {
        if (!enabledSections.includes('skills') || !skills.length) return '';
        const skillItems = skills.map(s => {
          const colon = s.indexOf(': ');
          if (colon > 0) {
            return `<li style="font-size:${fs - 0.5}px;color:#1f2937;margin-bottom:2px;line-height:1.55"><span style="font-weight:700">${esc(s.slice(0, colon))}</span><span style="color:#374151">: ${esc(s.slice(colon + 2))}</span></li>`;
          }
          return `<li style="font-size:${fs - 0.5}px;color:#1f2937;margin-bottom:2px;line-height:1.55">${esc(s)}</li>`;
        }).join('');
        return `<div data-section="skills" style="margin-bottom:${gap}px">${sectionHeaderHtml('Technical Skills')}<ul style="margin:0;padding-left:14px;list-style-type:disc">${skillItems}</ul></div>`;
      }
      case 'softskills': {
        const items = V(data.softskills);
        if (!enabledSections.includes('softskills') || !items.length) return '';
        const items2 = items.map(s =>
          `<li style="font-size:${fs - 0.5}px;color:#1f2937;margin-bottom:2px;line-height:1.55"><span style="font-weight:600">${esc(s.skill)}</span>${s.description ? `<span style="color:#4b5563"> – ${esc(s.description)}</span>` : ''}</li>`
        ).join('');
        return `<div data-section="softskills" style="margin-bottom:${gap}px">${sectionHeaderHtml('Soft Skills')}<ul style="margin:0;padding-left:14px;list-style-type:disc">${items2}</ul></div>`;
      }
      case 'languages': {
        const items = V(data.languages);
        if (!enabledSections.includes('languages') || !items.length) return '';
        return `<div data-section="languages" style="margin-bottom:${gap}px">${sectionHeaderHtml('Languages')}<ul style="margin:0;padding-left:14px;list-style-type:disc">${items.map(l => `<li style="font-size:${fs - 0.5}px;margin-bottom:2px;line-height:1.55"><span style="font-weight:600">${esc(l.language)}</span>${l.proficiency ? `<span style="color:#6b7280"> – ${esc(l.proficiency)}</span>` : ''}</li>`).join('')}</ul></div>`;
      }
      case 'certificates': {
        const items = V(data.certificates);
        if (!enabledSections.includes('certificates') || !items.length) return '';
        return `<div data-section="certificates" style="margin-bottom:${gap}px">${sectionHeaderHtml('Certifications')}<ul style="padding-left:14px;margin:0;list-style-type:disc">${items.map(c => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(c.name)}</span>${c.issuer ? `<span style="color:#374151"> – ${esc(c.issuer)}</span>` : ''}${c.issueDate ? `<span style="color:#6b7280"> (${esc(fmtDate(c.issueDate))})</span>` : ''}</li>`).join('')}</ul></div>`;
      }
      case 'coursework': {
        const items = V(data.coursework);
        if (!enabledSections.includes('coursework') || !items.length) return '';
        return `<div data-section="coursework" style="margin-bottom:${gap}px">${sectionHeaderHtml('Relevant Coursework')}<div style="font-size:${fs - 0.5}px;color:#1f2937;line-height:1.65">${esc(items.map(c => c.course).join(' · '))}</div></div>`;
      }
      case 'involvement': {
        const items = V(data.involvement);
        if (!enabledSections.includes('involvement') || !items.length) return '';
        return `<div data-section="involvement" style="margin-bottom:${gap}px">${sectionHeaderHtml('Positions of Responsibility')}${items.map(e => workEntry(e.role, e.organization, undefined, e.start, e.end, e.current, e.description)).join('')}</div>`;
      }
      case 'awards': {
        const items = V(data.awards);
        if (!enabledSections.includes('awards') || !items.length) return '';
        return `<div data-section="awards" style="margin-bottom:${gap}px">${sectionHeaderHtml('Awards & Honors')}<ul style="padding-left:14px;margin:0;list-style-type:disc">${items.map(a => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(a.name)}</span>${a.issuer ? `<span style="color:#374151"> · ${esc(a.issuer)}</span>` : ''}${a.description ? `<span style="color:#374151"> – ${esc(a.description)}</span>` : ''}</li>`).join('')}</ul></div>`;
      }
      case 'achievements': {
        const items = V(data.achievements);
        if (!enabledSections.includes('achievements') || !items.length) return '';
        return `<div data-section="achievements" style="margin-bottom:${gap}px">${sectionHeaderHtml('Achievements')}<ul style="padding-left:14px;margin:0;list-style-type:disc">${items.map(a => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(a.title)}</span>${a.description ? `<span style="color:#374151"> – ${esc(a.description)}</span>` : ''}</li>`).join('')}</ul></div>`;
      }
      case 'publications': {
        const items = V(data.publications);
        if (!enabledSections.includes('publications') || !items.length) return '';
        const pubColor = style === 't3' ? accent : '#374151';
        return `<div data-section="publications" style="margin-bottom:${gap}px">${sectionHeaderHtml('Publications')}<ul style="padding-left:14px;margin:0;list-style-type:disc">${items.map(p => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(p.title)}</span>${p.publisher ? `<span style="color:${pubColor}"> · ${esc(p.publisher)}</span>` : ''}${p.date ? `<span style="color:#6b7280"> (${esc(fmtDate(p.date))})</span>` : ''}</li>`).join('')}</ul></div>`;
      }
      case 'leadership': {
        const items = V(data.leadership);
        if (!enabledSections.includes('leadership') || !items.length) return '';
        return `<div data-section="leadership" style="margin-bottom:${gap}px">${sectionHeaderHtml('Leadership')}${items.map(e => workEntry(e.role, e.organization, undefined, e.start, e.end, e.current, e.description)).join('')}</div>`;
      }
      case 'volunteering': {
        const items = V(data.volunteering);
        if (!enabledSections.includes('volunteering') || !items.length) return '';
        if (style === 't3') {
          return `<div data-section="volunteering" style="margin-bottom:${gap}px">${sectionHeaderHtml('Volunteering')}${items.map(e => `<div style="margin-bottom:${gap * 0.6}px;${ENTRY}"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px"><span style="font-size:${fs}px;font-weight:700;color:#111827">${esc(e.role)}</span>${dateStr(e.start, e.end, e.current)}</div><div style="font-size:${fs - 0.5}px;color:${accent};font-weight:500">${esc(e.organization)}</div></div>`).join('')}</div>`;
        }
        return `<div data-section="volunteering" style="margin-bottom:${gap}px">${sectionHeaderHtml('Volunteering')}${items.map(e => workEntry(e.role, e.organization, undefined, e.start, e.end, e.current, undefined)).join('')}</div>`;
      }
      case 'extracurricular': {
        const items = V(data.extracurricular);
        if (!enabledSections.includes('extracurricular') || !items.length) return '';
        return `<div data-section="extracurricular" style="margin-bottom:${gap}px">${sectionHeaderHtml('Extracurricular')}<ul style="padding-left:14px;margin:0;list-style-type:disc">${items.map(e => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(e.activity)}</span>${e.organization ? `<span style="color:#374151"> · ${esc(e.organization)}</span>` : ''}${e.description ? `<span style="color:#374151"> – ${esc(e.description)}</span>` : ''}</li>`).join('')}</ul></div>`;
      }
      case 'hobbies': {
        const items = V(data.hobbies);
        if (!enabledSections.includes('hobbies') || !items.length) return '';
        return `<div data-section="hobbies" style="margin-bottom:${gap}px">${sectionHeaderHtml('Interests')}<div style="font-size:${fs - 0.5}px;color:#1f2937">${esc(items.map(h => h.name).join(' · '))}</div></div>`;
      }
      case 'conferences': {
        const items = V(data.conferences);
        if (!enabledSections.includes('conferences') || !items.length) return '';
        return `<div data-section="conferences" style="margin-bottom:${gap}px">${sectionHeaderHtml('Conferences')}<ul style="padding-left:14px;margin:0;list-style-type:disc">${items.map(c => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(c.title)}</span>${c.organizer ? `<span style="color:#374151"> · ${esc(c.organizer)}</span>` : ''}${c.date ? `<span style="color:#6b7280"> (${esc(fmtDate(c.date))})</span>` : ''}</li>`).join('')}</ul></div>`;
      }
      case 'patents': {
        const items = V(data.patents);
        if (!enabledSections.includes('patents') || !items.length) return '';
        return `<div data-section="patents" style="margin-bottom:${gap}px">${sectionHeaderHtml('Patents')}<ul style="padding-left:14px;margin:0;list-style-type:disc">${items.map(p => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(p.title)}</span>${p.issuer ? `<span style="color:#374151"> · ${esc(p.issuer)}</span>` : ''}</li>`).join('')}</ul></div>`;
      }
      case 'references': {
        const items = V(data.references);
        if (!enabledSections.includes('references') || !items.length) return '';
        return `<div data-section="references" style="margin-bottom:${gap}px">${sectionHeaderHtml('References')}<div style="display:flex;flex-wrap:wrap;gap:12px">${items.map(r => `<div style="font-size:${fs - 0.5}px;min-width:160px"><div style="font-weight:600">${esc(r.name)}</div>${r.title ? `<div style="color:#374151">${esc(r.title)}${r.company ? `, ${esc(r.company)}` : ''}</div>` : ''}${r.email ? `<div style="color:#6b7280;font-size:${fs - 1}px">${esc(r.email)}</div>` : ''}</div>`).join('')}</div></div>`;
      }
      default: return '';
    }
  };
}

// ── Template 1: Modern Centered ───────────────────────────────────────────────
// Centered header (photo above name), dot contacts, LABEL ──── section rule

function renderTemplate1(data: ResumeData, options: TemplateOptions): string {
  const { personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null }, sectionOrder = [], enabledSections = [] } = data;
  const accent    = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#4f46e5';
  const linkColor = options.linkColor || accent;
  const font      = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fs        = options.fontSize === 'sm' ? 9.5 : options.fontSize === 'lg' ? 11.5 : 10.5;
  const gap       = options.spacing === 'compact' ? 7 : options.spacing === 'relaxed' ? 14 : 10;
  const pad       = options.pagePadding === 'narrow' ? '10px 16px' : options.pagePadding === 'wide' ? '24px 40px' : '16px 28px';
  const lw        = options.lineWeight === 'thin' ? 0.6 : options.lineWeight === 'thick' ? 1.6 : 1;
  const showIcons = options.showContactIcons !== false;
  const imgPx     = options.imageSize === 'sm' ? 48 : options.imageSize === 'lg' ? 80 : 64;
  const imgR      = options.imageShape === 'square' ? '4px' : options.imageShape === 'rounded' ? '10px' : '50%';

  // LABEL ──── rule (label left, accent line extends right)
  const sectionHeader = (label: string) =>
    `<div style="display:flex;align-items:center;margin-bottom:5px;margin-top:2px">
      <h2 style="font-size:${fs - 1}px;font-weight:700;letter-spacing:0.1em;color:#111827;text-transform:uppercase;white-space:nowrap;margin-right:8px;flex-shrink:0;line-height:1.2;break-after:avoid;page-break-after:avoid">${esc(label)}</h2>
      <div style="flex:1;height:${(0.75 * lw).toFixed(2)}px;background-color:${accent}"></div>
    </div>`;

  const renderSection = buildSectionRenderer(data, fs, gap, accent, linkColor, 't1', sectionHeader);
  const orderedIds = [...sectionOrder.filter(id => id !== 'personal'), ...enabledSections.filter(id => id !== 'personal' && !sectionOrder.includes(id))];

  // Build centered contact items with icons
  const contacts: string[] = [];
  if (personal.phone)    contacts.push(`${showIcons ? I.phone : ''}${esc(personal.phone)}`);
  if (personal.email)    contacts.push(`${showIcons ? I.email : ''}${esc(personal.email)}`);
  if (personal.location) contacts.push(`${showIcons ? I.location : ''}${esc(personal.location)}`);
  for (const lnk of (personal.links ?? []).filter(l => l.url)) {
    contacts.push(`${showIcons ? linkIcon(lnk.type) : ''}${esc(lnk.url)}`);
  }
  const contactRowHtml = contacts.length
    ? `<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;font-size:${fs - 1}px;color:#4b5563;margin-top:5px;gap:12px">
        ${contacts.map(c => `<span style="display:inline-flex;align-items:center;gap:2px">${c}</span>`).join('')}
       </div>`
    : '';

  const photoHtml = options.showPhoto && personal.image?.url
    ? `<div style="width:${imgPx}px;height:${imgPx}px;border-radius:${imgR};overflow:hidden;border:2px solid ${accent};margin:0 auto 6px;"><img src="${esc(personal.image.url)}" style="width:100%;height:100%;object-fit:cover;display:block;" /></div>`
    : '';

  return `<div id="resume-template1" style="font-family:${esc(font)};font-size:${fs}px;color:#111827;background-color:#ffffff;padding:${pad};min-height:100%;line-height:1.4">
    <div data-section="personal" style="text-align:center;margin-bottom:${gap * 0.5}px">
      ${photoHtml}
      <h1 style="font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;line-height:1.05;margin:0">${esc(personal.firstName)} ${esc(personal.lastName)}</h1>
      ${personal.professionalTitle ? `<div style="font-size:${fs}px;color:#4b5563;font-style:italic;margin-top:2px">${esc(personal.professionalTitle)}</div>` : ''}
      ${contactRowHtml}
    </div>
    <div style="height:${(1.5 * lw).toFixed(2)}px;background-color:${accent};margin-bottom:${gap * 0.8}px"></div>
    ${personal.summary ? `<div data-section="personal" style="margin-bottom:${gap}px;text-align:center"><p style="font-size:${fs - 0.5}px;color:#374151;line-height:1.6;margin:0 auto;max-width:85%">${esc(personal.summary)}</p></div>` : ''}
    ${orderedIds.map(renderSection).join('')}
  </div>`;
}

// ── Template 2: Classic Academic ─────────────────────────────────────────────
// Two-column header (name+edu left, contacts right), black divider, CAPS+underline sections

function renderTemplate2(data: ResumeData, options: TemplateOptions): string {
  const { personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null }, sectionOrder = [], enabledSections = [], education = [] } = data;
  const accent    = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#1d4ed8';
  const linkColor = options.linkColor || accent;
  const font      = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fs        = options.fontSize === 'sm' ? 10 : options.fontSize === 'lg' ? 12 : 11;
  const gap       = options.spacing === 'compact' ? 8 : options.spacing === 'relaxed' ? 16 : 11;
  const pad       = options.pagePadding === 'narrow' ? '12px 20px' : options.pagePadding === 'wide' ? '28px 48px' : '20px 36px';
  const lw        = options.lineWeight === 'thin' ? 0.6 : options.lineWeight === 'thick' ? 1.6 : 1;
  const showIcons = options.showContactIcons !== false;
  const imgPx     = options.imageSize === 'sm' ? 44 : options.imageSize === 'lg' ? 70 : 56;
  const imgR      = options.imageShape === 'square' ? '4px' : options.imageShape === 'rounded' ? '8px' : '50%';

  // CAPS label + full-width accent rule below
  const sectionHeader = (label: string) =>
    `<div style="margin-bottom:7px;margin-top:2px">
      <h2 style="font-size:${fs}px;font-weight:700;letter-spacing:0.15em;color:#111827;text-transform:uppercase;margin-bottom:3px;line-height:1.2;break-after:avoid;page-break-after:avoid">${esc(label)}</h2>
      <div style="height:${(0.75 * lw).toFixed(2)}px;background-color:${accent};margin-bottom:5px"></div>
    </div>`;

  const renderSection = buildSectionRenderer(data, fs, gap, accent, linkColor, 't2', sectionHeader);
  const orderedIds = [...sectionOrder.filter(id => id !== 'personal'), ...enabledSections.filter(id => id !== 'personal' && !sectionOrder.includes(id))];

  // Use first education for left-column header display (like Template2.tsx)
  const firstEdu = V(education)[0];
  const links = (personal.links ?? []).filter(l => l.url);

  const photoHtml = options.showPhoto && personal.image?.url
    ? `<div style="width:${imgPx}px;height:${imgPx}px;border-radius:${imgR};overflow:hidden;border:1.5px solid #e5e7eb;flex-shrink:0;"><img src="${esc(personal.image.url)}" style="width:100%;height:100%;object-fit:cover;display:block;" /></div>`
    : '';

  const rightContacts = [
    personal.phone    ? `<div style="display:flex;align-items:center;justify-content:flex-end;gap:2px">${showIcons ? I.phone : ''}${esc(personal.phone)}</div>` : '',
    personal.email    ? `<div style="display:flex;align-items:center;justify-content:flex-end;gap:2px">${showIcons ? I.email : ''}${esc(personal.email)}</div>` : '',
    personal.location ? `<div style="display:flex;align-items:center;justify-content:flex-end;gap:2px">${showIcons ? I.location : ''}${esc(personal.location)}</div>` : '',
    ...links.map(lnk => `<div style="display:flex;align-items:center;justify-content:flex-end;gap:2px">${showIcons ? linkIcon(lnk.type) : ''}<span style="color:${linkColor}">${esc(lnk.url)}</span></div>`),
  ].filter(Boolean).join('');

  return `<div id="resume-template2" style="font-family:${esc(font)};font-size:${fs}px;color:#1a1a1a;background-color:#ffffff;padding:${pad};min-height:100%;line-height:1.45">
    <div data-section="personal" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:${gap * 0.5}px">
      <div style="display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0">
        ${photoHtml}
        <div style="min-width:0">
          <h1 style="font-size:18px;font-weight:700;color:#111827;letter-spacing:-0.01em;line-height:1.1;margin:0 0 2px">${esc(personal.firstName)} ${esc(personal.lastName)}</h1>
          ${firstEdu
            ? `<div style="font-size:9px;font-style:italic;color:#374151;margin-bottom:1px">${esc(firstEdu.degree)}${firstEdu.fieldOfStudy ? ` in ${esc(firstEdu.fieldOfStudy)}` : ''}</div>
               <div style="font-size:8.5px;color:#6b7280">${esc(firstEdu.school)}</div>
               ${personal.professionalTitle ? `<div style="font-size:8.5px;color:#6b7280;margin-top:1px">${esc(personal.professionalTitle)}</div>` : ''}`
            : personal.professionalTitle
              ? `<div style="font-size:9px;font-style:italic;color:#374151">${esc(personal.professionalTitle)}</div>`
              : ''}
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0;font-size:8.5px;color:#374151;line-height:1.7">
        ${rightContacts}
      </div>
    </div>
    <div style="height:1px;background-color:#111827;margin-bottom:${gap * 0.7}px"></div>
    ${personal.summary ? `<div data-section="personal" style="margin-bottom:${gap}px">${sectionHeader('Profile')}<p style="font-size:${fs - 0.5}px;color:#374151;line-height:1.6;margin:0">${esc(personal.summary)}</p></div>` : ''}
    ${orderedIds.map(renderSection).join('')}
  </div>`;
}

// ── Template 3: Executive ─────────────────────────────────────────────────────
// Centered header, accent title, dot contacts, gradient rule, CAPS+gray-rule sections

function renderTemplate3(data: ResumeData, options: TemplateOptions): string {
  const { personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null }, sectionOrder = [], enabledSections = [] } = data;
  const accent    = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#0f766e';
  const linkColor = options.linkColor || accent;
  const font      = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fs        = options.fontSize === 'sm' ? 9.5 : options.fontSize === 'lg' ? 11.5 : 10.5;
  const gap       = options.spacing === 'compact' ? 7 : options.spacing === 'relaxed' ? 14 : 10;
  const pad       = options.pagePadding === 'narrow' ? '10px 16px' : options.pagePadding === 'wide' ? '24px 40px' : '16px 28px';
  const lw        = options.lineWeight === 'thin' ? 0.6 : options.lineWeight === 'thick' ? 1.6 : 1;
  const showIcons = options.showContactIcons !== false;
  const imgPx     = options.imageSize === 'sm' ? 56 : options.imageSize === 'lg' ? 88 : 72;
  const imgR      = options.imageShape === 'square' ? '4px' : options.imageShape === 'rounded' ? '12px' : '50%';

  // UPPERCASE + thin gray rule
  const sectionHeader = (label: string) =>
    `<div style="margin-bottom:6px;margin-top:2px">
      <h2 style="font-size:${fs + 0.5}px;font-weight:700;letter-spacing:0.08em;color:#111827;text-transform:uppercase;line-height:1.2;margin-bottom:3px;break-after:avoid;page-break-after:avoid">${esc(label)}</h2>
      <div style="height:${(0.75 * lw).toFixed(2)}px;background-color:#d1d5db"></div>
    </div>`;

  const renderSection = buildSectionRenderer(data, fs, gap, accent, linkColor, 't3', sectionHeader);
  const orderedIds = [...sectionOrder.filter(id => id !== 'personal'), ...enabledSections.filter(id => id !== 'personal' && !sectionOrder.includes(id))];

  // Centered dot-separated contacts with icons
  const contacts: string[] = [];
  if (personal.phone)    contacts.push(`${showIcons ? I.phone : ''}${esc(personal.phone)}`);
  if (personal.email)    contacts.push(`${showIcons ? I.email : ''}${esc(personal.email)}`);
  if (personal.location) contacts.push(`${showIcons ? I.location : ''}${esc(personal.location)}`);
  for (const lnk of (personal.links ?? []).filter(l => l.url)) {
    contacts.push(`${showIcons ? linkIcon(lnk.type) : ''}${esc(lnk.url)}`);
  }
  const contactRowHtml = contacts.length
    ? `<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;font-size:${fs - 1}px;color:#4b5563;margin-top:6px;gap:4px">
        ${contacts.map((c, i) => `${i > 0 ? `<span style="color:#9ca3af;font-size:${fs - 2}px">●</span>` : ''}<span style="display:inline-flex;align-items:center">${c}</span>`).join('')}
       </div>`
    : '';

  const photoHtml = options.showPhoto && personal.image?.url
    ? `<div style="width:${imgPx}px;height:${imgPx}px;border-radius:${imgR};overflow:hidden;border:2px solid ${accent};margin:0 auto 8px;"><img src="${esc(personal.image.url)}" style="width:100%;height:100%;object-fit:cover;display:block;" /></div>`
    : '';

  return `<div id="resume-template3" style="font-family:${esc(font)};font-size:${fs}px;color:#111827;background-color:#ffffff;padding:${pad};min-height:100%;line-height:1.4">
    <div data-section="personal" style="text-align:center;margin-bottom:${gap * 0.8}px">
      ${photoHtml}
      <h1 style="font-size:${fs + 14}px;font-weight:800;color:#111827;letter-spacing:-0.02em;line-height:1.05;margin:0">${esc(personal.firstName)} ${esc(personal.lastName)}</h1>
      ${personal.professionalTitle ? `<p style="font-size:${fs + 2}px;color:${accent};font-weight:600;margin:4px 0 0;letter-spacing:0.02em">${esc(personal.professionalTitle)}</p>` : ''}
      ${contactRowHtml}
    </div>
    <div style="height:${(2 * lw).toFixed(2)}px;background:linear-gradient(90deg,transparent,${accent},transparent);margin-bottom:${gap}px"></div>
    ${personal.summary ? `<div data-section="personal" style="margin-bottom:${gap}px;text-align:center"><p style="font-size:${fs - 0.5}px;color:#374151;line-height:1.6;margin:0 auto;max-width:85%">${esc(personal.summary)}</p></div>` : ''}
    ${orderedIds.map(renderSection).join('')}
  </div>`;
}

// ── Public API ────────────────────────────────────────────────────────────────

const FONT_URLS: Partial<Record<string, string>> = {
  inter: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap',
  serif: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap',
};

export function renderResumeHTML(
  data: ResumeData,
  templateId: TemplateId,
  options: TemplateOptions,
): string {
  const body = templateId === 'template3'
    ? renderTemplate3(data, options)
    : templateId === 'template2'
      ? renderTemplate2(data, options)
      : renderTemplate1(data, options);

  const fontUrl  = FONT_URLS[options.fontFamily];
  const fontLink = fontUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
       <link href="${fontUrl}" rel="stylesheet">`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${fontLink}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4; margin: 0; }
    html, body { width: 210mm; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    ul { list-style: disc; }
    ol { list-style: decimal; }
    li { display: list-item; }
    h2 { break-after: avoid; page-break-after: avoid; }
    p { orphans: 2; widows: 2; }
    * { cursor: default !important; user-select: none; }
    *:focus { outline: none !important; }
  </style>
</head>
<body>${body}</body>
</html>`;
}
