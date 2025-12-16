"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface CreateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InterviewFormData {
  // Step 1: Interview source
  interviewSource: "existing" | "new";
  selectedJobId?: string;

  // Step 2: New job details (if creating new job)
  jobTitle: string;
  domain: string;
  jobLevel: string;
  userType: string;
  minExperience: string;
  maxExperience: string;
  description: string;
  noOfOpenings: string;
  skills: string[];

  // Step 3: Round details
  roundName: string;
  roundType: string;
  objective: string;
  duration: string;
  language: string;
  interviewer: string;
  interviewerId?: string;
  roundSkills: string[];

  // Step 4: Questions type
  questionsType: "ai" | "hybrid";
  aiGeneratedQuestions: number;
  customQuestionsCount: number;

  // Step 5: Custom questions (if hybrid)
  customQuestions: string[];

  // Step 6: Instructions & settings
  instructions: string;
  enableRecording: boolean;
  enableTranscription: boolean;
  enableFeedback: boolean;
}

const domainOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

const jobLevelOptions = [
  { value: "intern", label: "Intern" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

const userTypeOptions = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const roundTypeOptions = [
  { value: "technical", label: "Technical" },
  { value: "behavioral", label: "Behavioral" },
  { value: "cultural", label: "Cultural Fit" },
  { value: "case-study", label: "Case Study" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const interviewerOptions = [
  { value: "ai", label: "AI Interviewer" },
  { value: "human", label: "Human Interviewer" },
];

const durationOptions = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
];

const mockInterviewers = [
  { id: "1", name: "Product Manager", image: "/interviewer-male.jpg" },
  { id: "2", name: "HR Manager", image: "/interviewer-female.jpg" },
  { id: "3", name: "UX Designer", image: "/interviewer-male.jpg" },
  { id: "4", name: "Sales", image: "/interviewer-female.jpg" },
  { id: "5", name: "Marketing", image: "/interviewer-male.jpg" },
  { id: "6", name: "Software Engineer", image: "/interviewer-female.jpg" },
];

// Mock existing jobs
const existingJobs = [
  { id: "1", title: "Senior Frontend Developer", domain: "Engineering" },
  { id: "2", title: "Product Designer", domain: "Design" },
  { id: "3", title: "Backend Engineer", domain: "Engineering" },
];

export function CreateInterviewDialog({
  open,
  onOpenChange,
}: CreateInterviewDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<InterviewFormData>({
    interviewSource: "existing",
    jobTitle: "",
    domain: "",
    jobLevel: "",
    userType: "",
    minExperience: "",
    maxExperience: "",
    description: "",
    noOfOpenings: "",
    skills: [],
    roundName: "",
    roundType: "",
    objective: "",
    duration: "",
    language: "",
    interviewer: "",
    interviewerId: "",
    roundSkills: [],
    questionsType: "ai",
    aiGeneratedQuestions: 5,
    customQuestionsCount: 0,
    customQuestions: [],
    instructions: "",
    enableRecording: true,
    enableTranscription: true,
    enableFeedback: true,
  });

  const [newSkill, setNewSkill] = useState("");
  const [newRoundSkill, setNewRoundSkill] = useState("");
  const [newQuestion, setNewQuestion] = useState("");

  const handleNext = () => {
    // Determine next step based on current step and form data
    let nextStep = step + 1;

    // Skip step 2 if using existing job
    if (step === 1 && formData.interviewSource === "existing") {
      nextStep = 3; // Skip to round details
    }

    // Skip step 5 if AI generated
    if (step === 4 && formData.questionsType === "ai") {
      nextStep = 5; // Skip to instructions
    }

    if (nextStep > 5) {
      // Submit form
      console.log("Form submitted:", formData);
      onOpenChange(false);
      resetForm();
    } else {
      setStep(nextStep);
    }
  };

  const handleBack = () => {
    if (step <= 1) return;

    let prevStep = step - 1;

    // If going back from step 6 and questions type is AI, skip step 5
    if (step === 6 && formData.questionsType === "ai") {
      prevStep = 4;
    }

    // If going back from step 3 and using existing job, skip step 2
    if (step === 3 && formData.interviewSource === "existing") {
      prevStep = 1;
    }

    setStep(prevStep);
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      interviewSource: "existing",
      jobTitle: "",
      domain: "",
      jobLevel: "",
      userType: "",
      minExperience: "",
      maxExperience: "",
      description: "",
      noOfOpenings: "",
      skills: [],
      roundName: "",
      roundType: "",
      objective: "",
      duration: "",
      language: "",
      interviewer: "",
      interviewerId: "",
      roundSkills: [],
      questionsType: "ai",
      aiGeneratedQuestions: 5,
      customQuestionsCount: 0,
      customQuestions: [],
      instructions: "",
      enableRecording: true,
      enableTranscription: true,
      enableFeedback: true,
    });
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      resetForm();
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const addRoundSkill = () => {
    if (
      newRoundSkill.trim() &&
      !formData.roundSkills.includes(newRoundSkill.trim())
    ) {
      setFormData({
        ...formData,
        roundSkills: [...formData.roundSkills, newRoundSkill.trim()],
      });
      setNewRoundSkill("");
    }
  };

  const removeRoundSkill = (skill: string) => {
    setFormData({
      ...formData,
      roundSkills: formData.roundSkills.filter((s) => s !== skill),
    });
  };

  const updateCustomQuestion = (index: number, value: string) => {
    const newQuestions = [...formData.customQuestions];
    newQuestions[index] = value;
    setFormData((prev) => ({
      ...prev,
      customQuestions: newQuestions,
    }));
  };

  // Step 1: Interview source selection
  const renderStep1 = () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-[#0a0a0a] leading-none">
        Choose how you want to set up this interview
      </p>
      <div className="flex flex-col gap-[10px]">
        <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
          Interview source <span className="text-[#b91c1c]">*</span>
        </Label>
        <RadioGroup
          value={formData.interviewSource}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              interviewSource: value as "existing" | "new",
            })
          }
          className="flex gap-3"
        >
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                interviewSource: "existing",
              })
            }
            className={`flex flex-1 gap-3 items-start p-3 rounded-[6px] border border-solid transition-colors ${
              formData.interviewSource === "existing"
                ? "bg-[#f0f5f2] border-[#02563d]"
                : "bg-transparent border-[#e5e5e5]"
            }`}
          >
            <RadioGroupItem value="existing" id="existing" className="mt-0.5" />
            <div className="flex flex-col gap-1.5 items-start flex-1">
              <Label
                htmlFor="existing"
                className="text-sm font-medium text-[#0a0a0a] leading-none cursor-pointer"
              >
                Use Existing Job
              </Label>
              <p className="text-sm font-normal text-[#737373] leading-5">
                Create interview for an existing job profile
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                interviewSource: "new",
              })
            }
            className={`flex flex-1 gap-3 items-start p-3 rounded-[6px] border border-solid transition-colors ${
              formData.interviewSource === "new"
                ? "bg-[#f0f5f2] border-[#02563d]"
                : "bg-transparent border-[#e5e5e5]"
            }`}
          >
            <RadioGroupItem value="new" id="new" className="mt-0.5" />
            <div className="flex flex-col gap-1.5 items-start flex-1">
              <Label
                htmlFor="new"
                className="text-sm font-medium text-[#0a0a0a] leading-none cursor-pointer"
              >
                Create New Job
              </Label>
              <p className="text-sm font-normal text-[#737373] leading-5">
                Create a new job profile for an interview
              </p>
            </div>
          </button>
        </RadioGroup>
      </div>
    </div>
  );

  // Step 2: Create new job form
  const renderStep2 = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-[#0a0a0a] leading-none">
        Basic job details
      </h3>

      {/* Parse job documentation */}
      <div className="flex flex-col gap-2">
        <Label className="font-semibold text-sm text-[#000000]">
          Parse job documentation
        </Label>
        <div className="border border-dashed border-[#d1d1d1] rounded bg-transparent h-[114px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <p className="text-sm text-[#02563d] leading-5 w-[188px]">
              Drag and drop files here or click to upload
            </p>
            <p className="text-xs text-[#747474] leading-none">
              Max file size is 500kb. Supported file types are .jpg and .png.
            </p>
          </div>
        </div>
      </div>

      {/* Or divider */}
      <div className="flex items-center justify-center gap-2.5 w-full">
        <div className="flex-1 h-px bg-[#e5e5e5]" />
        <span className="text-sm text-[#737373] leading-none">or</span>
        <div className="flex-1 h-px bg-[#e5e5e5]" />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
          Job title <span className="text-[#b91c1c]">*</span>
        </Label>
        <Input
          value={formData.jobTitle}
          onChange={(e) =>
            setFormData({ ...formData, jobTitle: e.target.value })
          }
          placeholder="e.g. senior product manager"
          className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Domain <span className="text-[#b91c1c]">*</span>
          </Label>
          <Select
            value={formData.domain}
            onValueChange={(value) =>
              setFormData({ ...formData, domain: value })
            }
          >
            <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {domainOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Job level <span className="text-[#b91c1c]">*</span>
          </Label>
          <Select
            value={formData.jobLevel}
            onValueChange={(value) =>
              setFormData({ ...formData, jobLevel: value })
            }
          >
            <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {jobLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            User type <span className="text-[#b91c1c]">*</span>
          </Label>
          <Select
            value={formData.userType}
            onValueChange={(value) =>
              setFormData({ ...formData, userType: value })
            }
          >
            <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {userTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Min experience <span className="text-[#b91c1c]">*</span>
          </Label>
          <Input
            type="number"
            value={formData.minExperience}
            onChange={(e) =>
              setFormData({ ...formData, minExperience: e.target.value })
            }
            placeholder="Enter years"
            className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Max experience <span className="text-[#b91c1c]">*</span>
          </Label>
          <Input
            type="number"
            value={formData.maxExperience}
            onChange={(e) =>
              setFormData({ ...formData, maxExperience: e.target.value })
            }
            placeholder="Enter years"
            className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            No. of openings <span className="text-[#b91c1c]">*</span>
          </Label>
          <Input
            type="number"
            value={formData.noOfOpenings}
            onChange={(e) =>
              setFormData({ ...formData, noOfOpenings: e.target.value })
            }
            placeholder="Enter number"
            className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
          Job description <span className="text-[#b91c1c]">*</span>
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter job description"
          className="min-h-[100px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
          Skills <span className="text-[#b91c1c]">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add skill"
            className="h-9 flex-1 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
          />
          <Button
            type="button"
            onClick={addSkill}
            className="h-9 px-4 bg-[#02563d] hover:bg-[#02563d]/90"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Step 3: Round details
  const renderStep3 = () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-[#0a0a0a] leading-none">
        Round details
      </p>

      <div className="flex flex-col gap-4">
        {/* Round name and Round type side by side */}
        <div className="flex gap-[10px]">
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Round name <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Input
              value={formData.roundName}
              onChange={(e) =>
                setFormData({ ...formData, roundName: e.target.value })
              }
              placeholder="Behavioural round"
              className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Round type <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Select
              value={formData.roundType}
              onValueChange={(value) =>
                setFormData({ ...formData, roundType: value })
              }
            >
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {roundTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Round Objective */}
        <div className="flex flex-col gap-2 relative">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Round Objective <span className="text-[#b91c1c]">*</span>
          </Label>
          <div className="relative">
            <Textarea
              value={formData.objective}
              onChange={(e) =>
                setFormData({ ...formData, objective: e.target.value })
              }
              placeholder="Describe what you want to assess in this round..."
              className="min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] pr-24"
            />
            <button
              type="button"
              className="absolute right-0 top-0 text-sm text-[#02563d] underline leading-none"
            >
              Generate from AI
            </button>
          </div>
          <p className="text-xs text-[#737373] leading-none">
            This helps AI generate relevant questions
          </p>
        </div>

        {/* Duration and Language side by side */}
        <div className="flex gap-[10px]">
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Duration <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Select
              value={formData.duration}
              onValueChange={(value) =>
                setFormData({ ...formData, duration: value })
              }
            >
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Language <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Select
              value={formData.language}
              onValueChange={(value) =>
                setFormData({ ...formData, language: value })
              }
            >
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
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

        {/* Select Interviewer */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Select Interviewer
          </Label>
          <div className="flex gap-2 items-center">
            {/* Add new card */}
            <button
              type="button"
              className="border border-dashed border-[#d1d1d1] rounded p-1 flex flex-col items-center gap-1 w-[70px] h-[98px]"
            >
              <div className="flex flex-col gap-1 h-[90px] items-center">
                <div className="bg-[#e5e5e5] rounded w-[62px] h-[62px] relative">
                  <Plus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-black" />
                </div>
                <p className="text-xs text-[#737373] leading-none text-center w-[62px]">
                  + Add new
                </p>
              </div>
            </button>
            {/* Interviewer cards */}
            {mockInterviewers.map((interviewer) => (
              <button
                key={interviewer.id}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    interviewerId: interviewer.id,
                  })
                }
                className={`border rounded p-1 flex flex-col items-center gap-1 w-[70px] h-[98px] transition-all ${
                  formData.interviewerId === interviewer.id
                    ? "border-[#02563d] bg-[#f0f5f2] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
                    : "border-[#d1d1d1]"
                }`}
              >
                <div className="flex flex-col gap-1 h-[90px] items-center">
                  <div className="relative rounded w-[62px] h-[62px] overflow-hidden">
                    <img
                      src={interviewer.image}
                      alt={interviewer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-[#737373] leading-none text-center w-[62px]">
                    {interviewer.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Skills for round */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Skills for round <span className="text-[#b91c1c]">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-1 px-3 py-1 min-h-[36px] border border-[#e5e5e5] rounded-md shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] bg-white">
              <div className="flex flex-wrap gap-1 flex-1 items-center">
                {formData.roundSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="gap-1 bg-[#e5e5e5] text-black text-xs px-2 py-0 rounded-full h-[18px]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeRoundSkill(skill)}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  value={newRoundSkill}
                  onChange={(e) => setNewRoundSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRoundSkill();
                    }
                  }}
                  placeholder={
                    formData.roundSkills.length === 0 ? "Add skill" : ""
                  }
                  className="flex-1 min-w-[100px] text-sm text-[#737373] bg-transparent border-0 outline-0"
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={addRoundSkill}
              className="h-9 px-4 bg-[#02563d] hover:bg-[#02563d]/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Questions type
  const renderStep4 = () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-[#0a0a0a] leading-none">Questions</p>
      <div className="flex flex-col gap-5">
        {/* Questions type */}
        <div className="flex flex-col gap-[10px]">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
            Questions type
          </Label>
          <RadioGroup
            value={formData.questionsType}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                questionsType: value as "ai" | "hybrid",
                // Reset custom questions when switching away from hybrid/custom
                customQuestionsCount:
                  value === "hybrid" || value === "custom"
                    ? prev.customQuestionsCount
                    : 0,
                customQuestions:
                  value === "hybrid" || value === "custom"
                    ? prev.customQuestions
                    : [],
              }))
            }
            className="flex gap-3"
          >
            {/* AI generated questions */}
            <label
              className={`flex-1 flex gap-3 p-3 rounded border cursor-pointer transition-all ${
                formData.questionsType === "ai"
                  ? "bg-[#f0f5f2] border-[#02563d]"
                  : "border-[#e5e5e5]"
              }`}
            >
              <RadioGroupItem value="ai" id="ai" className="h-4 w-4 mt-0.5" />
              <div className="flex-1 flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                  AI generated questions
                </p>
                <p className="text-sm font-normal text-[#737373] leading-5">
                  AI will generate relevant questions based on the job User and
                  interview goal.
                </p>
              </div>
            </label>

            {/* Hybrid mode */}
            <label
              className={`flex-1 flex gap-3 p-3 rounded border cursor-pointer transition-all ${
                formData.questionsType === "hybrid"
                  ? "bg-[#f0f5f2] border-[#02563d]"
                  : "border-[#e5e5e5]"
              }`}
            >
              <RadioGroupItem
                value="hybrid"
                id="hybrid"
                className="h-4 w-4 mt-0.5"
              />
              <div className="flex-1 flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                  Hybrid mode
                </p>
                <p className="text-sm font-normal text-[#737373] leading-5">
                  Combine your custom questions with AI-generated ones.
                </p>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* AI Generated Questions - AI mode only */}
        {formData.questionsType === "ai" && (
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
              No. of AI generated questions{" "}
              <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Select
              value={formData.aiGeneratedQuestions.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  aiGeneratedQuestions: parseInt(value),
                }))
              }
            >
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[3, 5, 7, 10, 15].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Hybrid mode - AI and Custom questions side by side */}
        {formData.questionsType === "hybrid" && (
          <div className="flex flex-col gap-5">
            {/* No. of AI and Custom questions side by side */}
            <div className="flex gap-5">
              <div className="flex-1 flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                  No. of AI generated questions{" "}
                  <span className="text-[#0a0a0a]">*</span>
                </Label>
                <Select
                  value={formData.aiGeneratedQuestions.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      aiGeneratedQuestions: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 5, 7, 10, 15].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                  No. of custom question{" "}
                  <span className="text-[#0a0a0a]">*</span>
                </Label>
                <Select
                  value={formData.customQuestionsCount.toString()}
                  onValueChange={(value) => {
                    const num = parseInt(value);
                    setFormData((prev) => {
                      const currentCount = prev.customQuestions.length;
                      const newQuestions = [...prev.customQuestions];
                      if (num > currentCount) {
                        // Add empty questions
                        for (let i = currentCount; i < num; i++) {
                          newQuestions.push("");
                        }
                      } else if (num < currentCount) {
                        // Remove questions
                        newQuestions.splice(num);
                      }
                      return {
                        ...prev,
                        customQuestionsCount: num,
                        customQuestions: newQuestions,
                      };
                    });
                  }}
                >
                  <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom question inputs */}
            {formData.customQuestions.map((question, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                  Question {index + 1}.{" "}
                  <span className="text-[#0a0a0a]">*</span>
                </Label>
                <Input
                  value={question}
                  onChange={(e) => updateCustomQuestion(index, e.target.value)}
                  placeholder="Write your question here"
                  className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Step 6: Instructions & settings
  const renderStep5 = () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-[#0a0a0a] leading-none">
        Instructions & settings
      </p>
      <div className="flex flex-col gap-5">
        {/* Interview instructions */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
            Interview instructions <span className="text-[#b91c1c]">*</span>
          </Label>
          <Textarea
            value={formData.instructions}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                instructions: e.target.value,
              }))
            }
            placeholder="Write interview instructions here"
            className="min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
          />
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-[10px]">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
            Settings
          </Label>
          <div className="flex flex-col gap-3">
            {/* Allow skip */}
            <div className="border border-[#e5e5e5] rounded p-3">
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 flex flex-col gap-2 pr-3">
                  <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                    Allow skip <span className="text-[#b91c1c]">*</span>
                  </p>
                  <p className="text-sm font-normal text-[#737373] leading-5">
                    Applicants must complete this question.
                  </p>
                </div>
                <Switch
                  checked={formData.allowSkip}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      allowSkip: checked,
                    }))
                  }
                />
              </div>
            </div>

            {/* Send reminder */}
            <div className="border border-[#e5e5e5] rounded p-3 flex flex-col gap-5">
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 flex flex-col gap-2 pr-3">
                  <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                    Send reminder
                  </p>
                  <p className="text-sm font-normal text-[#737373] leading-5">
                    Email reminder before scheduled interview
                  </p>
                </div>
                <Switch
                  checked={formData.sendReminder}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      sendReminder: checked,
                    }))
                  }
                />
              </div>
              {formData.sendReminder && (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                    Set reminder time
                  </Label>
                  <Select
                    value={formData.reminderTime}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        reminderTime: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reminderTimeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Create interview";
      case 2:
        return "Create new job opening";
      case 3:
        return "Create new round";
      case 4:
        return "Create new round";
      case 5:
        return "Create new round";
      case 6:
        return "Create new round";
      default:
        return "Create interview";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "";
      case 2:
        return "Add job details";
      case 3:
        return "Add round details";
      case 4:
        return "Select questions type";
      case 5:
        return "Add custom questions";
      case 6:
        return "Add instructions and settings";
      default:
        return "";
    }
  };

  const canProceed = () => {
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[779px] sm:max-w-[779px] sm:w-[779px] p-6 gap-4 max-h-[90vh] overflow-y-auto bg-white border border-[#e5e5e5] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-2px_rgba(0,0,0,0.1)] [&>button]:top-[15px] [&>button]:right-[15px]">
        <DialogHeader className="gap-1.5 text-left pb-0">
          <DialogTitle className="text-lg font-semibold text-[#0a0a0a] leading-none">
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#737373] leading-5">
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          {step === 1 && renderStep1()}
          {step === 2 && formData.interviewSource === "new" && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

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
            disabled={!canProceed()}
            className="h-9 px-4 bg-[#02563d] hover:bg-[#02563d]/90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] disabled:opacity-50"
          >
            {step === 5 ? "Create" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
