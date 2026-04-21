'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaCrown } from 'react-icons/fa';
import { FiChevronDown, FiChevronRight, FiMenu, FiX } from 'react-icons/fi';
import { AccountMenu, AccountMenuItems } from './AccountMenu';
import { BrandLogo } from './BrandLogo';
import { navLinks } from './home.constants';

interface NavbarProps {
  onLoginClick: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userInitial =
    session?.user?.name?.[0] || session?.user?.email?.[0] || 'U';
  const userSecondaryText = session?.user?.email || 'Resume Builder';

  const handlePrimaryAction = () => {
    if (session) {
      setIsDropdownOpen((isOpen) => !isOpen);
      return;
    }

    onLoginClick();
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileAccountOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="z-50 flex w-full items-center justify-between px-6 py-4 text-sm text-slate-800 backdrop-blur md:px-16 lg:px-24 xl:px-32">
        <a href="#" aria-label="FreshResume home">
          <BrandLogo />
        </a>

        <div className="hidden items-center gap-8 transition duration-500 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-slate-500"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="relative hidden md:block" ref={dropdownRef}>
          <button
            type="button"
            onClick={handlePrimaryAction}
            aria-haspopup={session ? 'menu' : undefined}
            aria-expanded={session ? isDropdownOpen : undefined}
            className="cursor-pointer rounded-full bg-indigo-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-indigo-700 active:scale-95"
          >
            {session ? 'My account' : 'Build Resume Free'}
          </button>

          {session && isDropdownOpen && (
            <AccountMenu
              userInitial={userInitial}
              userName={session.user?.name || 'User'}
              onClose={() => setIsDropdownOpen(false)}
            />
          )}
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => {
            setIsMobileMenuOpen(true);
            setIsMobileAccountOpen(false);
          }}
          className="cursor-pointer transition active:scale-90 md:hidden"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={handleCloseMobileMenu}
          className={`absolute inset-0 bg-slate-950/32 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          className={`absolute inset-y-0 left-0 flex w-[88vw] max-w-[22rem] flex-col border-r border-slate-200 bg-white text-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.18)] transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <a
              href="#"
              aria-label="FreshResume home"
              onClick={handleCloseMobileMenu}
            >
              <BrandLogo />
            </a>

            <button
              type="button"
              aria-label="Close menu"
              onClick={handleCloseMobileMenu}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="mb-6">
                <p className="px-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
                  Navigation
                </p>

                <div className="mt-3 space-y-1.5">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={handleCloseMobileMenu}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <span>{link.label}</span>
                      <FiChevronRight className="h-4 w-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-5 shadow-[0_-10px_24px_rgba(15,23,42,0.04)]">
              {!session ? (
                <div>
                  <p className="px-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
                    Account
                  </p>

                  <div className="mt-4 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleCloseMobileMenu();
                        onLoginClick();
                      }}
                      className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                      Build Resume Free
                    </button>

                    <p className="px-2 text-sm leading-6 text-slate-500">
                      Sign in to create resumes, manage your account, and unlock
                      premium features.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-center justify-between px-2">
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
                      My Account
                    </p>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                      Free Plan
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                      <span className="flex items-center gap-2">
                        <FaCrown className="text-sm text-indigo-100" />
                        Upgrade to Pro
                      </span>
                      <FiChevronRight className="h-4 w-4 text-indigo-100" />
                    </button>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <button
                        type="button"
                        onClick={() =>
                          setIsMobileAccountOpen((isOpen) => !isOpen)
                        }
                        aria-expanded={isMobileAccountOpen}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-base font-semibold uppercase text-indigo-600">
                          {userInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {session.user?.name || 'User'}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {userSecondaryText}
                          </p>
                        </div>
                        <FiChevronDown
                          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                            isMobileAccountOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ${
                          isMobileAccountOpen
                            ? 'grid-rows-[1fr]'
                            : 'grid-rows-[0fr]'
                        }`}
                      >
                        <div className="overflow-hidden border-t border-slate-200 bg-white">
                          <div className="px-4 py-3">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-medium text-slate-700">
                                Resume credits
                              </span>
                              <span className="text-xs text-slate-400">
                                8/10 left
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full w-[80%] rounded-full bg-indigo-600" />
                            </div>
                          </div>

                          <div className="border-t border-slate-100">
                            <AccountMenuItems
                              onClose={() => {
                                setIsDropdownOpen(false);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
