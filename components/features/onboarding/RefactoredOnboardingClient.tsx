'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { FormProvider } from 'react-hook-form';
import { useOnboarding } from './useOnboarding';
import { OnboardingLayout } from './layout/OnboardingLayout';
import { OnboardingContextProvider } from './OnboardingContext';
import { formRegistry } from './forms';

export function RefactoredOnboardingClient() {
  const { data: session } = useSession();

  const {
    methods,
    isMounted,
    activeStep, setActiveStep,
    visitedSteps,
    selectedMoreIds,
    activeDragId,
    stepNavRef,
    isLoading,
    isAuthModalOpen, setIsAuthModalOpen,
    stepsDrawerOpen, setStepsDrawerOpen,
    showPreview, setShowPreview,
    confirmModal, setConfirmModal,
    previewTemplate, setPreviewTemplate,
    templateOptions, setTemplateOptions,
    debouncedResumeData,
    allSteps,
    isStepComplete,
    progressPct,
    currentIndex,
    currentStep,
    isLastStep,
    canUndo, canRedo, undo, redo,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleContinue,
    handleComplete,
    handleReset,
    toggleMoreSection,
    onTogglePhoto,
    isSyncing,
  } = useOnboarding();

  const ActiveForm = formRegistry[activeStep] ?? formRegistry['personal'];

  return (
    <FormProvider {...methods}>
      <OnboardingContextProvider
        value={{
          session,
          selectedMoreIds,
          toggleMoreSection,
          showPhoto: templateOptions?.showPhoto ?? true,
          onTogglePhoto,
        }}
      >
        <OnboardingLayout
          isMounted={isMounted}
          allSteps={allSteps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          currentIndex={currentIndex}
          currentStep={currentStep}
          progressPct={progressPct}
          isLastStep={isLastStep}
          isLoading={isLoading}
          stepsDrawerOpen={stepsDrawerOpen}
          setStepsDrawerOpen={setStepsDrawerOpen}
          isAuthModalOpen={isAuthModalOpen}
          setIsAuthModalOpen={setIsAuthModalOpen}
          handleReset={handleReset}
          handleComplete={handleComplete}
          handleContinue={handleContinue}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          activeDragId={activeDragId}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          sensors={sensors}
          visitedSteps={visitedSteps}
          isStepComplete={isStepComplete}
          selectedMoreIds={selectedMoreIds}
          toggleMoreSection={toggleMoreSection}
          stepNavRef={stepNavRef}
          debouncedResumeData={debouncedResumeData}
          previewTemplate={previewTemplate}
          setPreviewTemplate={setPreviewTemplate}
          templateOptions={templateOptions}
          setTemplateOptions={setTemplateOptions}
          canUndo={canUndo}
          canRedo={canRedo}
          undo={undo}
          redo={redo}
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
          isSyncing={isSyncing}
        >
          <ActiveForm />
        </OnboardingLayout>
      </OnboardingContextProvider>
    </FormProvider>
  );
}
