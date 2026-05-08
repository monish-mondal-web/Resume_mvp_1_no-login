'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ATSResult } from '@/lib/resume-builder';
import { computeATSScore } from '@/lib/resume-builder';
import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';
import { DEFAULT_TEMPLATE_OPTIONS } from '@/types/resume.types';
import { Navbar } from '@/components/features/home/Navbar';
import { DashboardSidebar } from './DashboardSidebar';
import { ResumeGrid } from './ResumeGrid';
import { QuickActions } from './QuickActions';

export interface StoredResume {
  data: ResumeData;
  templateId: TemplateId;
  options: TemplateOptions;
  name: string;
}

interface Props {
  userName: string;
  userEmail?: string;
}

export function DashboardClient({ userName, userEmail }: Props) {
  const [resume, setResume]           = useState<StoredResume | null>(null);
  const [mounted, setMounted]         = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('fr-resume-built');
      if (!raw) return;
      const data       = JSON.parse(raw) as ResumeData;
      const templateId = (localStorage.getItem('resumeTemplateId') as TemplateId) ?? 'template2';
      const optRaw     = localStorage.getItem('resumeTemplateOptions');
      const options    = optRaw ? JSON.parse(optRaw) : DEFAULT_TEMPLATE_OPTIONS;
      const { firstName = '', lastName = '' } = data.personal ?? {};
      const name = [firstName, lastName].filter(Boolean).join(' ')
        ? `${firstName} ${lastName} — Resume`
        : 'My Resume';
      setResume({ data, templateId, options, name });
    } catch {}
  }, []);

  const atsResult = useMemo<ATSResult | null>(
    () => resume ? computeATSScore(resume.data) : null,
    [resume]
  );

  const handleDownload = useCallback(async () => {
    if (!resume) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: resume.data, templateId: resume.templateId, options: resume.options }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), {
        href: url,
        download: `${resume.name.replace(/\s+/g, '_')}.pdf`,
      });
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('PDF export failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [resume]);

  const now   = new Date();
  const hour  = now.getHours();
  const greeting =
    hour >= 5  && hour < 12 ? 'Good morning'   :
    hour >= 12 && hour < 17 ? 'Good afternoon' :
    hour >= 17 && hour < 21 ? 'Good evening'   :
    'Good night';
  const firstName = userName.split(' ')[0] || userName;

  return (
    <section className="flex h-screen flex-col bg-slate-50 text-slate-900 antialiased">
      <Navbar />

      {/* Below navbar — same pattern as builder */}
      <div className="flex flex-1 overflow-hidden pt-[56px]">

        <DashboardSidebar userName={userName} userEmail={userEmail} />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="px-8 py-10 max-w-5xl">

            {/* Welcome */}
            <div className="mb-10">
              <p className="text-[12px] text-slate-400 mb-1">
                {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-[22px] font-semibold text-slate-900">
                {greeting}, {firstName}
              </h1>
            </div>

            {mounted && (
              <div className="space-y-10">
                <QuickActions />
                <ResumeGrid
                  resume={resume}
                  atsResult={atsResult}
                  onDownload={handleDownload}
                  downloading={downloading}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
}
