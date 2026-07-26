import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';

export async function downloadAsPDF(
  data: ResumeData,
  templateId: TemplateId,
  options: TemplateOptions,
  filename = 'resume.pdf',
  pageBreaks: number[] = [],
): Promise<void> {
  const res = await fetch('/api/export/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, templateId, options, pageBreaks }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'PDF export failed' }));
    throw new Error((err as { error?: string }).error ?? 'PDF export failed');
  }

  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

