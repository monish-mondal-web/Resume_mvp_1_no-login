'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { FiX, FiUpload, FiPlus, FiArrowRight, FiAlertTriangle } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaXTwitter, FaDiscord, FaFigma, FaDribbble, FaBehance, FaSketch } from 'react-icons/fa6';
import { FiGlobe, FiExternalLink, FiMessageSquare, FiSearch } from 'react-icons/fi';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { getSummariesForRole } from '@/lib/summary-templates';
import { CF, ACA, TA } from './FormFields';
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

function AiSparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8L12 2z" fill="currentColor" />
      <path d="M19 14l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6L15.5 17.5l2.6-.9L19 14z" fill="currentColor" opacity=".7" />
      <path d="M5.5 16l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9z" fill="currentColor" opacity=".5" />
    </svg>
  );
}

function ImageUploadModal({ currentPublicId, session, onUploaded, onClose }: {
  currentPublicId?: string;
  session: any;
  onUploaded: (url: string, publicId: string) => void;
  onClose: () => void;
}) {
  const [staged, setStaged]         = useState<{ file: File; preview: string } | null>(null);
  const [dragging, setDragging]     = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [visibleProg, setVisibleProg] = useState(0);
  const [error, setError]           = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed.'); return; }
    if (file.size > 5 * 1024 * 1024)    { setError('File must be under 5 MB.');       return; }
    setError('');
    if (staged) URL.revokeObjectURL(staged.preview);
    setStaged({ file, preview: URL.createObjectURL(file) });
  };

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

    if (!session) {
      const reader = new FileReader();
      reader.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
      reader.onload = () => { setUploading(false); onUploaded(reader.result as string, ''); };
      reader.onerror = () => { setError('Failed to read file locally.'); setUploading(false); };
      reader.readAsDataURL(staged.file);
      return;
    }

    const fd = new FormData();
    fd.append('file', staged.file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload/image');
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = async () => {
      setUploading(false);
      const resp = JSON.parse(xhr.responseText);
      if (xhr.status === 200 && resp.url) {
        onUploaded(resp.url, resp.publicId);
        if (currentPublicId) {
          fetch(`/api/upload/image/delete?publicId=${encodeURIComponent(currentPublicId)}`, { method: 'DELETE' }).catch(console.error);
        }
      } else {
        setError(resp.message ?? 'Upload failed');
      }
    };
    xhr.onerror = () => { setUploading(false); setError('Network error occurred.'); };
    xhr.send(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={onClose}>
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
          <a href="/ai-headshot" target="_blank" rel="noopener noreferrer"
            className={`flex cursor-pointer items-center gap-3 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-3.5 transition hover:from-indigo-100 hover:to-violet-100 ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
              <AiSparkleIcon className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-indigo-700">Create Professional AI Headshot</p>
              <p className="text-xs text-slate-500">Generate a studio-quality photo with AI</p>
            </div>
            <FiArrowRight className="flex-shrink-0 text-indigo-400" />
          </a>
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
    </div>
  );
}

function SummarySuggestionsModal({ currentTitle, onSelect, onClose }: {
  currentTitle: string; onSelect: (s: string) => void; onClose: () => void;
}) {
  const [searchRole, setSearchRole] = useState(currentTitle);
  const [summaries, setSummaries]   = useState<string[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => { setSummaries(getSummariesForRole(searchRole)); setLoading(false); }, 500);
    return () => clearTimeout(t);
  }, [searchRole]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Summary Suggestions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Find ATS-friendly phrases tailored to your role</p>
          </div>
          <button onClick={onClose} className="cursor-pointer text-slate-400 transition hover:text-slate-600"><FiX className="text-xl" /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Search by Job Title</label>
            <Autocomplete type="role" value={searchRole} onChange={setSearchRole} trackOnBlur={false}
              placeholder="e.g. Frontend Developer"
              inputClassName="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 shadow-sm" />
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
                  <div className="relative h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                </div>
                <p className="mt-6 text-sm font-medium text-slate-500 animate-pulse">Generating AI suggestions...</p>
              </div>
            ) : summaries.length > 0 ? (
              summaries.map((s, idx) => (
                <div key={idx} className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <FiMessageSquare className="text-sm" />
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-slate-700">{s}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => onSelect(s)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-indigo-600 hover:text-white">
                      <FiPlus className="text-sm" /> Use this summary
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center"><p className="text-sm text-slate-500">Type a job title to see suggestions.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PersonalForm() {
  const { register, watch, setValue, control } = useFormContext<OnboardingFormValues>();
  const { data: session } = useSession();
  const { showPhoto, onTogglePhoto } = useOnboardingContext();

  const data = watch('personalInfo');
  const { fields: links, append: appendLink, remove: removeLink } = useFieldArray({ control, name: 'personalInfo.links' });

  const [modalOpen, setModalOpen]         = useState(false);
  const [imgLoading, setImgLoading]       = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleDeleteImage = async () => {
    if (!data?.image) return;
    const prevImage = data.image;
    setValue('personalInfo.image', null);
    if (prevImage.publicId) {
      try { await fetch(`/api/upload/image/delete?publicId=${encodeURIComponent(prevImage.publicId)}`, { method: 'DELETE' }); }
      catch (err) { console.error('Failed to delete image:', err); }
    }
  };

  const userInitial = data?.firstName?.[0]?.toUpperCase() ?? 'A';
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
              {data?.image ? (
                <Image src={data.image.url} alt="Profile" width={80} height={80}
                  className={`h-full w-full object-cover transition-opacity duration-500 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImgLoading(false)} onError={() => setImgLoading(false)} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-indigo-500">{userInitial}</div>
              )}
            </div>
            {data?.image && !imgLoading && (
              <button onClick={handleDeleteImage} className="absolute -right-0.5 -top-0.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition group-hover:opacity-100">
                <FiX className="text-[9px]" />
              </button>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setModalOpen(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
                <FiUpload className="text-sm" /> {data?.image ? 'Change photo' : 'Upload photo'}
              </button>
              <a href="/ai-headshot" target="_blank" rel="noopener noreferrer"
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-violet-700">
                <AiSparkleIcon /> Create AI Headshot
              </a>
            </div>
            <p className="text-[11px] text-slate-400">JPG, PNG or WebP · max 5 MB</p>
          </div>
        </div>
      </div>

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
        action={
          <button type="button" onClick={() => setSuggestionsOpen(true)}
            className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
            <AiSparkleIcon className="text-slate-400 transition-colors group-hover:text-indigo-500" /> AI Suggestions
          </button>
        }
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
                          const username = ((data?.firstName || '') + (data?.lastName || '')).toLowerCase() || 'username';
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
                  placeholder={p.placeholder.replace('{username}', ((data?.firstName || '') + (data?.lastName || '')).toLowerCase() || 'username')}
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
          currentPublicId={data?.image?.publicId}
          session={session}
          onUploaded={(url, publicId) => { setImgLoading(true); setValue('personalInfo.image', { url, publicId }); setModalOpen(false); }}
          onClose={() => setModalOpen(false)}
        />
      )}
      {suggestionsOpen && (
        <SummarySuggestionsModal
          currentTitle={data?.professionalTitle || ''}
          onSelect={(s) => { setValue('personalInfo.summary', s); setSuggestionsOpen(false); }}
          onClose={() => setSuggestionsOpen(false)}
        />
      )}
    </div>
  );
}
