export interface ProfileStats {
  totalInterviews: number;
  totalHires: number;
  activeJobs: number;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
}

export interface CompanyInfo {
  organizationName: string;
  organizationWebsite: string;
  industry: string;
  organizationSize: string;
}

export interface NotificationSettings {
  interviewReminders: boolean;
  newCandidateApplied: boolean;
  interviewCompleted: boolean;
}

export interface ProfileData {
  stats: ProfileStats;
  personalDetails: PersonalDetails;
  companyInfo: CompanyInfo;
  notificationSettings: NotificationSettings;
}
