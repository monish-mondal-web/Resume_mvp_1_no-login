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
    .map(l => `    \\item ${esc(l.replace(/^[-•]\s*/, ''))}`)
    .join('\n');
}

export function buildTemplate1LaTeX(data: ResumeData): string {
  const { personal, experience, education, skills, sectionOrder, enabledSections } = data;

  const contactRow = [
    personal.phone   && `\\faMobile\\enspace ${esc(personal.phone)}`,
    personal.email   && `\\enspace ${esc(personal.email)}`,
    personal.location && `\\faHome\\enspace ${esc(personal.location)}`,
    ...personal.links.filter(l => l.url).map(l => `\\href{${l.url}}{${esc(l.url)}}`),
  ].filter(Boolean).join(' & ');

  const sections: string[] = [];

  const renderSection = (id: string): string => {
    switch (id) {
      case 'experience': {
        const items = V(experience);
        if (!enabledSections.includes('experience') || !items.length) return '';
        return `
\\section{\\textbf{Experience}}
\\resumeSubHeadingListStart
${items.map(e => `
\\resumeSubheading
  {${esc(e.role)}}{${esc(e.company)}${e.location ? `, ${esc(e.location)}` : ''}}
  {${fmtDate(e.start)} -- ${e.currentlyWorking ? 'Present' : fmtDate(e.end)}}{}
  \\vspace{-2mm}
  \\resumeItemListStart
${bullets(e.description)}
  \\resumeItemListEnd
`).join('')}
\\resumeSubHeadingListEnd`;
      }

      case 'education': {
        const items = V(education);
        if (!enabledSections.includes('education') || !items.length) return '';
        return `
\\section{\\textbf{Education}}
\\resumeSubHeadingListStart
${items.map(e => `
\\resumeSubheading
  {${esc(e.degree)}${e.fieldOfStudy ? ` in ${esc(e.fieldOfStudy)}` : ''}}{${e.gpa ? `CGPA: ${esc(e.gpa)}` : ''}}
  {${esc(e.school)}}{${e.startYear}${e.endYear ? `--${e.endYear}` : ''}}
`).join('')}
\\resumeSubHeadingListEnd`;
      }

      case 'projects': {
        const items = V(data.projects);
        if (!enabledSections.includes('projects') || !items.length) return '';
        return `
\\section{\\textbf{Personal Projects}}
\\resumeSubHeadingListStart
${items.map(p => `
\\resumeProject
  {${esc(p.title)}}{${p.tech ? esc(p.tech) : ''}}
  {${p.start ? fmtDate(p.start) : ''}${p.end || p.ongoing ? ` -- ${p.ongoing ? 'Ongoing' : fmtDate(p.end)}` : ''}}{}
  \\resumeItemListStart
${bullets(p.description)}
  \\resumeItemListEnd
`).join('')}
\\resumeSubHeadingListEnd`;
      }

      case 'skills': {
        if (!enabledSections.includes('skills') || !skills.length) return '';
        return `
\\section{\\textbf{Technical Skills}}
\\begin{itemize}[leftmargin=0.05in, label={}]
  \\small{\\item{
    \\textbf{Skills}{: ${esc(skills.join(', '))}} \\\\
  }}
\\end{itemize}`;
      }

      case 'certificates': {
        const items = V(data.certificates);
        if (!enabledSections.includes('certificates') || !items.length) return '';
        return `
\\section{\\textbf{Certifications}}
\\begin{itemize}[label=\\textbullet]
${items.map(c => `  \\item ${esc(c.name)}${c.issuer ? ` -- ${esc(c.issuer)}` : ''}${c.issueDate ? ` (${fmtDate(c.issueDate)})` : ''}`).join('\n')}
\\end{itemize}`;
      }

      case 'involvement': {
        const items = V(data.involvement);
        if (!enabledSections.includes('involvement') || !items.length) return '';
        return `
\\section{\\textbf{Positions of Responsibility}}
\\resumeSubHeadingListStart
${items.map(e => `
\\resumePOR{${esc(e.role)}} {${esc(e.organization)}} {${fmtDate(e.start)} -- ${e.current ? 'Present' : fmtDate(e.end)}}
  \\resumeItemListStart
${bullets(e.description)}
  \\resumeItemListEnd
`).join('')}
\\resumeSubHeadingListEnd`;
      }

      case 'languages': {
        const items = V(data.languages);
        if (!enabledSections.includes('languages') || !items.length) return '';
        return `
\\section{\\textbf{Languages}}
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

  return `%---- Required Packages ----
\\documentclass[a4paper,11pt]{article}
\\usepackage{latexsym}
\\usepackage{xcolor}
\\usepackage{float}
\\usepackage{ragged2e}
\\usepackage[empty]{fullpage}
\\usepackage{tabularx}
\\usepackage{titlesec}
\\usepackage{geometry}
\\usepackage{marvosym}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\usepackage[most]{tcolorbox}
\\usepackage[T1]{fontenc}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\geometry{left=1.4cm, top=0.8cm, right=1.2cm, bottom=1cm}
\\tcbset{frame code={},center title,left=0pt,right=0pt,top=0pt,bottom=0pt,colback=gray!20,colframe=white,width=\\dimexpr\\textwidth\\relax,enlarge left by=-2mm,boxsep=4pt,arc=0pt,outer arc=0pt}
\\urlstyle{same}
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-7pt}]
\\newcommand{\\resumeItem}[2]{\\item{\\textbf{#1}{\\hspace{0.5mm}#2 \\vspace{-0.5mm}}}}
\\newcommand{\\resumePOR}[3]{\\vspace{0.5mm}\\item\\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}\\textbf{#1}\\hspace{0.3mm}#2 & \\textit{\\small{#3}}\\end{tabular*}\\vspace{-2mm}}
\\newcommand{\\resumeSubheading}[4]{\\vspace{0.5mm}\\item\\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}\\textbf{#1} & \\textit{\\footnotesize{#4}} \\\\\\textit{\\footnotesize{#3}} & \\footnotesize{#2}\\\\\\end{tabular*}\\vspace{-2.4mm}}
\\newcommand{\\resumeProject}[4]{\\vspace{0.5mm}\\item\\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}\\textbf{#1} & \\textit{\\footnotesize{#3}} \\\\\\footnotesize{\\textit{#2}} & \\footnotesize{#4}\\end{tabular*}\\vspace{-2.4mm}}
\\renewcommand{\\labelitemi}{\\$\\vcenter{\\hbox{\\tiny\\$\\bullet\\$}}\\$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*,labelsep=0mm]}
\\newcommand{\\resumeHeadingSkillStart}{\\begin{itemize}[leftmargin=*,itemsep=1.7mm, rightmargin=2ex]}
\\newcommand{\\resumeItemListStart}{\\begin{justify}\\begin{itemize}[leftmargin=3ex, rightmargin=2ex, noitemsep,labelsep=1.2mm,itemsep=0mm]\\small}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}\\vspace{2mm}}
\\newcommand{\\resumeHeadingSkillEnd}{\\end{itemize}\\vspace{-2mm}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\end{justify}\\vspace{-2mm}}
\\newcommand{\\cvsection}[1]{\\vspace{2mm}\\begin{tcolorbox}\\textbf{\\large #1}\\end{tcolorbox}\\vspace{-4mm}}
\\newcolumntype{L}{>{\\raggedright\\arraybackslash}X}
\\newcolumntype{R}{>{\\raggedleft\\arraybackslash}X}
\\newcolumntype{C}{>{\\centering\\arraybackslash}X}

\\begin{document}
\\fontfamily{cmr}\\selectfont

%----------HEADING-----------------
{
\\begin{tabularx}{\\linewidth}{L r} \\\\
  \\textbf{\\Large ${esc(personal.firstName)} ${esc(personal.lastName)}} & {\\raisebox{0.0\\height}{\\footnotesize \\faPhone}\\ ${esc(personal.phone)}}\\\\
  ${personal.professionalTitle ? esc(personal.professionalTitle) : ''} & \\href{mailto:${esc(personal.email)}}{\\raisebox{0.0\\height}{\\footnotesize \\faEnvelope}\\ {${esc(personal.email)}}} \\\\
  ${personal.location ? esc(personal.location) : ''}
\\end{tabularx}
}

${personal.summary ? `\\section{\\textbf{Profile}}\n{${esc(personal.summary)}}` : ''}

${sections.join('\n')}

\\end{document}`;
}
