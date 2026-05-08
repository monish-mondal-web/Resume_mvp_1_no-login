'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Hero } from './Hero';
import { Navbar } from './Navbar';

const AuthModal = dynamic(
  () =>
    import('@/components/features/auth/AuthModal').then((mod) => mod.AuthModal),
  { loading: () => null }
);

export function HomeClient() {
  const { data: session, status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  const handleStartBuilding = () => {
    if (status === 'authenticated') {
      router.push('/dashboard');
      return;
    }
    router.push('/resume/builder');
  };

  const handleAuthModalOpen = () => {
    if (status === 'authenticated') return;
    setIsAuthModalOpen(true);
  };

  const shouldShowAuthModal =
    isAuthModalOpen && status !== 'authenticated';

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white pt-[56px]">
      <Navbar onLoginClick={handleAuthModalOpen} />
      <Hero onStartBuilding={handleStartBuilding} />

      {shouldShowAuthModal && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </section>
  );
}
