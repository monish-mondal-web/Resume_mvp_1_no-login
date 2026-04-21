import Image from 'next/image';
import { FiVideo } from 'react-icons/fi';
import { heroImage } from './home.constants';

interface HeroProps {
  onStartBuilding: () => void;
}

export function Hero({ onStartBuilding }: HeroProps) {
  return (
    <main className="mt-20 flex flex-1 flex-col items-center justify-between px-4 pb-20 max-md:gap-20 md:flex-row md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col items-center md:items-start">
        <h1 className="max-w-xl text-center text-4xl font-semibold leading-[46px] text-slate-900 md:text-left md:text-5xl md:leading-[68px]">
          AI-powered
          <br />
          resume building made simple.
        </h1>
        <p className="mt-2 max-w-lg text-center text-sm text-slate-700 md:text-left">
          Create tailored, job-ready resumes with smart suggestions, polished
          templates, and faster workflows for every application.
        </p>
        <div className="mt-8 flex items-center gap-4 text-sm">
          <button
            type="button"
            onClick={onStartBuilding}
            className="h-11 cursor-pointer rounded-md bg-indigo-600 px-7 font-medium text-white transition hover:bg-indigo-700 active:scale-95"
          >
            Get started
          </button>
          <button
            type="button"
            className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-slate-600 px-6 font-medium text-slate-600 transition hover:bg-white/10 active:scale-95"
          >
            <FiVideo className="h-5 w-5" />
            <span>Watch demo</span>
          </button>
        </div>
      </div>

      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        width={760}
        height={640}
        priority
        className="max-w-md object-contain transition-all duration-300 sm:max-w-lg lg:max-w-xl 2xl:max-w-[52rem]"
      />
    </main>
  );
}
