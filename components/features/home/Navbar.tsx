'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import { BrandLogo } from './BrandLogo';
import { navLinks } from './home.constants';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex h-[56px] items-center justify-between px-4 text-sm text-slate-800 bg-white/70 backdrop-blur-md border-b border-gray-100 sm:px-6 lg:px-10">
        <Link href="/" aria-label="FreshResume home">
          <BrandLogo />
        </Link>

        {/* Center links: Home & Templates */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-indigo-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right CTA: Build Resume Free */}
        <div className="hidden md:block">
          <Link
            href="/resume/builder"
            className="group flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-md active:scale-95"
          >
            <span>Build Resume Free</span>
            <FiArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsMobileMenuOpen(true)}
          className="cursor-pointer text-slate-700 transition active:scale-90 md:hidden"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-slate-950/30 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          className={`absolute inset-y-0 left-0 flex w-[85vw] max-w-[20rem] flex-col border-r border-slate-200 bg-white text-slate-800 shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <Link
              href="/"
              aria-label="FreshResume home"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BrandLogo />
            </Link>

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-between p-5">
            <div className="space-y-3">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Menu
              </p>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <span>{link.label}</span>
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/resume/builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <span>Build Resume Free</span>
                <FiArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
