'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ATSResult } from '@/lib/resume-builder';
import { computeATSScore } from '@/lib/resume-builder';
import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';
import { DEFAULT_TEMPLATE_OPTIONS } from '@/types/resume.types';
import { downloadAsPDF } from '@/lib/exportResume';
import { Navbar } from '@/components/features/home/Navbar';
import { DashboardSidebar } from './DashboardSidebar';
import { ResumeGrid } from './ResumeGrid';
import { QuickActions } from './QuickActions';
import toast from 'react-hot-toast';

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
  const [activeTab, setActiveTab] = useState('resumes');
  const [resume, setResume]       = useState<StoredResume | null>(null);
  const [mounted, setMounted]         = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('fresh_resume_draft');
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredResume>;
        if (parsed.data) {
          setResume({
            data:       parsed.data,
            templateId: parsed.templateId ?? 'template1',
            options:    parsed.options ?? DEFAULT_TEMPLATE_OPTIONS,
            name:       parsed.name ?? 'My Resume',
          });
        }
      }
    } catch { /* parse error ignored */ }
  }, []);

  const atsResult = useMemo<ATSResult | null>(
    () => resume ? computeATSScore(resume.data) : null,
    [resume]
  );

  const handleDownload = useCallback(async () => {
    if (!resume) return;
    setDownloading(true);
    try {
      await downloadAsPDF(
        resume.data,
        resume.templateId,
        resume.options,
        `${resume.name.replace(/\s+/g, '_')}.pdf`,
      );
    } catch {
      toast.error('Server not working due to heavy load. Please try again in a moment.', {
        duration: 5000,
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          borderRadius: '10px',
          fontSize: '13px',
          padding: '12px 16px',
        },
        iconTheme: { primary: '#f87171', secondary: '#fff' },
      });
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
