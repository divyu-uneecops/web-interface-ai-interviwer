import { JobStat } from "../interfaces/job.interface";

export const experienceOptions = [
  { value: "0", label: "0 year" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "4", label: "4 years" },
  { value: "5", label: "5 years" },
  { value: "6", label: "6 years" },
  { value: "7", label: "7 years" },
  { value: "8", label: "8+ years" },
];

export const openingsOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "10", label: "10" },
];

export const statusStyles = {
  active: "bg-[#def2eb] text-[#0e4230] border-transparent",
  draft: "bg-[#e5e5e5] text-[#000000] border-transparent",
  closed: "bg-[#fcefec] text-[#d92d20] border-transparent",
};

export const stats: JobStat[] = [
  { label: "Total Applicants", value: 143, icon: "applicants" },
  { label: "In screening", value: 90, icon: "completed" },
  { label: "Final round", value: 7, icon: "hired" },
  { label: "Hired", value: 82.2, icon: "score" },
];
