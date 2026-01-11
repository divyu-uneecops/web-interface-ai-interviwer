import { ProfileData } from "../interfaces/profile.interface";

export const mockProfileData: ProfileData = {
  stats: {
    totalInterviews: 1247,
    totalHires: 89,
    activeJobs: 18,
  },
  personalDetails: {
    firstName: "John",
    lastName: "Dow",
    email: "johndoe@gmail.com",
    phone: "+91 9876543210",
    designation: "Founder",
  },
  companyInfo: {
    organizationName: "HROne company",
    organizationWebsite: "https://hrone.cloud",
    industry: "Technology",
    organizationSize: "500 - 1000 employees",
  },
  notificationSettings: {
    interviewReminders: false,
    newCandidateApplied: false,
    interviewCompleted: false,
  },
};
