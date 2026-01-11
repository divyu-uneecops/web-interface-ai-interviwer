import { JobStat } from "../interfaces/job.interface";

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
