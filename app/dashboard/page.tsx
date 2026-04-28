import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Navbar } from '@/components/features/home/Navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Dashboard — FreshResume',
  description: 'Manage your resumes and account.',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  if (!session.user.isProfileCompleted) {
    redirect('/resume/builder');
  }

  return (
    <section className="flex min-h-screen w-full flex-col bg-white pt-[56px]">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8 md:px-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Breadcrumb items={[{ label: 'Dashboard' }]} />
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              My Resumes
            </h1>
          </div>

          <button className="h-11 cursor-pointer rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-[0_10px_20px_rgba(79,70,229,0.15)] transition hover:bg-indigo-700 active:scale-95">
            Create New Resume
          </button>
        </header>

        {/* Empty state or dashboard content */}
        <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            No resumes yet
          </h3>
          <p className="mt-1 max-w-sm text-slate-500">
            Start by creating your first professional resume with our AI-guided
            builder.
          </p>
        </div>
      </main>
    </section>
  );
}
