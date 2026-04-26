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

function bulletsHtml(text: string, fs: number): string {
  return text.split('\n').filter(Boolean).map(line =>
    `<li style="font-size:${fs - 0.5}px;margin-bottom:1.5px;line-height:1.45">${esc(line.replace(/^[-•]\s*/, ''))}</li>`
  ).join('');
}

function dateRange(start?: string, end?: string, current?: boolean): string {
  const s = fmtDate(start ?? '');
  const e = current ? 'Present' : fmtDate(end ?? '');
  if (!s && !e) return '';
  return e ? `${s} – ${e}` : s;
}

// ── Shared entry renderer ─────────────────────────────────────────────────────

function workEntryHtml(
  role: string | undefined, org: string | undefined, location: string | undefined,
  start: string | undefined, end: string | undefined, current: boolean | undefined,
  description: string | undefined,
  fs: number, gap: number, accent: string, style: 'classic' | 'modern' | 'executive',
): string {
  const dr = dateRange(start, end, current);
  const dateSpan = dr ? `<span style="font-size:${fs - 1}px;color:#6b7280;white-space:nowrap;flex-shrink:0">${esc(dr)}</span>` : '';

  if (style === 'modern') {
    const displayName = org || role || '';
    const subtitle = org && role
      ? `<span style="font-size:${fs - 0.5}px;color:#374151;font-style:italic;margin-left:6px">${esc(role)}${location ? ` · ${esc(location)}` : ''}</span>`
      : (location ? `<span style="font-size:${fs - 0.5}px;color:#6b7280;margin-left:6px">${esc(location)}</span>` : '');
    return `<div style="margin-bottom:${gap * 0.8}px;${ENTRY}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px;flex-wrap:wrap">
        <div><span style="font-size:${fs}px;font-weight:700;color:#111827">${esc(displayName)}</span>${subtitle}</div>
        ${dateSpan}
      </div>
      ${description ? `<ul style="margin:3px 0 0;padding-left:16px;list-style-type:disc">${bulletsHtml(description, fs)}</ul>` : ''}
    </div>`;
  }

  if (style === 'executive') {
    return `<div style="margin-bottom:${gap * 0.75}px;${ENTRY}">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px;flex-wrap:wrap">
        <div>
          <span style="font-size:${fs}px;font-weight:700;color:#111827">${esc(role)}</span>
          ${org ? `<span style="font-size:${fs}px;color:${accent};font-weight:500;margin-left:6px">${esc(org)}</span>` : ''}
        </div>
        ${dateSpan}
      </div>
      ${location ? `<div style="font-size:${fs - 1}px;color:#6b7280;font-style:italic;margin-top:1px">${esc(location)}</div>` : ''}
      ${description ? `<ul style="margin:3px 0 0;padding-left:14px;list-style-type:disc">${bulletsHtml(description, fs)}</ul>` : ''}
    </div>`;
  }

  // classic: role bold left, date italic right, org italic below
  return `<div style="margin-bottom:${gap * 0.75}px;${ENTRY}">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">
      <span style="font-size:${fs}px;font-weight:700;color:#111827">${esc(role)}</span>
      <span style="font-size:${fs - 1.5}px;color:#4b5563;font-style:italic;white-space:nowrap;flex-shrink:0">${esc(dr)}</span>
    </div>
    ${org ? `<div style="font-size:${fs - 0.5}px;font-style:italic;color:#374151">${esc(org)}${location ? `, ${esc(location)}` : ''}</div>` : ''}
    ${description ? `<ul style="margin:2px 0 0;padding-left:14px;list-style-type:disc">${bulletsHtml(description, fs)}</ul>` : ''}
  </div>`;
}

// ── Shared section builder ────────────────────────────────────────────────────

type SectionStyle = 'classic' | 'modern' | 'executive';

function buildSectionRenderer(
  data: ResumeData, fs: number, gap: number, accent: string, style: SectionStyle,
  sectionHeaderHtml: (label: string) => string,
) {
  const { experience = [], education = [], skills = [], enabledSections = [] } = data;

  function dateStr(start?: string, end?: string, current?: boolean) {
    const dr = dateRange(start, end, current);
    return dr ? `<span style="font-size:${fs - 1}px;color:#6b7280;white-space:nowrap">${esc(dr)}</span>` : '';
  }

  return function renderSection(id: string): string {
    switch (id) {
      case 'experience': {
        const items = V(experience);
        if (!enabledSections.includes('experience') || !items.length) return '';
        return `<div data-section="experience" style="margin-bottom:${gap}px">${sectionHeaderHtml('Experience')}${items.map(e => workEntryHtml(e.role, e.company, e.location, e.start, e.end, e.currentlyWorking, e.description, fs, gap, accent, style)).join('')}</div>`;
      }
      case 'internships': {
        const items = V(data.internships);
        if (!enabledSections.includes('internships') || !items.length) return '';
        return `<div data-section="internships" style="margin-bottom:${gap}px">${sectionHeaderHtml('Internships')}${items.map(e => workEntryHtml(e.role, e.company, e.location, e.start, e.end, e.currentlyWorking, e.description, fs, gap, accent, style)).join('')}</div>`;
      }
      case 'freelance': {
        const items = V(data.freelance);
        if (!enabledSections.includes('freelance') || !items.length) return '';
        return `<div data-section="freelance" style="margin-bottom:${gap}px">${sectionHeaderHtml('Freelance Work')}${items.map(e => workEntryHtml(e.role, e.client, undefined, e.start, e.end, e.currentlyWorking, e.description, fs, gap, accent, style)).join('')}</div>`;
      }
      case 'projects': {
        const items = V(data.projects);
        if (!enabledSections.includes('projects') || !items.length) return '';
        const projectEntries = items.map(p => {
          const dr = (p.start || p.end || p.ongoing)
            ? `<span style="font-size:${fs - 1}px;color:#6b7280;flex-shrink:0">${esc(fmtDate(p.start))}${(p.end || p.ongoing) ? ` – ${p.ongoing ? 'Ongoing' : esc(fmtDate(p.end))}` : ''}</span>`
            : '';
          const techStyle = style === 'executive'
            ? `<span style="font-size:${fs - 1}px;color:${accent};font-weight:500;margin-left:6px">${esc(p.tech)}</span>`
            : `<span style="font-size:${fs - 1}px;color:#6b7280;font-style:italic;margin-left:6px">${esc(p.tech)}</span>`;
          return `<div style="margin-bottom:${gap * 0.8}px;${ENTRY}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px;flex-wrap:wrap">
              <div>
                <span style="font-size:${fs}px;font-weight:700;color:#111827">${esc(p.title)}</span>
                ${p.tech ? techStyle : ''}
              </div>
              ${dr}
            </div>
            ${p.url ? `<div style="font-size:${fs - 1}px;color:${accent};margin-top:1px">${esc(p.url)}</div>` : ''}
            ${p.description ? `<ul style="margin:3px 0 0;padding-left:14px;list-style-type:disc">${bulletsHtml(p.description, fs)}</ul>` : ''}
          </div>`;
        }).join('');
        return `<div data-section="projects" style="margin-bottom:${gap}px">${sectionHeaderHtml('Projects')}${projectEntries}</div>`;
      }
      case 'education': {
        const items = V(education);
        if (!enabledSections.includes('education') || !items.length) return '';
        const eduEntries = items.map(e => {
          if (style === 'modern') {
            return `<div style="margin-bottom:${gap * 0.7}px;${ENTRY};display:flex;justify-content:space-between;align-items:flex-start;gap:4px;flex-wrap:wrap">
              <div>
                <div style="font-size:${fs}px;font-weight:700;color:#111827">${esc(e.school)}</div>
                <div style="font-size:${fs - 0.5}px;color:#374151;font-style:italic">${esc(e.degree)}${e.fieldOfStudy ? ` in ${esc(e.fieldOfStudy)}` : ''}</div>
                ${e.gpa ? `<div style="font-size:${fs - 1}px;color:#6b7280">GPA: ${esc(e.gpa)}</div>` : ''}
              </div>
              <span style="font-size:${fs - 1}px;color:#6b7280;flex-shrink:0">${esc(e.startYear)}${e.endYear ? ` – ${esc(e.endYear)}` : ''}</span>
            </div>`;
          }
          if (style === 'executive') {
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
          }
          // classic
          return `<div style="margin-bottom:${gap * 0.6}px;${ENTRY}">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">
              <span style="font-size:${fs}px;font-weight:700;color:#111827">${esc(e.degree)}${e.fieldOfStudy ? ` in ${esc(e.fieldOfStudy)}` : ''}</span>
              ${e.gpa ? `<span style="font-size:${fs - 1.5}px;color:#4b5563;font-style:italic;flex-shrink:0">CGPA: ${esc(e.gpa)}</span>` : ''}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">
              <span style="font-size:${fs - 0.5}px;font-style:italic;color:#374151">${esc(e.school)}</span>
              <span style="font-size:${fs - 1.5}px;color:#4b5563;font-style:italic;flex-shrink:0">${esc(e.startYear)}${e.endYear ? ` – ${esc(e.endYear)}` : ''}</span>
            </div>
          </div>`;
        }).join('');
        return `<div data-section="education" style="margin-bottom:${gap}px">${sectionHeaderHtml('Education')}${eduEntries}</div>`;
      }
      case 'skills': {
        if (!enabledSections.includes('skills') || !skills.length) return '';
        return `<div data-section="skills" style="margin-bottom:${gap}px">${sectionHeaderHtml('Technical Skills')}<div style="font-size:${fs - 0.5}px;color:#1f2937;line-height:1.65">${esc(skills.join(' · '))}</div></div>`;
      }
      case 'softskills': {
        const items = V(data.softskills);
        if (!enabledSections.includes('softskills') || !items.length) return '';
        return `<div data-section="softskills" style="margin-bottom:${gap}px">${sectionHeaderHtml('Soft Skills')}<div style="font-size:${fs - 0.5}px;color:#1f2937">${esc(items.map(s => s.skill).join(' · '))}</div></div>`;
      }
      case 'languages': {
        const items = V(data.languages);
        if (!enabledSections.includes('languages') || !items.length) return '';
        return `<div data-section="languages" style="margin-bottom:${gap}px">${sectionHeaderHtml('Languages')}
          <div style="columns:2;font-size:${fs - 0.5}px">
            ${items.map(l => `<div style="break-inside:avoid;margin-bottom:2px"><span style="font-weight:600">${esc(l.language)}</span>${l.proficiency ? `<span style="color:#6b7280"> [${esc(l.proficiency)}]</span>` : ''}</div>`).join('')}
          </div></div>`;
      }
      case 'certificates': {
        const items = V(data.certificates);
        if (!enabledSections.includes('certificates') || !items.length) return '';
        return `<div data-section="certificates" style="margin-bottom:${gap}px">${sectionHeaderHtml('Certifications')}
          <ul style="padding-left:14px;margin:0;list-style-type:disc">
            ${items.map(c => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(c.name)}</span>${c.issuer ? `<span style="color:#374151"> – ${esc(c.issuer)}</span>` : ''}${c.issueDate ? `<span style="color:#6b7280"> (${esc(fmtDate(c.issueDate))})</span>` : ''}</li>`).join('')}
          </ul></div>`;
      }
      case 'coursework': {
        const items = V(data.coursework);
        if (!enabledSections.includes('coursework') || !items.length) return '';
        return `<div data-section="coursework" style="margin-bottom:${gap}px">${sectionHeaderHtml('Relevant Coursework')}<div style="font-size:${fs - 0.5}px;color:#1f2937;line-height:1.65">${esc(items.map(c => c.course).join(' · '))}</div></div>`;
      }
      case 'involvement': {
        const items = V(data.involvement);
        if (!enabledSections.includes('involvement') || !items.length) return '';
        return `<div data-section="involvement" style="margin-bottom:${gap}px">${sectionHeaderHtml('Positions of Responsibility')}${items.map(e => workEntryHtml(e.role, e.organization, undefined, e.start, e.end, e.current, e.description, fs, gap, accent, style)).join('')}</div>`;
      }
      case 'awards': {
        const items = V(data.awards);
        if (!enabledSections.includes('awards') || !items.length) return '';
        return `<div data-section="awards" style="margin-bottom:${gap}px">${sectionHeaderHtml('Awards & Honors')}
          <ul style="padding-left:14px;margin:0;list-style-type:disc">
            ${items.map(a => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(a.name)}</span>${a.issuer ? `<span style="color:#374151"> · ${esc(a.issuer)}</span>` : ''}${a.description ? `<span style="color:#374151"> – ${esc(a.description)}</span>` : ''}</li>`).join('')}
          </ul></div>`;
      }
      case 'achievements': {
        const items = V(data.achievements);
        if (!enabledSections.includes('achievements') || !items.length) return '';
        return `<div data-section="achievements" style="margin-bottom:${gap}px">${sectionHeaderHtml('Achievements')}
          <ul style="padding-left:14px;margin:0;list-style-type:disc">
            ${items.map(a => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(a.title)}</span>${a.description ? `<span style="color:#374151"> – ${esc(a.description)}</span>` : ''}</li>`).join('')}
          </ul></div>`;
      }
      case 'publications': {
        const items = V(data.publications);
        if (!enabledSections.includes('publications') || !items.length) return '';
        const pubColor = style === 'executive' ? accent : '#374151';
        return `<div data-section="publications" style="margin-bottom:${gap}px">${sectionHeaderHtml('Publications')}
          <ul style="padding-left:14px;margin:0;list-style-type:disc">
            ${items.map(p => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(p.title)}</span>${p.publisher ? `<span style="color:${pubColor}"> · ${esc(p.publisher)}</span>` : ''}${p.date ? `<span style="color:#6b7280"> (${esc(fmtDate(p.date))})</span>` : ''}</li>`).join('')}
          </ul></div>`;
      }
      case 'leadership': {
        const items = V(data.leadership);
        if (!enabledSections.includes('leadership') || !items.length) return '';
        return `<div data-section="leadership" style="margin-bottom:${gap}px">${sectionHeaderHtml('Leadership')}${items.map(e => workEntryHtml(e.role, e.organization, undefined, e.start, e.end, e.current, e.description, fs, gap, accent, style)).join('')}</div>`;
      }
      case 'volunteering': {
        const items = V(data.volunteering);
        if (!enabledSections.includes('volunteering') || !items.length) return '';
        if (style === 'executive') {
          return `<div data-section="volunteering" style="margin-bottom:${gap}px">${sectionHeaderHtml('Volunteering')}
            ${items.map(e => `<div style="margin-bottom:${gap * 0.6}px;${ENTRY}">
              <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">
                <span style="font-size:${fs}px;font-weight:700;color:#111827">${esc(e.role)}</span>
                ${dateStr(e.start, e.end, e.current)}
              </div>
              <div style="font-size:${fs - 0.5}px;color:${accent};font-weight:500">${esc(e.organization)}</div>
            </div>`).join('')}</div>`;
        }
        return `<div data-section="volunteering" style="margin-bottom:${gap}px">${sectionHeaderHtml('Volunteering')}${items.map(e => workEntryHtml(e.role, e.organization, undefined, e.start, e.end, e.current, undefined, fs, gap, accent, style)).join('')}</div>`;
      }
      case 'extracurricular': {
        const items = V(data.extracurricular);
        if (!enabledSections.includes('extracurricular') || !items.length) return '';
        return `<div data-section="extracurricular" style="margin-bottom:${gap}px">${sectionHeaderHtml('Extracurricular')}
          <ul style="padding-left:14px;margin:0;list-style-type:disc">
            ${items.map(e => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(e.activity)}</span>${e.organization ? `<span style="color:#374151"> · ${esc(e.organization)}</span>` : ''}${e.description ? `<span style="color:#374151"> – ${esc(e.description)}</span>` : ''}</li>`).join('')}
          </ul></div>`;
      }
      case 'hobbies': {
        const items = V(data.hobbies);
        if (!enabledSections.includes('hobbies') || !items.length) return '';
        return `<div data-section="hobbies" style="margin-bottom:${gap}px">${sectionHeaderHtml('Interests')}<div style="font-size:${fs - 0.5}px;color:#1f2937">${esc(items.map(h => h.name).join(' · '))}</div></div>`;
      }
      case 'conferences': {
        const items = V(data.conferences);
        if (!enabledSections.includes('conferences') || !items.length) return '';
        return `<div data-section="conferences" style="margin-bottom:${gap}px">${sectionHeaderHtml('Conferences')}
          <ul style="padding-left:14px;margin:0;list-style-type:disc">
            ${items.map(c => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(c.title)}</span>${c.organizer ? `<span style="color:#374151"> · ${esc(c.organizer)}</span>` : ''}${c.date ? `<span style="color:#6b7280"> (${esc(fmtDate(c.date))})</span>` : ''}</li>`).join('')}
          </ul></div>`;
      }
      case 'patents': {
        const items = V(data.patents);
        if (!enabledSections.includes('patents') || !items.length) return '';
        return `<div data-section="patents" style="margin-bottom:${gap}px">${sectionHeaderHtml('Patents')}
          <ul style="padding-left:14px;margin:0;list-style-type:disc">
            ${items.map(p => `<li style="margin-bottom:2px;font-size:${fs - 0.5}px"><span style="font-weight:600">${esc(p.title)}</span>${p.issuer ? `<span style="color:#374151"> · ${esc(p.issuer)}</span>` : ''}</li>`).join('')}
          </ul></div>`;
      }
      case 'references': {
        const items = V(data.references);
        if (!enabledSections.includes('references') || !items.length) return '';
        return `<div data-section="references" style="margin-bottom:${gap}px">${sectionHeaderHtml('References')}
          <div style="display:flex;flex-wrap:wrap;gap:12px">
            ${items.map(r => `<div style="font-size:${fs - 0.5}px;min-width:160px">
              <div style="font-weight:600">${esc(r.name)}</div>
              ${r.title ? `<div style="color:#374151">${esc(r.title)}${r.company ? `, ${esc(r.company)}` : ''}</div>` : ''}
              ${r.email ? `<div style="color:#6b7280;font-size:${fs - 1}px">${esc(r.email)}</div>` : ''}
            </div>`).join('')}
          </div></div>`;
      }
      default: return '';
    }
  };
}

// ── Template 1: Classic Academic ─────────────────────────────────────────────
// Two-column header (name+title left, contacts right), SECTION ──── rule style

function renderTemplate1(data: ResumeData, options: TemplateOptions): string {
  const { personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null }, sectionOrder = [], enabledSections = [] } = data;
  const accent = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#4f46e5';
  const font   = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fs     = options.fontSize === 'sm' ? 9.5 : options.fontSize === 'lg' ? 11.5 : 10.5;
  const gap    = options.spacing === 'compact' ? 7 : options.spacing === 'relaxed' ? 14 : 10;
  const pad    = options.pagePadding === 'narrow' ? '10px 16px' : options.pagePadding === 'wide' ? '24px 40px' : '16px 28px';

  const sectionHeader = (label: string) =>
    `<div style="display:flex;align-items:center;margin-bottom:5px;margin-top:2px">
      <h2 style="font-size:${fs - 0.5}px;font-weight:700;letter-spacing:0.1em;color:#111827;text-transform:uppercase;white-space:nowrap;margin-right:8px;flex-shrink:0;line-height:1.2;break-after:avoid;page-break-after:avoid">${esc(label)}</h2>
      <div style="flex:1;height:0.75px;background-color:${accent}"></div>
    </div>`;

  const renderSection = buildSectionRenderer(data, fs, gap, accent, 'classic', sectionHeader);
  const orderedIds = [...sectionOrder.filter(id => id !== 'personal'), ...enabledSections.filter(id => id !== 'personal' && !sectionOrder.includes(id))];
  const contactItems = [personal.phone, personal.email, personal.location, ...(personal.links ?? []).filter(l => l.url).map(l => l.url)].filter(Boolean) as string[];

  return `<div id="resume-template1" style="font-family:${esc(font)};font-size:${fs}px;color:#111827;background-color:#ffffff;padding:${pad};min-height:100%;line-height:1.4">
    <div data-section="personal" style="margin-bottom:${gap * 0.6}px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="flex:1;min-width:0">
          <h1 style="font-size:${fs + 10}px;font-weight:700;color:#111827;line-height:1.1;margin-bottom:2px;margin-top:0">${esc(personal.firstName)} ${esc(personal.lastName)}</h1>
          ${personal.professionalTitle ? `<p style="font-size:${fs}px;color:#374151;font-style:italic;margin:0 0 4px">${esc(personal.professionalTitle)}</p>` : ''}
          ${personal.summary ? `<p style="font-size:${fs - 0.5}px;color:#374151;line-height:1.55;margin:0">${esc(personal.summary)}</p>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;flex-shrink:0;gap:2px">
          ${options.showPhoto && personal.image?.url ? `<img src="${esc(personal.image.url)}" width="56" height="56" style="border-radius:50%;object-fit:cover;border:2px solid ${accent}50;margin-bottom:6px" crossorigin="anonymous" />` : ''}
          ${contactItems.map(item => `<span style="font-size:${fs - 1}px;color:#4b5563;text-align:right">${esc(item)}</span>`).join('')}
        </div>
      </div>
    </div>
    <div style="height:1.5px;background-color:${accent};margin-bottom:${gap * 0.8}px"></div>
    ${orderedIds.map(renderSection).join('')}
  </div>`;
}

// ── Template 2: Modern Clean ──────────────────────────────────────────────────
// Centered name, pipe-separated contacts, SECTION + colored underline

function renderTemplate2(data: ResumeData, options: TemplateOptions): string {
  const { personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null }, sectionOrder = [], enabledSections = [] } = data;
  const accent = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#1d4ed8';
  const font   = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fs     = options.fontSize === 'sm' ? 10 : options.fontSize === 'lg' ? 12 : 11;
  const gap    = options.spacing === 'compact' ? 8 : options.spacing === 'relaxed' ? 16 : 11;
  const pad    = options.pagePadding === 'narrow' ? '12px 20px' : options.pagePadding === 'wide' ? '28px 48px' : '20px 36px';

  const sectionHeader = (label: string) =>
    `<div style="margin-bottom:7px;margin-top:2px">
      <h2 style="font-size:${fs}px;font-weight:700;letter-spacing:0.07em;color:#111827;text-transform:uppercase;margin-bottom:3px;line-height:1.2;break-after:avoid;page-break-after:avoid">${esc(label)}</h2>
      <div style="height:2px;background-color:${accent};border-radius:1px"></div>
    </div>`;

  const renderSection = buildSectionRenderer(data, fs, gap, accent, 'modern', sectionHeader);
  const orderedIds = [...sectionOrder.filter(id => id !== 'personal'), ...enabledSections.filter(id => id !== 'personal' && !sectionOrder.includes(id))];
  const contactItems = [personal.phone, personal.email, personal.location, ...(personal.links ?? []).filter(l => l.url).map(l => l.url)].filter(Boolean) as string[];

  const contactRow = contactItems.length
    ? `<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;font-size:${fs - 1}px;color:#374151;margin-top:6px;line-height:1.5;gap:2px">
        ${contactItems.map((item, i) => `${i > 0 ? `<span style="color:#d1d5db;margin:0 6px">|</span>` : ''}<span>${esc(item)}</span>`).join('')}
      </div>` : '';

  return `<div id="resume-template2" style="font-family:${esc(font)};font-size:${fs}px;color:#1a1a1a;background-color:#ffffff;padding:${pad};min-height:100%;line-height:1.45;position:relative">
    <div data-section="personal" style="margin-bottom:${gap + 2}px;text-align:center;position:relative">
      ${options.showPhoto && personal.image?.url ? `<img src="${esc(personal.image.url)}" width="64" height="64" style="position:absolute;top:0;right:0;border-radius:50%;object-fit:cover;border:2px solid ${accent}40" crossorigin="anonymous" />` : ''}
      <h1 style="font-size:${fs + 12}px;font-weight:700;color:#111827;letter-spacing:-0.01em;line-height:1.05;margin:0">${esc(personal.firstName)} ${esc(personal.lastName)}</h1>
      ${personal.professionalTitle ? `<p style="font-size:${fs + 1}px;color:#6b7280;font-weight:400;margin:3px 0 0;letter-spacing:0.01em">${esc(personal.professionalTitle)}</p>` : ''}
      ${contactRow}
      <div style="height:2px;background-color:${accent};margin:8px 0 0;border-radius:1px"></div>
    </div>
    ${personal.summary ? `<div data-section="personal" style="margin-bottom:${gap}px">${sectionHeader('Profile')}<p style="font-size:${fs - 0.5}px;color:#374151;line-height:1.6;margin:0">${esc(personal.summary)}</p></div>` : ''}
    ${orderedIds.map(renderSection).join('')}
  </div>`;
}

// ── Template 3: Professional Executive ───────────────────────────────────────
// Centered header with accent title, dot contacts, prominent gray-rule sections

function renderTemplate3(data: ResumeData, options: TemplateOptions): string {
  const { personal = { firstName:'', lastName:'', professionalTitle:'', email:'', phone:'', location:'', summary:'', links:[], image:null }, sectionOrder = [], enabledSections = [] } = data;
  const accent = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#0f766e';
  const font   = FONT_FAMILY_MAP[options.fontFamily] ?? FONT_FAMILY_MAP.sans;
  const fs     = options.fontSize === 'sm' ? 9.5 : options.fontSize === 'lg' ? 11.5 : 10.5;
  const gap    = options.spacing === 'compact' ? 7 : options.spacing === 'relaxed' ? 14 : 10;
  const pad    = options.pagePadding === 'narrow' ? '10px 16px' : options.pagePadding === 'wide' ? '24px 40px' : '16px 28px';

  const sectionHeader = (label: string) =>
    `<div style="margin-bottom:6px;margin-top:2px">
      <h2 style="font-size:${fs + 0.5}px;font-weight:700;letter-spacing:0.08em;color:#111827;text-transform:uppercase;line-height:1.2;margin-bottom:3px;break-after:avoid;page-break-after:avoid">${esc(label)}</h2>
      <div style="height:0.75px;background-color:#d1d5db"></div>
    </div>`;

  const renderSection = buildSectionRenderer(data, fs, gap, accent, 'executive', sectionHeader);
  const orderedIds = [...sectionOrder.filter(id => id !== 'personal'), ...enabledSections.filter(id => id !== 'personal' && !sectionOrder.includes(id))];
  const contactItems = [personal.phone, personal.email, personal.location, ...(personal.links ?? []).filter(l => l.url).map(l => l.url)].filter(Boolean) as string[];

  const contactRow = contactItems.length
    ? `<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;font-size:${fs - 1}px;color:#4b5563;margin-top:6px;gap:4px">
        ${contactItems.map((item, i) => `${i > 0 ? `<span style="color:#9ca3af;font-size:${fs - 2}px">●</span>` : ''}<span>${esc(item)}</span>`).join('')}
      </div>` : '';

  return `<div id="resume-template3" style="font-family:${esc(font)};font-size:${fs}px;color:#111827;background-color:#ffffff;padding:${pad};min-height:100%;line-height:1.4;position:relative">
    <div data-section="personal" style="text-align:center;margin-bottom:${gap * 0.8}px;position:relative">
      ${options.showPhoto && personal.image?.url ? `<img src="${esc(personal.image.url)}" width="60" height="60" style="position:absolute;top:0;right:0;border-radius:50%;object-fit:cover;border:2px solid ${accent}50" crossorigin="anonymous" />` : ''}
      <h1 style="font-size:${fs + 14}px;font-weight:800;color:#111827;letter-spacing:-0.02em;line-height:1.05;margin:0">${esc(personal.firstName)} ${esc(personal.lastName)}</h1>
      ${personal.professionalTitle ? `<p style="font-size:${fs + 2}px;color:${accent};font-weight:600;margin:4px 0 0;letter-spacing:0.02em">${esc(personal.professionalTitle)}</p>` : ''}
      ${contactRow}
    </div>
    <div style="height:2px;background:linear-gradient(90deg,transparent,${accent},transparent);margin-bottom:${gap}px"></div>
    ${personal.summary ? `<div data-section="personal" style="margin-bottom:${gap}px;text-align:center"><p style="font-size:${fs - 0.5}px;color:#374151;line-height:1.6;margin:0 auto;max-width:85%;orphans:2;widows:2">${esc(personal.summary)}</p></div>` : ''}
    ${orderedIds.map(renderSection).join('')}
  </div>`;
}

// ── Public API ────────────────────────────────────────────────────────────────

const FONT_URLS: Partial<Record<string, string>> = {
  inter: 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap',
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
