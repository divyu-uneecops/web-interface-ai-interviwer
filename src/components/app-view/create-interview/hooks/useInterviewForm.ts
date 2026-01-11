import { useState, useCallback } from "react";
import type { InterviewFormData } from "../types";
import { createInitialFormData } from "../utils";

export const useInterviewForm = () => {
  const [formData, setFormData] = useState<InterviewFormData>(
    createInitialFormData()
  );

  const updateFormData = useCallback((updates: Partial<InterviewFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
  }, []);

  const updateField = useCallback(
    <K extends keyof InterviewFormData>(
      field: K,
      value: InterviewFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    formData,
    setFormData,
    updateFormData,
    updateField,
    resetForm,
  };
};
