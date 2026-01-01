import { Applicant, JobStat, Round } from "../interfaces/job.interface";

export const domainOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "technical", label: "Technical" },
  { value: "product", label: "Product" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
];

export const jobLevelOptions = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
];

export const userTypeOptions = [
  { value: "full-time", label: "Full time" },
  { value: "part-time", label: "Part time" },
  { value: "contract", label: "Contract" },
  { value: "intern", label: "Intern" },
];

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

export const statusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "closed", label: "Closed" },
];

export const statusStyles = {
  active: "bg-[#def2eb] text-[#0e4230] border-transparent",
  draft: "bg-[#e5e5e5] text-[#000000] border-transparent",
  closed: "bg-[#fcefec] text-[#d92d20] border-transparent",
};

export const mockJobData = {
  id: "1",
  title: "Senior Product Manager",
  status: "active" as const,
  department: "Engineering",
  type: "Full-time",
  postedDate: "Nov 15, 2025",
  description:
    "We are looking for an experienced product manager to join our team and help build amazing user experiences. We are looking for an experienced product manager to join our team and help build amazing user experiences.",
  skills: ["Collaboration", "Problem solving"],
  jobLevel: "Senior",
  userType: "Full-time",
  experience: "5-8 years",
  salaryRange: "10 LPA - 12 LPA",
};

export const stats: JobStat[] = [
  { label: "Total Applicants", value: 143, icon: "applicants" },
  { label: "In screening", value: 90, icon: "completed" },
  { label: "Final round", value: 7, icon: "hired" },
  { label: "Hired", value: 82.2, icon: "score" },
];

export const mockApplicants: Applicant[] = [
  {
    id: "1",
    name: "Mohit Kumar",
    email: "mohitkumar@gmail.com",
    contact: "+91 9876543210",
    status: "Interviewed",
    appliedDate: "2d ago",
  },
  {
    id: "2",
    name: "Mohit Kumar",
    email: "mohitkumar@gmail.com",
    contact: "+91 9876543210",
    status: "Applied",
    appliedDate: "2d ago",
  },
  {
    id: "3",
    name: "Mohit Kumar",
    email: "mohitkumar@gmail.com",
    contact: "+91 9876543210",
    status: "Rejected",
    appliedDate: "2d ago",
  },
];

export const mockRounds: Round[] = [
  {
    id: "1",
    name: "Behavioral Round",
    duration: "30 min",
    questions: 5,
    applicants: 12,
    created: "2d ago",
  },
  {
    id: "2",
    name: "Technical Screening",
    duration: "45 min",
    questions: 7,
    applicants: 8,
    created: "3d ago",
  },
  {
    id: "3",
    name: "Final round",
    duration: "60 min",
    questions: 10,
    applicants: 5,
    created: "5d ago",
  },
];
