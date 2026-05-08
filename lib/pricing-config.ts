import type { PricingPlan, FeatureItem } from '@/types/pricing';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 29,
    yearlyPrice: 25,
    yearlyTotal: 300,
    yearlySaving: 48,
    credits: 400,
    creditHint: '≈ 8+ resume optimizations',
    subtitle: 'Get started with essential tools',
    highlight: false,
    ctaLabel: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 99,
    yearlyPrice: 86,
    yearlyTotal: 1035,
    yearlySaving: 153,
    credits: 1000,
    creditHint: '≈ 20+ resume optimizations',
    subtitle: 'Best for applying to multiple jobs',
    badge: 'Most Popular',
    badgeVariant: 'popular',
    highlight: true,
    ctaLabel: 'Upgrade to Pro',
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 199,
    yearlyPrice: 173,
    yearlyTotal: 2075,
    yearlySaving: 313,
    credits: 3000,
    creditHint: '≈ 60+ resume optimizations',
    subtitle: 'Maximum output for serious applicants',
    badge: 'Best Value',
    badgeVariant: 'value',
    highlight: false,
    ctaLabel: 'Get Premium',
  },
];

export const PLAN_FEATURES: FeatureItem[] = [
  {
    label: 'PDF downloads',
    hint: 'Export your resume as a high-quality PDF in any template. No watermarks, no limits.',
    unlimited: true,
  },
  {
    label: 'All AI tools',
    hint: 'Full access to every AI-powered feature — job tailoring, ATS analysis, headshots, and more — all powered by credits.',
  },
  {
    label: 'Resume optimization',
    hint: 'AI rewrites and refines your resume content to match specific job descriptions, improving your chances of getting noticed.',
  },
  {
    label: 'ATS score checker',
    hint: 'Analyzes your resume against applicant tracking systems used by recruiters and gives you actionable improvement suggestions.',
  },
  {
    label: 'AI headshot generation',
    hint: 'Turn a casual selfie into a professional, studio-quality profile photo using AI — no photographer needed.',
  },
];
