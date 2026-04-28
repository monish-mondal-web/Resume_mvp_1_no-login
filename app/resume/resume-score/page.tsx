import { Metadata } from 'next';
import { ResumeScoreClient } from '@/components/features/resume-score/ResumeScoreClient';

export const metadata: Metadata = {
  title: 'ATS Score — FreshResume',
  description: 'See how well your resume performs with Applicant Tracking Systems.',
};

export default function ResumeScorePage() {
  return <ResumeScoreClient />;
}
