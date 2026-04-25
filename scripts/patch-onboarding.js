const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Fresh Resume', 'app', 'onboarding', 'OnboardingClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// File has CRLF endings
const NL = '\r\n';

function replace1(search, replacement, label) {
  const idx = content.indexOf(search);
  if (idx === -1) {
    console.error('[SKIP] Not found:', label || search.slice(0, 80));
    return false;
  }
  content = content.slice(0, idx) + replacement + content.slice(idx + search.length);
  console.log('[OK]', label || search.slice(0, 80));
  return true;
}

// ── 1. Add imports after react-icons/fa6 ────────────────────────────────────
replace1(
  `} from 'react-icons/fa6';\r\n`,
  `} from 'react-icons/fa6';\r\n\r\nimport { useResizablePane } from '@/hooks/useResizablePane';\r\nimport type { TemplateId, TemplateOptions } from '@/types/resume.types';\r\nimport { DEFAULT_TEMPLATE_OPTIONS } from '@/types/resume.types';\r\nimport { buildResume } from '@/lib/resume-builder';\r\n`,
  'Add imports after fa6'
);

// ── 2. Add ResumePreview dynamic import after AuthModal ──────────────────────
replace1(
  `  { loading: () => null }\r\n);\r\n`,
  `  { loading: () => null }\r\n);\r\n\r\nconst ResumePreview = dynamic(\r\n  () => import('@/components/preview/ResumePreview').then((mod) => mod.ResumePreview),\r\n  { ssr: false, loading: () => null }\r\n);\r\n`,
  'Add ResumePreview dynamic import'
);

// ── 3. Add states after extracurricular state ────────────────────────────────
replace1(
  `  const [extracurricular, setExtracurricular] = useState<ExtracurricularEntry[]>(() => getInitialValue('extracurricular', DEF_EXTRA));\r\n`,
  `  const [extracurricular, setExtracurricular] = useState<ExtracurricularEntry[]>(() => getInitialValue('extracurricular', DEF_EXTRA));\r\n\r\n  const [previewTemplate, setPreviewTemplate] = useState<TemplateId>('template1');\r\n  const [templateOptions, setTemplateOptions] = useState<TemplateOptions>(() => {\r\n    if (typeof window === 'undefined') return DEFAULT_TEMPLATE_OPTIONS;\r\n    try {\r\n      const saved = localStorage.getItem('resumeTemplateOptions');\r\n      return saved ? { ...DEFAULT_TEMPLATE_OPTIONS, ...JSON.parse(saved) } : DEFAULT_TEMPLATE_OPTIONS;\r\n    } catch { return DEFAULT_TEMPLATE_OPTIONS; }\r\n  });\r\n`,
  'Add previewTemplate/templateOptions states'
);

// ── 4. Fix handleDragEnd to also setActiveStep ───────────────────────────────
replace1(
  `      return result;\r\n    });\r\n  }, []);\r\n\r\n  // ── Progress Logic`,
  `      return result;\r\n    });\r\n    setActiveStep(active.id as string);\r\n  }, []);\r\n\r\n  // ── Progress Logic`,
  'Fix handleDragEnd to call setActiveStep'
);

// ── 5. Add resumeData useMemo before sensors ─────────────────────────────────
replace1(
  `  const sensors = useSensors(\r\n    useSensor(PointerSensor`,
  `  const resumeData = useMemo(() => buildResume({\r\n    personalInfo, experience, education, skills, projects, certificates,\r\n    coursework, involvement, awards, publications, references,\r\n    achievements, languages, softskills, internships, freelance,\r\n    leadership, volunteering, hobbies, conferences, patents, extracurricular,\r\n    selectedMoreIds, stepOrder,\r\n  }), [personalInfo, experience, education, skills, projects, certificates,\r\n    coursework, involvement, awards, publications, references,\r\n    achievements, languages, softskills, internships, freelance,\r\n    leadership, volunteering, hobbies, conferences, patents, extracurricular,\r\n    selectedMoreIds, stepOrder]);\r\n\r\n  const sensors = useSensors(\r\n    useSensor(PointerSensor`,
  'Add resumeData useMemo'
);

// ── 6. Update handleReset to reset templateOptions ───────────────────────────
replace1(
  `        localStorage.removeItem(STORAGE_KEY);\r\n        setVisitedSteps(new Set(['personal']));\r\n        setActiveStep('personal');\r\n        setConfirmModal(null);\r\n        toast.success('Onboarding reset');`,
  `        localStorage.removeItem(STORAGE_KEY);\r\n        localStorage.removeItem('resumeTemplateOptions');\r\n        setTemplateOptions(DEFAULT_TEMPLATE_OPTIONS);\r\n        setPreviewTemplate('template1');\r\n        setVisitedSteps(new Set(['personal']));\r\n        setActiveStep('personal');\r\n        setConfirmModal(null);\r\n        toast.success('Onboarding reset');`,
  'Update handleReset for templateOptions'
);

// ── 7. Change layout: wrap sidebar+main in left pane, add divider + preview ──

// Replace the outer flex wrapper comment + opening
replace1(
  `      {/* ── Sidebar ── */}\r\n      <aside className="hidden w-[280px] flex-shrink-0 flex-col border-r border-slate-200 bg-white md:flex">`,
  `      {/* ── Left pane: sidebar + form ── */}\r\n      <div className="hidden md:flex overflow-hidden border-r border-slate-200 flex-shrink-0" style={{ width: 620 }}>\r\n\r\n      {/* ── Sidebar ── */}\r\n      <aside className="hidden w-[280px] flex-shrink-0 flex-col border-r border-slate-200 bg-white md:flex">`,
  'Wrap sidebar in left pane div'
);

// Close the left pane after </main> and add preview
replace1(
  `      </main>\r\n          </>\r\n        )}\r\n      </div>\r\n\r\n      {confirmModal`,
  `      </main>\r\n\r\n      </div>{/* end left pane */}\r\n\r\n      {/* ── Right pane: live preview ── */}\r\n      <div className="hidden md:flex flex-1 overflow-hidden">\r\n        {isMounted && (\r\n          <ResumePreview\r\n            data={resumeData}\r\n            templateId={previewTemplate}\r\n            templateOptions={templateOptions}\r\n            onTemplateChange={setPreviewTemplate}\r\n            onOptionsChange={(opts) => {\r\n              setTemplateOptions(opts);\r\n              localStorage.setItem('resumeTemplateOptions', JSON.stringify(opts));\r\n            }}\r\n            onSectionClick={(id) => setActiveStep(id)}\r\n          />\r\n        )}\r\n      </div>\r\n\r\n          </>\r\n        )}\r\n      </div>\r\n\r\n      {confirmModal`,
  'Add preview right pane'
);

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');
console.log('\n[DONE] File updated:', filePath);

// Verify
const updated = fs.readFileSync(filePath, 'utf8');
console.log('ResumePreview import present:', updated.includes('ResumePreview'));
console.log('previewTemplate state present:', updated.includes('previewTemplate'));
console.log('resumeData useMemo present:', updated.includes('buildResume'));
console.log('useResizablePane import present:', updated.includes('useResizablePane'));
console.log('handleDragEnd fix present:', updated.includes('setActiveStep(active.id as string)'));
console.log('reset templateOptions present:', updated.includes('resumeTemplateOptions'));
console.log('Preview pane present:', updated.includes('Right pane: live preview'));
