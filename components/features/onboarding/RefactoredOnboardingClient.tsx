'use client';

import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { FormProvider } from 'react-hook-form';
import { useOnboarding } from './useOnboarding';
import { OnboardingLayout } from './layout/OnboardingLayout';
import { formRegistry } from './forms';
import { BASE_STEPS, MORE_SECTION_DEFS } from './OnboardingConfig';

export function RefactoredOnboardingClient() {
  const { data: session } = useSession();
  
  // Custom hook manages RHF instance and step state
  const {
    methods,
    activeStep,
    setActiveStep,
    visitedSteps,
    setVisitedSteps,
    selectedMoreIds,
    setSelectedMoreIds,
    stepOrder,
    setStepOrder,
    handleContinue,
  } = useOnboarding(session);

  // Dynamic step configuration
  const allSteps = useMemo(() => {
    const stepMap = new Map([
      ...BASE_STEPS.map(s => [s.id, s] as const),
      ...MORE_SECTION_DEFS.map(s => [s.id, s] as const),
    ]);
    const validIds = new Set([
      ...BASE_STEPS.filter(s => s.id !== 'more').map(s => s.id),
      ...selectedMoreIds,
    ]);
    const ordered = stepOrder.filter(id => validIds.has(id));
    for (const id of validIds) if (!ordered.includes(id)) ordered.push(id);
    return [...ordered.map(id => stepMap.get(id)!).filter(Boolean), BASE_STEPS[4]];
  }, [stepOrder, selectedMoreIds]);

  const currentIndex = allSteps.findIndex(s => s.id === activeStep);
  const isLastStep = currentIndex === allSteps.length - 1;
  const ActiveForm = formRegistry[activeStep] || formRegistry['personal'];

  const handleComplete = async () => {
    const values = methods.getValues();
    // Submit `values` to the backend
  };

  return (
    <FormProvider {...methods}>
      <OnboardingLayout
        session={session}
        activeStep={activeStep}
        allSteps={allSteps}
        currentIndex={currentIndex}
        completedCount={visitedSteps.size} // Example
        totalCount={allSteps.length - 1}
        progressPct={(visitedSteps.size / (allSteps.length - 1)) * 100}
        isLastStep={isLastStep}
        isLoading={false}
        handleComplete={handleComplete}
        handleContinue={handleContinue}
        // ... layout state handlers (drawer open, etc)
      >
        {/* Dynamic form rendering based on the active step */}
        <ActiveForm />
      </OnboardingLayout>
    </FormProvider>
  );
}
