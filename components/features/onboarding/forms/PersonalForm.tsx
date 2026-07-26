'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { FiX, FiUpload, FiPlus, FiArrowRight, FiLock } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaXTwitter, FaDiscord, FaFigma, FaDribbble, FaBehance, FaSketch } from 'react-icons/fa6';
import { FiGlobe, FiExternalLink } from 'react-icons/fi';
import { getSummariesForRole } from '@/lib/summary-templates';
import { CF, ACA, TA, AiSparkleIcon, AiSuggestionsButton } from './FormFields';
import { SuggestionsModal } from './SuggestionsModal';
import { useOnboardingContext } from '../OnboardingContext';
import type { OnboardingFormValues } from '../types';

const SOCIAL_PLATFORMS = [
  { id: 'website',  label: 'Website',      icon: <FiGlobe />,        placeholder: 'https://{username}.dev' },
  { id: 'linkedin', label: 'LinkedIn',     icon: <FaLinkedin />,     placeholder: 'https://linkedin.com/in/{username}' },
  { id: 'github',   label: 'GitHub',       icon: <FaGithub />,       placeholder: 'https://github.com/{username}' },
  { id: 'twitter',  label: 'X (Twitter)',  icon: <FaXTwitter />,     placeholder: 'https://x.com/{username}' },
  { id: 'discord',  label: 'Discord',      icon: <FaDiscord />,      placeholder: 'Discord Invite/User' },
  { id: 'figma',    label: 'Figma',        icon: <FaFigma />,        placeholder: 'https://figma.com/@{username}' },
  { id: 'dribbble', label: 'Dribbble',     icon: <FaDribbble />,     placeholder: 'https://dribbble.com/{username}' },
  { id: 'behance',  label: 'Behance',      icon: <FaBehance />,      placeholder: 'https://behance.net/{username}' },
  { id: 'sketch',   label: 'Sketch',       icon: <FaSketch />,       placeholder: 'https://sketch.com/@{username}' },
  { id: 'custom',   label: 'Custom',       icon: <FiExternalLink />, placeholder: 'https://example.com' },
];

function ComingSoonModal({ title, description, onClose }: { title: string; description: string; onClose: () => void }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <FiX className="text-sm" />
        </button>

        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
          <FiLock className="text-xl" />
        </div>

        <span className="mb-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
          Coming Soon
        </span>

        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {description}
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>,
    document.body
  );
}

function ImageUploadModal({ onUploaded, onClose }: {
  currentPublicId?: string;
  onUploaded: (url: string, publicId: string) => void;
  onClose: () => void;
}) {
  const [staged, setStaged]         = useState<{ file: File; preview: string } | null>(null);
  const [dragging, setDragging]     = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [visibleProg, setVisibleProg] = useState(0);
  const [error, setError]           = useState('');
  const [showAiHeadshotComingSoon, setShowAiHeadshotComingSoon] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed.'); return; }
    if (file.size > 5 * 1024 * 1024)    { setError('File must be under 5 MB.');       return; }
    setError('');
    if (staged) URL.revokeObjectURL(staged.preview);
    setStaged({ file, preview: URL.createObjectURL(file) });
  };

  useEffect(() => {
    const preview = staged?.preview;
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [staged?.preview]);

  useEffect(() => {
    if (!uploading) return;
    const timer = setInterval(() => {
      setVisibleProg(prev => {
        if (prev >= 99) return 99;
        const target = Math.min(progress, 98);
        if (prev < target) return Math.min(prev + 5, target);
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(timer);
  }, [uploading, progress]);

  const addFiles = (files: FileList | null) => { if (files?.[0]) pickFile(files[0]); };

  const upload = () => {
    if (!staged) return;
    setUploading(true);
    setProgress(0);
    setError('');

    const reader = new FileReader();
    reader.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
    reader.onload = () => { setUploading(false); onUploaded(reader.result as string, ''); };
    reader.onerror = () => { setError('Failed to read file locally.'); setUploading(false); };
    reader.readAsDataURL(staged.file);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Upload Profile Photo</h2>
          <button onClick={onClose} className="cursor-pointer text-slate-400 transition hover:text-slate-600"><FiX /></button>
        </div>
        <div className="space-y-4 p-6">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors ${
              dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/60'
            }`}
          >
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => addFiles(e.target.files)} />
            <FiUpload className="text-2xl text-slate-400" />
            <p className="text-sm text-slate-600">Drag & drop or <span className="text-indigo-600 underline underline-offset-2">browse files</span></p>
            <p className="text-xs text-slate-400">JPG, PNG, WebP · max 5 MB each</p>
          </div>
          {staged && (
            <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="relative h-16 w-16 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={staged.preview} alt="" className="h-full w-full rounded-xl object-cover ring-1 ring-slate-200" />
                {uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-[2px]">
                    <svg className="h-10 w-10 -rotate-90" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-200" />
                      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="3" fill="none"
                        className="text-indigo-600 transition-all duration-300 ease-out"
                        strokeDasharray={75.4} strokeDashoffset={75.4 - (visibleProg / 100) * 75.4} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-indigo-700">{visibleProg}%</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-700">{staged.file.name}</p>
                <p className="text-xs text-slate-400">{(staged.file.size / 1024).toFixed(0)} KB</p>
              </div>
              {!uploading && (
                <button onClick={() => { URL.revokeObjectURL(staged.preview); setStaged(null); }} className="cursor-pointer text-slate-400 transition hover:text-red-500">
                  <FiX />
                </button>
              )}
            </div>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="button"
            onClick={() => setShowAiHeadshotComingSoon(true)}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-3.5 text-left transition hover:from-indigo-100 hover:to-violet-100 ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
              <AiSparkleIcon className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-indigo-700">Create Professional AI Headshot</p>
              <p className="text-xs text-slate-500">Generate a studio-quality photo with AI</p>
            </div>
            <FiArrowRight className="flex-shrink-0 text-indigo-400" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} disabled={uploading} className="cursor-pointer text-sm text-slate-500 transition hover:text-slate-700 disabled:opacity-50">Cancel</button>
          <button onClick={upload} disabled={!staged || uploading}
            className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40">
            {uploading ? (
              <><svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Uploading…</span></>
            ) : 'Upload photo'}
          </button>
        </div>
      </div>

      {showAiHeadshotComingSoon && (
        <ComingSoonModal
          title="AI Headshot Generator"
          description="Our AI studio headshot feature is under development. Soon you will be able to generate professional studio-quality headshots automatically!"
          onClose={() => setShowAiHeadshotComingSoon(false)}
        />
      )}
    </div>,
    document.body
  );
}

export function PersonalForm() {
  const { register, setValue, control } = useFormContext<OnboardingFormValues>();
  const { showPhoto, onTogglePhoto } = useOnboardingContext();

  // Watch only the fields actually used for conditional rendering — avoids full-form re-renders on every keystroke
  const image            = useWatch({ control, name: 'personalInfo.image' });
  const firstName        = useWatch({ control, name: 'personalInfo.firstName' });
  const lastName         = useWatch({ control, name: 'personalInfo.lastName' });
  const professionalTitle = useWatch({ control, name: 'personalInfo.professionalTitle' });
  const { fields: links, append: appendLink, remove: removeLink } = useFieldArray({ control, name: 'personalInfo.links' });

  const [modalOpen, setModalOpen]         = useState(false);
  const [imgLoading, setImgLoading]       = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [aiHeadshotComingSoon, setAiHeadshotComingSoon] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleDeleteImage = () => {
    setValue('personalInfo.image', null);
  };

  const userInitial = firstName?.[0]?.toUpperCase() ?? 'A';
  const availablePlatforms = SOCIAL_PLATFORMS.filter(p => !links.some(l => l.type === p.id));

  return (
    <div className="space-y-5">
      {/* Profile photo */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="mb-4 text-sm text-slate-600">Profile photo</p>
        <div className="flex items-center gap-5">
          <div className="group relative h-20 w-20 flex-shrink-0">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-indigo-50 ring-2 ring-indigo-100">
              {imgLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center animate-pulse bg-indigo-50">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500" />
                </div>
              )}
              {image ? (
                <Image src={image.url} alt="Profile" width={80} height={80}
                  className={`h-full w-full object-cover transition-opacity duration-500 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImgLoading(false)} onError={() => setImgLoading(false)} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-indigo-500">{userInitial}</div>
              )}
            </div>
            {image && !imgLoading && (
              <button onClick={handleDeleteImage} className="absolute -right-0.5 -top-0.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition group-hover:opacity-100">
                <FiX className="text-[9px]" />
              </button>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setModalOpen(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
                <FiUpload className="text-sm" /> {image ? 'Change photo' : 'Upload photo'}
              </button>
              <button
                type="button"
                onClick={() => setAiHeadshotComingSoon(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-violet-700"
              >
                <AiSparkleIcon /> Create AI Headshot
              </button>
            </div>
            <p className="text-[11px] text-slate-400">JPG, PNG or WebP · max 5 MB</p>
          </div>
        </div>
      </div>

      {aiHeadshotComingSoon && (
        <ComingSoonModal
          title="AI Headshot Generator"
          description="Our AI studio headshot feature is under development. Soon you will be able to generate professional studio-quality headshots automatically!"
          onClose={() => setAiHeadshotComingSoon(false)}
        />
      )}

      {/* Photo visibility toggle */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3">
        <div>
          <p className="text-sm font-medium text-slate-700">Show photo in resume</p>
          <p className="text-xs text-slate-400">Toggle photo visibility on the template</p>
        </div>
        <button onClick={onTogglePhoto}
          className={`relative inline-flex h-6 w-10 cursor-pointer items-center rounded-full transition-colors ${showPhoto ? 'bg-indigo-500' : 'bg-slate-200'}`}>
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${showPhoto ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CF label="First name" {...register('personalInfo.firstName')} required />
        <CF label="Last name"  {...register('personalInfo.lastName')}  required />
      </div>
      <ACA label="Professional title" type="role" name="personalInfo.professionalTitle" hint="Role you're targeting — shown large on the resume." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CF label="Email" {...register('personalInfo.email')} type="email" required />
        <CF label="Phone" {...register('personalInfo.phone')} />
      </div>
      <ACA label="Location" type="location" name="personalInfo.location" />
      <TA label="Profile Summary" {...register('personalInfo.summary')}
        placeholder="Briefly describe your background, key skills, and what you're looking for..."
        hint="A strong summary captures a recruiter's attention in seconds."
        action={<AiSuggestionsButton onClick={() => setSuggestionsOpen(true)} />}
      />

      {/* Social & Portfolio Links */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Social & Portfolio Links</p>
          {availablePlatforms.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button type="button" onClick={() => setMenuOpen(!menuOpen)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                <FiPlus className={`text-sm transition-transform duration-300 ${menuOpen ? 'rotate-45' : ''}`} /> Add link
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-[280px] sm:w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="grid grid-cols-2 gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {availablePlatforms.map(p => (
                      <button key={p.id} type="button"
                        onClick={() => {
                          const username = ((firstName || '') + (lastName || '')).toLowerCase() || 'username';
                          appendLink({ type: p.id, url: p.placeholder.replace('{username}', username) });
                          setMenuOpen(false);
                        }}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[11px] text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600">
                        <span className="flex-shrink-0 text-slate-400">{p.icon}</span>
                        <span className="truncate font-medium">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {links.map((link, i) => {
            const p = SOCIAL_PLATFORMS.find(x => x.id === link.type) || SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];
            return (
              <div key={link.id} className="group relative flex animate-in fade-in zoom-in-95 duration-300 items-center rounded-xl border border-slate-200 bg-white p-1 pr-1.5 transition-all hover:border-indigo-200 hover:shadow-sm">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-500">
                  {p.icon}
                </div>
                <input type="text" {...register(`personalInfo.links.${i}.url` as const)}
                  placeholder={p.placeholder.replace('{username}', ((firstName || '') + (lastName || '')).toLowerCase() || 'username')}
                  className="w-full bg-transparent px-2.5 py-2 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-300" />
                <button type="button" onClick={() => removeLink(i)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100" title={`Remove ${p.label}`}>
                  <FiX className="text-xs" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {modalOpen && (
        <ImageUploadModal
          currentPublicId={image?.publicId}
          onUploaded={(url, publicId) => { setImgLoading(true); setValue('personalInfo.image', { url, publicId }); setModalOpen(false); }}
          onClose={() => setModalOpen(false)}
        />
      )}
      <SuggestionsModal
        isOpen={suggestionsOpen}
        onClose={() => setSuggestionsOpen(false)}
        onSelect={(s) => { setValue('personalInfo.summary', s); setSuggestionsOpen(false); }}
        title="Summary Suggestions"
        subtitle="Find ATS-friendly phrases tailored to your role"
        searchLabel="Search by Job Title"
        searchPlaceholder="e.g. Frontend Developer"
        defaultSearch={professionalTitle || ''}
        fetchSuggestions={getSummariesForRole}
      />
    </div>
  );
}
