import { useState, useCallback } from "react";
import type { InterviewFormData } from "../types";
import { calculateNextStep, calculatePreviousStep } from "../utils";
import { TOTAL_STEPS } from "../constants";

export const useStepNavigation = (
  interviewSource: InterviewFormData["interviewSource"]
) => {
  const [step, setStep] = useState(1);

  const nextStep = useCallback(() => {
    setStep((current) => {
      const next = calculateNextStep(current, interviewSource);
      return next > TOTAL_STEPS ? TOTAL_STEPS : next;
    });
  }, [interviewSource]);

  const previousStep = useCallback(() => {
    setStep((current) => {
      const prev = calculatePreviousStep(current, interviewSource);
      return prev < 1 ? 1 : prev;
    });
  }, [interviewSource]);

  const goToStep = useCallback((targetStep: number) => {
    if (targetStep >= 1 && targetStep <= TOTAL_STEPS) {
      setStep(targetStep);
    }
  }, []);

  const reset = useCallback(() => {
    setStep(1);
  }, []);

  return {
    step,
    nextStep,
    previousStep,
    goToStep,
    reset,
  };
};
