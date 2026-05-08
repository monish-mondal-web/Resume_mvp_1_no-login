export type PlanId = 'basic' | 'pro' | 'premium';
export type BillingCycle = 'monthly' | 'yearly';

export interface FeatureItem {
  label: string;
  hint: string;
  unlimited?: boolean;
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyTotal: number;
  yearlySaving: number;
  credits: number;
  creditHint: string;
  subtitle: string;
  badge?: string;
  badgeVariant?: 'popular' | 'value';
  highlight: boolean;
  ctaLabel: string;
}
