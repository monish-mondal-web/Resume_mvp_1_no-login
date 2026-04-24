import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FiX, FiUpload, FiPlus } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaXTwitter, FaDiscord, FaFigma, FaDribbble, FaBehance, FaSketch } from 'react-icons/fa6';
import { FiGlobe, FiExternalLink } from 'react-icons/fi';
import { CF, ACA, TA } from './FormFields';
import { OnboardingFormValues } from '../types';

const SOCIAL_PLATFORMS = [
  { id: 'website', label: 'Website', icon: <FiGlobe />, placeholder: 'https://{username}.dev' },
  { id: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin />, placeholder: 'https://linkedin.com/in/{username}' },
  { id: 'github', label: 'GitHub', icon: <FaGithub />, placeholder: 'https://github.com/{username}' },
  { id: 'twitter', label: 'X (Twitter)', icon: <FaXTwitter />, placeholder: 'https://x.com/{username}' },
  { id: 'discord', label: 'Discord', icon: <FaDiscord />, placeholder: 'Discord Invite/User' },
  { id: 'figma', label: 'Figma', icon: <FaFigma />, placeholder: 'https://figma.com/@{username}' },
  { id: 'dribbble', label: 'Dribbble', icon: <FaDribbble />, placeholder: 'https://dribbble.com/{username}' },
  { id: 'behance', label: 'Behance', icon: <FaBehance />, placeholder: 'https://behance.net/{username}' },
  { id: 'sketch', label: 'Sketch', icon: <FaSketch />, placeholder: 'https://sketch.com/@{username}' },
  { id: 'custom', label: 'Custom', icon: <FiExternalLink />, placeholder: 'https://example.com' },
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

export function PersonalForm() {
  const { register, watch, setValue, control } = useFormContext<OnboardingFormValues>();
  const data = watch('personalInfo');
  
  const { fields: links, append: appendLink, remove: removeLink } = useFieldArray({
    control,
    name: 'personalInfo.links',
  });

  const userInitial = data?.firstName?.[0]?.toUpperCase() ?? 'A';
  const [imgLoading, setImgLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleDeleteImage = async () => {
    if (!data?.image) return;
    const prevImage = data.image;
    setValue('personalInfo.image', null);
    if (prevImage.publicId) {
      try {
        await fetch(`/api/upload/image/delete?publicId=${encodeURIComponent(prevImage.publicId)}`, { method: 'DELETE' });
      } catch (err) { console.error('Failed to delete image:', err); }
    }
  };

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
                <Image 
                  src={data.image.url} 
                  alt="Profile" 
                  width={80} 
                  height={80} 
                  className={`h-full w-full object-cover transition-opacity duration-500 ${imgLoading ? 'opacity-0' : 'opacity-100'}`} 
                  onLoad={() => setImgLoading(false)} 
                  onError={() => setImgLoading(false)} 
                />
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
              <button type="button" className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
                <FiUpload className="text-sm" /> {data?.image ? 'Change photo' : 'Upload photo'}
              </button>
              <a href="/ai-headshot" target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-violet-700">
                <AiSparkleIcon /> Create AI Headshot
              </a>
            </div>
            <p className="text-[11px] text-slate-400">JPG, PNG or WebP · max 5 MB</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CF label="First name" {...register('personalInfo.firstName')} required />
        <CF label="Last name" {...register('personalInfo.lastName')} required />
      </div>
      
      <ACA 
        label="Professional title" 
        type="role" 
        name="personalInfo.professionalTitle" 
        hint="Role you're targeting — shown large on the resume." 
      />
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CF label="Email" {...register('personalInfo.email')} type="email" required />
        <CF label="Phone" {...register('personalInfo.phone')} />
      </div>
      
      <ACA 
        label="Location" 
        type="location" 
        name="personalInfo.location" 
      />
      
      <TA 
        label="Profile Summary" 
        {...register('personalInfo.summary')}
        placeholder="Briefly describe your background, key skills, and what you're looking for..." 
        hint="A strong summary captures a recruiter's attention in seconds."
        action={
          <button 
            type="button" 
            className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <AiSparkleIcon className="text-slate-400 transition-colors group-hover:text-indigo-500" /> 
            AI Suggestions
          </button>
        }
      />

      {/* Social Links */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Social & Portfolio Links</p>
          {availablePlatforms.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <FiPlus className={`text-sm transition-transform duration-300 ${menuOpen ? 'rotate-45' : ''}`} /> 
                Add link
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-[280px] sm:w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="grid grid-cols-2 gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {availablePlatforms.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          const username = ((data?.firstName || '') + (data?.lastName || '')).toLowerCase() || 'username';
                          const dummyUrl = p.placeholder.replace('{username}', username);
                          appendLink({ type: p.id, url: dummyUrl });
                          setMenuOpen(false);
                        }}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[11px] text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <span className="flex-shrink-0 text-slate-400 group-hover:text-indigo-500">{p.icon}</span>
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
                <input
                  type="text"
                  {...register(`personalInfo.links.${i}.url` as const)}
                  placeholder={p.placeholder.replace('{username}', ((data?.firstName || '') + (data?.lastName || '')).toLowerCase() || 'username')}
                  className="w-full bg-transparent px-2.5 py-2 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  title={`Remove ${p.label}`}
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
