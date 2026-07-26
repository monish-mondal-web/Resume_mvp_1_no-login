import { createElement } from 'react';
import { renderToStaticMarkup } from 'next/dist/server/ReactDOMServerPages';
import { Template1 } from '@/components/preview/templates/Template1';
import { Template2 } from '@/components/preview/templates/Template2';
import { Template3 } from '@/components/preview/templates/Template3';
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  getResumePageMetrics,
  type ResumePageRenderLayout,
} from '@/lib/resumePageLayout';
import type {
  ResumeData,
  TemplateId,
  TemplateOptions,
} from '@/types/resume.types';

const FONT_URLS: Partial<Record<string, string>> = {
  inter:
    'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap',
  serif:
    'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap',
};

export function renderReactResumeHTML(
  data: ResumeData,
  templateId: TemplateId,
  options: TemplateOptions,
  pageBreaks: number[] = []
): string {
  const metrics = getResumePageMetrics(templateId, options);
  const printLayout: ResumePageRenderLayout = {
    mode: 'print',
    contentWidth: metrics.contentWidth,
    contentHeight: metrics.contentHeight,
  };

  const resume =
    templateId === 'template3'
      ? createElement(Template3, { data, options, pageLayout: printLayout })
      : templateId === 'template2'
        ? createElement(Template2, { data, options, pageLayout: printLayout })
        : createElement(Template1, { data, options, pageLayout: printLayout });

  const body = renderToStaticMarkup(resume);
  const requestedFonts = new Set(
    [options.fontFamily, options.headingFont].filter(Boolean)
  );
  const fontLinks = Array.from(requestedFonts)
    .map((font) => FONT_URLS[font as string])
    .filter((url): url is string => Boolean(url))
    .map((url) => `<link href="${url}" rel="stylesheet">`)
    .join('');

  const safeBreaks = Array.from(
    new Set(
      pageBreaks.filter(
        (index) => Number.isInteger(index) && index > 0 && index <= 200
      )
    )
  ).sort((a, b) => a - b);
  const forcedBreakCss = safeBreaks
    .map(
      (index) => `
      [data-resume-layout="print"] > :nth-child(${index + 1}) {
        break-before: page !important;
        page-break-before: always !important;
      }`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${fontLinks}
  <style>
    :root {
      --font-inter: "Inter", ui-sans-serif, system-ui, sans-serif;
      --font-lora: "Lora", Georgia, serif;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    @page {
      size: ${A4_WIDTH_PX}px ${A4_HEIGHT_PX}px;
      margin: ${metrics.padding.top}px ${metrics.padding.right}px ${metrics.padding.bottom}px ${metrics.padding.left}px;
    }
    html, body {
      width: auto;
      min-height: 0;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    ul { list-style: disc; }
    ol { list-style: decimal; }
    li { display: list-item; }
    [data-resume-layout="print"] > [data-section] {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    [data-resume-layout="print"] > :not([data-section]) {
      break-before: avoid;
      page-break-before: avoid;
    }
    [data-resume-layout="print"] h2 {
      break-after: avoid;
      page-break-after: avoid;
    }
    p {
      orphans: 2;
      widows: 2;
    }
    ${forcedBreakCss}
  </style>
</head>
<body>${body}</body>
</html>`;
}
