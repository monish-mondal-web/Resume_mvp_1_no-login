import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardClient } from '@/components/features/dashboard/DashboardClient';

export const metadata = {
  title: 'Dashboard — FreshResume',
  description: 'Manage your resumes and track your progress.',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/');

  return (
    <DashboardClient
      userName={session.user.name ?? ''}
      userEmail={session.user.email ?? undefined}
    />
  );
}
