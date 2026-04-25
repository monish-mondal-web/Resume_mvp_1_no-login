'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  useSensor, useSensors, PointerSensor, TouchSensor, KeyboardSensor,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import type { OnboardingFormValues } from './types';
import { BASE_STEPS, MORE_SECTION_DEFS } from './OnboardingConfig';
import { buildResume } from '@/lib/resume-builder';
import { useResumeHistory } from '@/hooks/useResumeHistory';
import type { TemplateId, TemplateOptions } from '@/types/resume.types';
import { DEFAULT_TEMPLATE_OPTIONS } from '@/types/resume.types';
import {
  DEF_EXP, DEF_EDU, DEF_SKILLS, DEF_PROJ, DEF_CERT, DEF_COURSE, DEF_INV,
  DEF_AWD, DEF_PUB, DEF_REF, DEF_ACHIEVE, DEF_LANG, DEF_SOFT, DEF_INTERN,
  DEF_FREE, DEF_LEAD, DEF_VOL, DEF_HOBBY, DEF_CONF, DEF_PATENT, DEF_EXTRA,
} from './defaults';

export const STORAGE_KEY = 'fresh-resume-onboarding-draft';

function safeLocalGet<T>(key: string, def: T): T {
  if (typeof window === 'undefined') return def;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return def;
    const parsed = JSON.parse(raw);
    return parsed[key] !== undefined ? parsed[key] : def;
  } catch {
    return def;
  }
}

function buildDefaultPersonalInfo(session: any) {
  const fname = session?.user?.name?.split(' ')[0] || 'Rahul';
  const lname = session?.user?.name?.split(' ').slice(1).join(' ') || 'Sharma';
  const username = `${fname}${lname}`.toLowerCase().replace(/\s+/g, '');
  const slug = [fname, lname].filter(Boolean).map((s: string) => s.toLowerCase().replace(/\s+/g, '-')).join('-');
  return {
    firstName: fname,
    lastName: lname,
    professionalTitle: 'Software Engineer',
    email: session?.user?.email ?? 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    summary: 'Creative and detail-oriented Software Engineer with a passion for building beautiful, user-centric applications. Experienced in modern web technologies and agile methodologies.',
    website: '',
    linkedIn: '',
    links: [
      { type: 'website', url: `https://${username}.dev` },
      { type: 'linkedin', url: `https://www.linkedin.com/in/${slug}` },
      { type: 'github', url: `https://github.com/${username}` },
    ],
    image: session?.user?.image ? { url: session.user.image, publicId: '' } : null,
  };
}

export function useOnboarding(session: any) {
  const router = useRouter();

  // ── Hydration guard ──
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // ── Nav state (initialized from localStorage) ──
  const [activeStep, setActiveStep] = useState(() => safeLocalGet('activeStep', 'personal'));
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(() => {
    const arr = safeLocalGet<string[]>('visitedSteps', ['personal']);
    return new Set(arr);
  });
  const [selectedMoreIds, setSelectedMoreIds] = useState<string[]>(() =>
    safeLocalGet('selectedMoreIds', [])
  );
  const [stepOrder, setStepOrder] = useState<string[]>(() =>
    safeLocalGet('stepOrder', ['personal', 'experience', 'education', 'skills'])
  );

  // ── UI state ──
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [stepsDrawerOpen, setStepsDrawerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean; title: string; message: string; confirmLabel?: string; onConfirm: () => void;
  } | null>(null);

  // ── Template / preview state ──
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId>('template1');
  const [templateOptions, setTemplateOptions] = useState<TemplateOptions>(() => {
    if (typeof window === 'undefined') return DEFAULT_TEMPLATE_OPTIONS;
    try {
      const saved = localStorage.getItem('resumeTemplateOptions');
      return saved ? { ...DEFAULT_TEMPLATE_OPTIONS, ...JSON.parse(saved) } : DEFAULT_TEMPLATE_OPTIONS;
    } catch { return DEFAULT_TEMPLATE_OPTIONS; }
  });
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    const update = () => setContainerWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── React Hook Form ──
  const sessionAppliedRef = useRef(false);
  const methods = useForm<OnboardingFormValues>({
    mode: 'onBlur',
    defaultValues: async () => {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        try {
          const p = JSON.parse(saved);
          return {
            personalInfo: p.personalInfo || buildDefaultPersonalInfo(session),
            experience: p.experience || DEF_EXP,
            education: p.education || DEF_EDU,
            skills: p.skills || DEF_SKILLS,
            projects: p.projects || DEF_PROJ,
            certificates: p.certificates || DEF_CERT,
            coursework: p.coursework || DEF_COURSE,
            involvement: p.involvement || DEF_INV,
            awards: p.awards || DEF_AWD,
            publications: p.publications || DEF_PUB,
            references: p.references || DEF_REF,
            achievements: p.achievements || DEF_ACHIEVE,
            languages: p.languages || DEF_LANG,
            softskills: p.softskills || DEF_SOFT,
            internships: p.internships || DEF_INTERN,
            freelance: p.freelance || DEF_FREE,
            leadership: p.leadership || DEF_LEAD,
            volunteering: p.volunteering || DEF_VOL,
            hobbies: p.hobbies || DEF_HOBBY,
            conferences: p.conferences || DEF_CONF,
            patents: p.patents || DEF_PATENT,
            extracurricular: p.extracurricular || DEF_EXTRA,
          } as OnboardingFormValues;
        } catch {}
      }
      return {
        personalInfo: buildDefaultPersonalInfo(session),
        experience: DEF_EXP,
        education: DEF_EDU,
        skills: DEF_SKILLS,
        projects: DEF_PROJ,
        certificates: DEF_CERT,
        coursework: DEF_COURSE,
        involvement: DEF_INV,
        awards: DEF_AWD,
        publications: DEF_PUB,
        references: DEF_REF,
        achievements: DEF_ACHIEVE,
        languages: DEF_LANG,
        softskills: DEF_SOFT,
        internships: DEF_INTERN,
        freelance: DEF_FREE,
        leadership: DEF_LEAD,
        volunteering: DEF_VOL,
        hobbies: DEF_HOBBY,
        conferences: DEF_CONF,
        patents: DEF_PATENT,
        extracurricular: DEF_EXTRA,
      } as OnboardingFormValues;
    },
  });

  // ── Session sync (once, only overwrite placeholder defaults) ──
  // isFormLoading is true while async defaultValues are still resolving — guard against it
  // so we never call getValues('personalInfo') before the form is populated.
  const isFormLoading = methods.formState.isLoading;
  useEffect(() => {
    if (!session?.user || sessionAppliedRef.current || isFormLoading) return;
    const prev = methods.getValues('personalInfo');
    if (!prev) return;
    sessionAppliedRef.current = true;
    const fname = session.user.name?.split(' ')[0] || 'Rahul';
    const lname = session.user.name?.split(' ').slice(1).join(' ') || 'Sharma';
    const username = `${fname}${lname}`.toLowerCase().replace(/\s+/g, '');
    const slug = [fname, lname].filter(Boolean).map((s: string) => s.toLowerCase().replace(/\s+/g, '-')).join('-');

    methods.setValue('personalInfo', {
      ...prev,
      firstName: prev.firstName === 'Rahul' ? fname : prev.firstName,
      lastName: prev.lastName === 'Sharma' ? lname : prev.lastName,
      email: prev.email === 'rahul.sharma@example.com' ? (session.user.email ?? prev.email) : prev.email,
      links: prev.links?.length ? prev.links : [
        { type: 'website', url: `https://${username}.dev` },
        { type: 'linkedin', url: `https://www.linkedin.com/in/${slug}` },
        { type: 'github', url: `https://github.com/${username}` },
      ],
      image: prev.image === null && session.user.image
        ? { url: session.user.image, publicId: '' }
        : prev.image,
    });
  }, [session, methods, isFormLoading]);

  // ── Auto-sync local base64 image to Cloudinary after login ──
  const syncingRef = useRef(false);
  useEffect(() => {
    const img = methods.getValues('personalInfo.image');
    if (session && img?.url && !img.publicId && img.url.startsWith('data:') && !syncingRef.current) {
      syncingRef.current = true;
      (async () => {
        try {
          const res = await fetch(img.url);
          const blob = await res.blob();
          const fd = new FormData();
          fd.append('file', blob);
          const upRes = await fetch('/api/upload/image', { method: 'POST', body: fd });
          const data = await upRes.json();
          if (data.url) {
            methods.setValue('personalInfo.image', { url: data.url, publicId: data.publicId });
          }
        } catch (err) {
          console.error('Failed to sync local image:', err);
          syncingRef.current = false;
        }
      })();
    }
  }, [session, methods]);

  // ── Debounced localStorage persistence (700ms) ──
  const lsDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const subscription = methods.watch((value) => {
      if (lsDebounceRef.current) clearTimeout(lsDebounceRef.current);
      lsDebounceRef.current = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            activeStep,
            visitedSteps: Array.from(visitedSteps),
            selectedMoreIds,
            stepOrder,
            ...value,
          }));
        } catch (e) {
          console.warn('LocalStorage save failed:', e);
        }
      }, 700);
    });
    return () => {
      subscription.unsubscribe();
      if (lsDebounceRef.current) clearTimeout(lsDebounceRef.current);
    };
  }, [methods.watch, activeStep, visitedSteps, selectedMoreIds, stepOrder]);

  // ── Persist nav state to localStorage when it changes ──
  useEffect(() => {
    if (!isMounted) return;
    if (lsDebounceRef.current) clearTimeout(lsDebounceRef.current);
    lsDebounceRef.current = setTimeout(() => {
      try {
        const current = methods.getValues();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          activeStep,
          visitedSteps: Array.from(visitedSteps),
          selectedMoreIds,
          stepOrder,
          ...current,
        }));
      } catch (e) {
        console.warn('LocalStorage nav save failed:', e);
      }
    }, 100);
  }, [activeStep, visitedSteps, selectedMoreIds, stepOrder, isMounted]);

  // ── Track visited steps ──
  const stepNavRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setVisitedSteps(prev => {
      if (prev.has(activeStep)) return prev;
      const next = new Set(prev);
      next.add(activeStep);
      return next;
    });
    if (stepNavRef.current) {
      const btn = stepNavRef.current.querySelector<HTMLButtonElement>(`[data-step="${activeStep}"]`);
      btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeStep]);

  // ── Build allSteps ──
  const allSteps = useMemo(() => {
    const stepMap = new Map([
      ...BASE_STEPS.map(s => [s.id, s] as const),
      ...MORE_SECTION_DEFS.map(s => [s.id, s] as const),
    ]);
    const validIds = new Set([
      ...BASE_STEPS.filter(s => s.id !== 'more').map(s => s.id),
      ...selectedMoreIds,
    ]);
    const ordered = stepOrder.filter(id => validIds.has(id));
    for (const id of validIds) if (!ordered.includes(id)) ordered.push(id);
    return [
      ...ordered.map(id => stepMap.get(id)!).filter(Boolean),
      BASE_STEPS[4], // 'more' always last
    ];
  }, [stepOrder, selectedMoreIds]);

  const progressSteps = useMemo(() => allSteps.filter(s => s.id !== 'more'), [allSteps]);

  // ── Step completion (reads from RHF) ──
  const formValues = methods.watch();

  const isStepComplete = useCallback((id: string): boolean => {
    const v = formValues;
    switch (id) {
      case 'personal':       return !!(v.personalInfo?.firstName && v.personalInfo?.lastName && v.personalInfo?.email);
      case 'experience':     return (v.experience ?? []).some(e => e.role && e.company && e.start);
      case 'education':      return (v.education ?? []).some(e => e.school && e.degree);
      case 'skills':         return (v.skills ?? []).length >= 3;
      case 'projects':       return (v.projects ?? []).some(p => p.title && p.description);
      case 'certificates':   return (v.certificates ?? []).some(c => c.name && c.issuer);
      case 'coursework':     return (v.coursework ?? []).some(c => c.course);
      case 'involvement':    return (v.involvement ?? []).some(i => i.organization && i.role);
      case 'awards':         return (v.awards ?? []).some(a => a.name);
      case 'publications':   return (v.publications ?? []).some(p => p.title);
      case 'references':     return (v.references ?? []).some(r => r.name && (r.email || r.phone));
      case 'achievements':   return (v.achievements ?? []).some(a => a.title);
      case 'languages':      return (v.languages ?? []).some(l => l.language);
      case 'softskills':     return (v.softskills ?? []).some(s => s.skill);
      case 'internships':    return (v.internships ?? []).some(i => i.role && i.company);
      case 'freelance':      return (v.freelance ?? []).some(f => f.role && f.client);
      case 'leadership':     return (v.leadership ?? []).some(l => l.role && l.organization);
      case 'volunteering':   return (v.volunteering ?? []).some(v => v.role && v.organization);
      case 'hobbies':        return (v.hobbies ?? []).some(h => h.name);
      case 'conferences':    return (v.conferences ?? []).some(c => c.title);
      case 'patents':        return (v.patents ?? []).some(p => p.title);
      case 'extracurricular':return (v.extracurricular ?? []).some(e => e.activity && e.organization);
      default:               return false;
    }
  }, [formValues]);

  const completedCount = useMemo(
    () => progressSteps.filter(s => isStepComplete(s.id) && visitedSteps.has(s.id)).length,
    [progressSteps, isStepComplete, visitedSteps]
  );
  const totalCount  = progressSteps.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const currentIndex = allSteps.findIndex(s => s.id === activeStep);
  const currentStep  = allSteps[currentIndex] ?? allSteps[0];
  const isLastStep   = currentIndex === allSteps.length - 1;

  // ── Resume data for preview ──
  const resumeData = useMemo(() => buildResume({
    personalInfo:   formValues.personalInfo,
    experience:     formValues.experience     ?? [],
    education:      formValues.education      ?? [],
    skills:         formValues.skills         ?? [],
    projects:       formValues.projects       ?? [],
    certificates:   formValues.certificates   ?? [],
    coursework:     formValues.coursework     ?? [],
    involvement:    formValues.involvement    ?? [],
    awards:         formValues.awards         ?? [],
    publications:   formValues.publications   ?? [],
    references:     formValues.references     ?? [],
    achievements:   formValues.achievements   ?? [],
    languages:      formValues.languages      ?? [],
    softskills:     formValues.softskills     ?? [],
    internships:    formValues.internships    ?? [],
    freelance:      formValues.freelance      ?? [],
    leadership:     formValues.leadership     ?? [],
    volunteering:   formValues.volunteering   ?? [],
    hobbies:        formValues.hobbies        ?? [],
    conferences:    formValues.conferences    ?? [],
    patents:        formValues.patents        ?? [],
    extracurricular:formValues.extracurricular ?? [],
    selectedMoreIds,
    stepOrder,
  }), [formValues, selectedMoreIds, stepOrder]);

  // ── Debounced resume data for preview (300ms, prevents flicker) ──
  const [debouncedResumeData, setDebouncedResumeData] = useState(resumeData);
  const previewDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);
    previewDebounceRef.current = setTimeout(() => setDebouncedResumeData(resumeData), 300);
    return () => { if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current); };
  }, [resumeData]);

  // ── Undo / redo ──
  const applySnapshot = useCallback((snap: OnboardingFormValues) => {
    methods.reset(snap, { keepDefaultValues: true });
  }, [methods]);

  const { canUndo, canRedo, undo, redo } = useResumeHistory(formValues, applySnapshot);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault(); undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault(); redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // ── DnD (step reordering) ──
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveDragId(e.active.id as string);
  }, []);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setStepOrder(prev => {
      const oldIdx = prev.indexOf(active.id as string);
      let newIdx = prev.indexOf(over.id as string);
      if (oldIdx === -1) return prev;
      // If over.id is not in stepOrder yet (e.g. a newly added section), append
      if (newIdx === -1) return [...prev, active.id as string];
      if (newIdx === 0) newIdx = 1;
      const result = arrayMove(prev, oldIdx, newIdx);
      const pIdx = result.indexOf('personal');
      if (pIdx > 0) { result.splice(pIdx, 1); result.unshift('personal'); }
      return result;
    });
    setActiveStep(active.id as string);
  }, []);

  // ── Navigation ──
  const handleContinue = useCallback(() => {
    if (currentIndex < allSteps.length - 1) {
      setActiveStep(allSteps[currentIndex + 1].id);
    }
  }, [currentIndex, allSteps]);

  // ── Toggle more sections ──
  const toggleMoreSection = useCallback((id: string) => {
    if (selectedMoreIds.includes(id)) {
      setConfirmModal({
        open: true,
        title: 'Remove Section?',
        message: `Are you sure you want to remove the ${id} section? This will clear all data in this section.`,
        onConfirm: () => {
          setSelectedMoreIds(prev => prev.filter(x => x !== id));
          if (activeStep === id) setActiveStep('more');
          setConfirmModal(null);
        },
      });
      return;
    }
    setSelectedMoreIds(prev => [...prev, id]);
    setStepOrder(prev => prev.includes(id) ? prev : [...prev, id]);
  }, [selectedMoreIds, activeStep]);

  // ── Complete (submit) ──
  const handleComplete = useCallback(async () => {
    if (!session) { setIsAuthModalOpen(true); return; }
    setIsLoading(true);
    try {
      const values = methods.getValues();
      const payload = {
        personalInfo: values.personalInfo,
        onboardingData: {
          experience: values.experience,
          education: values.education,
          skills: values.skills,
          projects: values.projects,
          certificates: values.certificates,
          coursework: values.coursework,
          involvement: values.involvement,
          awards: values.awards,
          publications: values.publications,
          references: values.references,
          achievements: values.achievements,
          languages: values.languages,
          softskills: values.softskills,
          internships: values.internships,
          freelance: values.freelance,
          leadership: values.leadership,
          volunteering: values.volunteering,
          hobbies: values.hobbies,
          conferences: values.conferences,
          patents: values.patents,
          extracurricular: values.extracurricular,
        },
      };
      const res = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        toast.success('Profile saved!');
        // update NextAuth session
        router.push('/dashboard');
      } else {
        toast.error('Failed to save profile');
      }
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsLoading(false);
    }
  }, [session, methods, router]);

  // ── Reset ──
  const handleReset = useCallback(() => {
    setConfirmModal({
      open: true,
      title: 'Reset Onboarding?',
      message: 'Are you sure you want to reset everything? All your progress and entered info will be lost permanently.',
      confirmLabel: 'Yes, reset everything',
      onConfirm: () => {
        const img = methods.getValues('personalInfo.image');
        if (img?.publicId) {
          fetch(`/api/upload/image/delete?publicId=${encodeURIComponent(img.publicId)}`, { method: 'DELETE' })
            .catch(err => console.error('Reset cleanup failed:', err));
        }
        const fname = session?.user?.name?.split(' ')[0] || 'Rahul';
        const lname = session?.user?.name?.split(' ').slice(1).join(' ') || 'Sharma';
        const username = `${fname}${lname}`.toLowerCase().replace(/\s+/g, '');
        const slug = [fname, lname].filter(Boolean).map((s: string) => s.toLowerCase().replace(/\s+/g, '-')).join('-');

        methods.reset({
          personalInfo: {
            firstName: fname, lastName: lname,
            professionalTitle: 'Software Engineer',
            email: session?.user?.email ?? 'rahul.sharma@example.com',
            phone: '+91 98765 43210',
            location: 'Bengaluru, Karnataka',
            summary: 'Creative and detail-oriented Software Engineer with a passion for building beautiful, user-centric applications. Experienced in modern web technologies and agile methodologies.',
            website: '', linkedIn: '',
            links: [
              { type: 'website', url: `https://${username}.dev` },
              { type: 'linkedin', url: `https://www.linkedin.com/in/${slug}` },
              { type: 'github', url: `https://github.com/${username}` },
            ],
            image: session?.user?.image ? { url: session.user.image, publicId: '' } : null,
          },
          experience:    DEF_EXP,    education:  DEF_EDU,    skills:     DEF_SKILLS,
          projects:      DEF_PROJ,   certificates: DEF_CERT, coursework: DEF_COURSE,
          involvement:   DEF_INV,    awards:     DEF_AWD,    publications: DEF_PUB,
          references:    DEF_REF,    achievements: DEF_ACHIEVE, languages: DEF_LANG,
          softskills:    DEF_SOFT,   internships: DEF_INTERN, freelance: DEF_FREE,
          leadership:    DEF_LEAD,   volunteering: DEF_VOL,  hobbies:   DEF_HOBBY,
          conferences:   DEF_CONF,   patents:    DEF_PATENT, extracurricular: DEF_EXTRA,
        });
        setSelectedMoreIds([]);
        setStepOrder(['personal', 'experience', 'education', 'skills']);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('resumeTemplateOptions');
        setTemplateOptions(DEFAULT_TEMPLATE_OPTIONS);
        setPreviewTemplate('template1');
        setVisitedSteps(new Set(['personal']));
        setActiveStep('personal');
        setConfirmModal(null);
        sessionAppliedRef.current = false;
        toast.success('Onboarding reset');
      },
    });
  }, [session, methods]);

  const onTogglePhoto = useCallback(() => {
    const next = { ...templateOptions, showPhoto: !templateOptions.showPhoto };
    setTemplateOptions(next);
    localStorage.setItem('resumeTemplateOptions', JSON.stringify(next));
  }, [templateOptions]);

  return {
    methods,
    // hydration
    isMounted,
    // nav state
    activeStep, setActiveStep,
    visitedSteps,
    selectedMoreIds,
    stepOrder,
    activeDragId,
    stepNavRef,
    // UI state
    isLoading,
    isAuthModalOpen, setIsAuthModalOpen,
    stepsDrawerOpen, setStepsDrawerOpen,
    showPreview, setShowPreview,
    confirmModal, setConfirmModal,
    // preview
    previewTemplate, setPreviewTemplate,
    templateOptions, setTemplateOptions,
    containerWidth,
    debouncedResumeData,
    // computed
    allSteps,
    progressSteps,
    isStepComplete,
    completedCount,
    totalCount,
    progressPct,
    currentIndex,
    currentStep,
    isLastStep,
    // undo/redo
    canUndo, canRedo, undo, redo,
    // DnD
    sensors,
    handleDragStart,
    handleDragEnd,
    // actions
    handleContinue,
    handleComplete,
    handleReset,
    toggleMoreSection,
    onTogglePhoto,
  };
}
