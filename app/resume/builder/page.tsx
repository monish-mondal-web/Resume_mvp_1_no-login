import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RefactoredOnboardingClient } from '@/components/features/onboarding/RefactoredOnboardingClient';

export const metadata = {
  title: 'Build Your Resume — FreshResume',
  description: 'Step-by-step professional resume builder.',
};

export default async function ResumeBuilderPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.isProfileCompleted) {
    redirect('/dashboard');
  }

  return <RefactoredOnboardingClient />;
}
