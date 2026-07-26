'use client';

import { useRouter } from 'next/navigation';
import { Hero } from './Hero';
import { Navbar } from './Navbar';

export function HomeClient() {
  const router = useRouter();

  const handleStartBuilding = () => {
    router.push('/resume/builder');
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white pt-[56px]">
      <Navbar />
      <Hero onStartBuilding={handleStartBuilding} />
    </section>
  );
}
