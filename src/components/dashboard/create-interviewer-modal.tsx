"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateInterviewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: InterviewerFormData) => void;
}

export interface InterviewerFormData {
  name: string;
  voice: string;
  about: string;
  skills: string;
  roundType: string;
  language: string;
  personality: {
    empathy: number;
    rapport: number;
    exploration: number;
    speed: number;
  };
}

const voiceOptions = [
  { value: "maya", label: "Maya" },
  { value: "alex", label: "Alex" },
  { value: "sam", label: "Sam" },
  { value: "jordan", label: "Jordan" },
];

const roundTypeOptions = [
  { value: "behavioural", label: "Behavioural" },
  { value: "technical", label: "Technical" },
  { value: "cultural", label: "Cultural Fit" },
  { value: "hr", label: "HR Round" },
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "hindi", label: "Hindi" },
];

export function CreateInterviewerModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateInterviewerModalProps) {
  const [formData, setFormData] = React.useState<InterviewerFormData>({
    name: "",
    voice: "",
    about: "",
    skills: "",
    roundType: "behavioural",
    language: "",
    personality: {
      empathy: 100,
      rapport: 100,
      exploration: 100,
      speed: 100,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onOpenChange(false);
  };

  const updatePersonality = (
    trait: keyof InterviewerFormData["personality"],
    value: number[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      personality: {
        ...prev.personality,
        [trait]: value[0],
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[779px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create interviewer</DialogTitle>
          <DialogDescription>Add new AI interviewer</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0a0a0a]">
              Basic information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Interviewer Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Interviewer name <span className="text-neutral-950">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Maya"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e?.target?.value }))
                  }
                  className="shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                />
              </div>

              {/* Voice */}
              <div className="space-y-2">
                <Label htmlFor="voice">
                  Voice <span className="text-neutral-950">*</span>
                </Label>
                <Select
                  value={formData?.voice}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, voice: value }))
                  }
                >
                  <SelectTrigger className="w-full shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceOptions?.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* About Interviewer */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="about">About interviewer</Label>
                <button
                  type="button"
                  className="text-sm text-[#02563d] underline hover:text-[#02563d]/80"
                >
                  Generate from AI
                </button>
              </div>
              <Textarea
                id="about"
                placeholder="Write about interviewer...."
                value={formData.about}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, about: e?.target?.value }))
                }
                className="min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
              />
            </div>

            {/* Interviewer Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">
                Interviewer skills <span className="text-neutral-950">*</span>
              </Label>
              <Input
                id="skills"
                placeholder="Add skills"
                value={formData.skills}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, skills: e?.target?.value }))
                }
                className="shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
              />
            </div>

            {/* Round Type and Language */}
            <div className="grid grid-cols-2 gap-4">
              {/* Round Type */}
              <div className="space-y-2">
                <Label htmlFor="roundType">
                  Round type <span className="text-neutral-950">*</span>
                </Label>
                <Select
                  value={formData.roundType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, roundType: value }))
                  }
                  disabled
                >
                  <SelectTrigger className="w-full shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] opacity-50">
                    <SelectValue placeholder="Behavioural" />
                  </SelectTrigger>
                  <SelectContent>
                    {roundTypeOptions.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger className="w-full shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Personality Traits Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0a0a0a]">
              Personality traits
            </h3>

            <div className="space-y-6">
              {/* Empathy */}
              <div className="flex items-center gap-4">
                <div className="w-20 shrink-0">
                  <Label className="text-sm font-medium">Empathy</Label>
                </div>
                <Slider
                  value={[formData.personality.empathy]}
                  onValueChange={(value) => updatePersonality("empathy", value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>

              {/* Rapport */}
              <div className="flex items-center gap-4">
                <div className="w-20 shrink-0">
                  <Label className="text-sm font-medium">Rapport</Label>
                </div>
                <Slider
                  value={[formData.personality.rapport]}
                  onValueChange={(value) => updatePersonality("rapport", value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>

              {/* Exploration */}
              <div className="flex items-center gap-4">
                <div className="w-20 shrink-0">
                  <Label className="text-sm font-medium">Exploration</Label>
                </div>
                <Slider
                  value={[formData.personality.exploration]}
                  onValueChange={(value) =>
                    updatePersonality("exploration", value)
                  }
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>

              {/* Speed */}
              <div className="flex items-center gap-4">
                <div className="w-20 shrink-0">
                  <Label className="text-sm font-medium">Speed</Label>
                </div>
                <Slider
                  value={[formData.personality.speed]}
                  onValueChange={(value) => updatePersonality("speed", value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Create interviewer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
