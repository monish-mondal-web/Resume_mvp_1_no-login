import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { OnboardingFormValues } from './types';

export const STORAGE_KEY = 'fresh-resume-onboarding-draft';

const getInitialValue = <T>(key: string, def: T): T => {
  if (typeof window === 'undefined') return def;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return def;
  try {
    const parsed = JSON.parse(saved);
    return parsed[key] !== undefined ? parsed[key] : def;
  } catch {
    return def;
  }
};

export function useOnboarding(session: any) {
  const [activeStep, setActiveStep] = useState(() => getInitialValue('activeStep', 'personal'));
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(() => {
    const arr = getInitialValue<string[]>('visitedSteps', ['personal']);
    return new Set(arr);
  });
  const [selectedMoreIds, setSelectedMoreIds] = useState<string[]>(() => getInitialValue('selectedMoreIds', []));
  const [stepOrder, setStepOrder] = useState<string[]>(() =>
    getInitialValue('stepOrder', ['personal', 'experience', 'education', 'skills'])
  );

  const methods = useForm<OnboardingFormValues>({
    mode: 'onBlur',
    defaultValues: async () => {
      // Return a structured object matching the expected schema.
      // You can pull initial values from localStorage or session here.
      if (typeof window !== 'undefined') {
         const saved = localStorage.getItem(STORAGE_KEY);
         if (saved) {
           try {
              const parsed = JSON.parse(saved);
              return {
                 personalInfo: parsed.personalInfo || {},
                 experience: parsed.experience || [],
                 education: parsed.education || []
              } as any;
           } catch {}
         }
      }
      return {
        personalInfo: {
          firstName: session?.user?.name?.split(' ')[0] || 'Rahul',
          lastName: session?.user?.name?.split(' ').slice(1).join(' ') || 'Sharma',
          professionalTitle: 'Software Engineer',
          email: session?.user?.email || 'rahul.sharma@example.com',
          phone: '+91 98765 43210',
          location: 'Bengaluru, Karnataka',
          summary: '',
          website: '',
          linkedIn: '',
          links: [],
          image: null,
        },
        experience: [],
        education: []
      };
    }
  });

  // Persist form values to localStorage whenever they change
  useEffect(() => {
    const subscription = methods.watch((value) => {
      try {
        const draft = {
          activeStep,
          visitedSteps: Array.from(visitedSteps),
          selectedMoreIds,
          stepOrder,
          ...value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, activeStep, visitedSteps, selectedMoreIds, stepOrder]);

  const handleContinue = () => {
     // Advance logic here based on step array
  };

  return {
    methods,
    activeStep,
    setActiveStep,
    visitedSteps,
    setVisitedSteps,
    selectedMoreIds,
    setSelectedMoreIds,
    stepOrder,
    setStepOrder,
    handleContinue
  };
}
