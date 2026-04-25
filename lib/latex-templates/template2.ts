import type { ResumeData } from '@/types/resume.types';

function esc(s: string) {
  return (s ?? '')
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function fmtDate(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  if (!m) return y;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1] ?? m} ${y}`;
}

function V<T extends { isHidden?: boolean }>(arr: T[] | undefined): T[] {
  return (arr ?? []).filter(e => !e.isHidden);
}

function bullets(text: string) {
  return text
    .split('\n')
    .filter(Boolean)
    .map(l => `\\item ${esc(l.replace(/^[-•]\s*/, ''))}`)
    .join('\n');
}

// moderncv banking customcventry: {dates}{company}{role}{location}{}{}{ bullets }
function cventry(role: string, company: string, location: string, start: string, end: string, current: boolean, desc: string) {
  const dates = `${fmtDate(start)} -- ${current ? 'present' : fmtDate(end)}`;
  return `
\\customcventry{${esc(dates)}}{${esc(company)}}{${esc(role)},}{${esc(location)}}{}{
{\\begin{itemize}[leftmargin=0.6cm, label={\\textbullet}]
${bullets(desc)}
\\end{itemize}}}
`;
}

export function buildTemplate2LaTeX(data: ResumeData): string {
  const { personal, experience, education, skills, sectionOrder, enabledSections } = data;

  const sections: string[] = [];

  const renderSection = (id: string): string => {
    switch (id) {
      case 'experience': {
        const items = V(experience);
        if (!enabledSections.includes('experience') || !items.length) return '';
        return `
\\section{Professional Experience}
${items.map(e => cventry(e.role, e.company, e.location, e.start, e.end, e.currentlyWorking, e.description)).join('')}`;
      }

      case 'internships': {
        const items = V(data.internships);
        if (!enabledSections.includes('internships') || !items.length) return '';
        return `
\\section{Internships}
${items.map(e => cventry(e.role, e.company, e.location, e.start, e.end, e.currentlyWorking, e.description)).join('')}`;
      }

      case 'education': {
        const items = V(education);
        if (!enabledSections.includes('education') || !items.length) return '';
        return `
\\section{Education}
${items.map(e => `\\customcventry{${e.startYear}${e.endYear ? '--' + e.endYear : ''}}{${esc(e.school)}}{${esc(e.degree)}${e.fieldOfStudy ? ' in ' + esc(e.fieldOfStudy) : ''}}{${e.gpa ? 'GPA: ' + esc(e.gpa) : ''}}{}{}{}`).join('\n')}`;
      }

      case 'skills': {
        if (!enabledSections.includes('skills') || !skills.length) return '';
        return `
\\section{Areas of Expertise}
{${esc(skills.join(' - '))}}`;
      }

      case 'certificates': {
        const items = V(data.certificates);
        if (!enabledSections.includes('certificates') || !items.length) return '';
        return `
\\section{Online Courses \\& Certifications}
{\\begin{itemize}[label=\\textbullet]
${items.map(c => `  \\item ${esc(c.name)}${c.issueDate ? ` (${fmtDate(c.issueDate)})` : ''}${c.issuer ? ` -- ${esc(c.issuer)}` : ''}`).join('\n')}
\\end{itemize}}`;
      }

      case 'languages': {
        const items = V(data.languages);
        if (!enabledSections.includes('languages') || !items.length) return '';
        return `
\\section{Languages}
\\begin{multicols}{2}
  \\begin{itemize}[label=\\textbullet]
${items.map(l => `    \\item \\textbf{${esc(l.language)}}${l.proficiency ? ` [${esc(l.proficiency)}]` : ''}`).join('\n')}
  \\end{itemize}
\\end{multicols}`;
      }

      default:
        return '';
    }
  };

  const orderedIds = [
    ...sectionOrder.filter(id => id !== 'personal'),
    ...enabledSections.filter(id => id !== 'personal' && !sectionOrder.includes(id)),
  ];

  for (const id of orderedIds) {
    const s = renderSection(id);
    if (s) sections.push(s);
  }

  return `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{banking}
\\moderncvcolor{black}
\\nopagenumbers{}
\\usepackage[utf8]{inputenc}
\\usepackage{ragged2e}
\\usepackage[scale=0.915]{geometry}
\\usepackage{multicol}
\\usepackage{enumitem}
\\usepackage{amssymb}
\\name{${esc(personal.firstName)}}{${esc(personal.lastName)}}
\\newcommand*{\\customcventry}[7][.13em]{%
\\begin{tabular}{@{}l} {\\bfseries #4} \\\\ {\\itshape #3} \\end{tabular}
\\hfill
\\begin{tabular}{l@{}} {\\bfseries #5} \\\\ {\\itshape #2} \\end{tabular}
\\ifx&#7&\\else{\\\\ \\begin{minipage}{\\maincolumnwidth}\\small#7\\end{minipage}}\\fi
\\par\\addvspace{#1}}

\\begin{document}
\\makecvtitle
\\vspace*{-16mm}
\\begin{center}\\textbf{ ${esc(personal.professionalTitle)}}\\end{center}
\\begin{center}
\\begin{tabular}{ c c c }
${personal.phone ? `\\faMobile\\enspace ${esc(personal.phone)} &` : '&'} \\enspace ${esc(personal.email)} ${personal.location ? `& \\faHome\\enspace ${esc(personal.location)}` : '& '}
\\end{tabular}
\\end{center}

${personal.summary ? `\\section{Profile}\n{${esc(personal.summary)}}` : ''}

${sections.join('\n')}

\\end{document}`;
}
