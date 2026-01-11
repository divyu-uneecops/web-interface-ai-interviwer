"use client";

import { useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CreateInterviewDialogProps } from "./types";
import { useInterviewForm } from "./hooks/useInterviewForm";
import { useStepNavigation } from "./hooks/useStepNavigation";
import { validateStep, getStepTitle, getStepDescription } from "./utils";
import { Step1InterviewSource } from "./components/Step1InterviewSource";
import { Step2JobSelection } from "./components/Step2JobSelection";
import { Step3RoundDetails } from "./components/Step3RoundDetails";
import { Step3ExistingJobRoundDetails } from "./components/Step3ExistingJobRoundDetails";
import { Step4Questions } from "./components/Step4Questions";
import { Step5Instructions } from "./components/Step5Instructions";
import { ShareInterviewLinkModal } from "./components/ShareInterviewLinkModal";
import { TOTAL_STEPS } from "./constants";

export function CreateInterviewDialog({
  open,
  onOpenChange,
}: CreateInterviewDialogProps) {
  const { formData, updateField, resetForm } = useInterviewForm();
  const {
    step,
    nextStep,
    previousStep,
    reset: resetStep,
  } = useStepNavigation(formData.interviewSource);

  const handleNext = useCallback(() => {
    const next = step + 1;
    if (next > TOTAL_STEPS) {
      // Submit form - in production, this would call an API
      console.log("Form submitted:", formData);
      onOpenChange(false);
      resetForm();
      resetStep();
    } else {
      nextStep();
    }
  }, [step, formData, onOpenChange, resetForm, resetStep, nextStep]);

  const handleBack = useCallback(() => {
    if (step <= 1) return;
    previousStep();
  }, [step, previousStep]);

  const handleClose = useCallback(
    (isOpen: boolean) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        resetForm();
        resetStep();
      }
    },
    [onOpenChange, resetForm, resetStep]
  );

  const canProceed = validateStep(step, formData);

  // Use interview link from formData if available
  const interviewLink = useMemo(() => {
    return formData.interviewLink || "";
  }, [formData.interviewLink]);

  // Determine if we should show the share modal (step 4 for existing jobs)
  const isShareModalStep = useMemo(
    () => step === 4 && formData.interviewSource === "existing",
    [step, formData.interviewSource]
  );

  // Hide footer on step 3 for existing jobs (shows success screen)
  const shouldHideFooter = useMemo(
    () => step === 3 && formData.interviewSource === "existing",
    [step, formData.interviewSource]
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1InterviewSource
            formData={formData}
            onSourceChange={(source) => updateField("interviewSource", source)}
          />
        );
      case 2:
        return (
          <Step2JobSelection formData={formData} onFieldChange={updateField} />
        );
      case 3:
        return formData.interviewSource === "existing" ? (
          <Step3ExistingJobRoundDetails
            formData={formData}
            onFieldChange={updateField}
          />
        ) : (
          <Step3RoundDetails formData={formData} onFieldChange={updateField} />
        );
      case 4:
        return formData.interviewSource === "existing" ? null : (
          <Step4Questions formData={formData} onFieldChange={updateField} />
        );
      case 5:
        return (
          <Step5Instructions formData={formData} onFieldChange={updateField} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open && !isShareModalStep} onOpenChange={handleClose}>
        <DialogContent className="max-w-[779px] sm:max-w-[779px] sm:w-[779px] p-6 gap-4 max-h-[90vh] overflow-y-auto bg-white border border-[#e5e5e5] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-2px_rgba(0,0,0,0.1)] [&>button]:top-[15px] [&>button]:right-[15px]">
          <DialogHeader className="gap-1.5 text-left pb-0">
            <DialogTitle className="text-lg font-semibold text-[#0a0a0a] leading-none">
              {getStepTitle(step, formData.interviewSource)}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#737373] leading-5">
              {getStepDescription(step, formData.interviewSource)}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col">{renderStepContent()}</div>

          {!shouldHideFooter && (
            <DialogFooter className="gap-2 justify-end">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="h-9 px-4"
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                variant="default"
                onClick={handleNext}
                disabled={!canProceed}
                className="h-9 px-4 bg-[#02563d] hover:bg-[#02563d]/90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={
                  step === TOTAL_STEPS ? "Create interview" : "Go to next step"
                }
              >
                {step === TOTAL_STEPS ? "Create" : "Next"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
