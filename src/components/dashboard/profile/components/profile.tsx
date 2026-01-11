"use client";

import { useState } from "react";
import { TrendingUp, Users, Briefcase, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Breadcrumb } from "@/components/shared/components/breadcrumb";
import { ProfileData } from "../interfaces/profile.interface";
import { mockProfileData } from "../constants/profile.constants";
import { toast } from "sonner";

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData>(mockProfileData);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);

  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully", { duration: 3000 });
  };

  const handleToggleSetting = (
    setting: keyof typeof profileData.notificationSettings
  ) => {
    setProfileData((prev) => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [setting]: !prev.notificationSettings[setting],
      },
    }));
  };

  return (
    <div className="space-y-2.5">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Home", href: "/dashboard" }, { label: "Profile" }]}
      />

      {/* Page Header */}
      <div className="flex flex-col gap-0">
        <h1 className="text-xl font-bold text-[#0a0a0a] leading-7">
          Your Profile
        </h1>
        <p className="text-xs text-[#737373] leading-4">
          Manage your company details
        </p>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border border-[#e5e5e5] rounded-[10px] p-[25px] space-y-4">
        <h2 className="text-base font-medium text-[#0a0a0a] leading-5">
          Quick stats
        </h2>
        <div className="flex gap-4">
          {/* Total Interviews */}
          <div className="bg-[#f5f5f5] flex-1 flex flex-col gap-1 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#737373] leading-4">
                Total Interviews
              </p>
              <TrendingUp className="w-4 h-4 text-[#02563d]" />
            </div>
            <p className="text-2xl font-bold text-[#02563d] leading-8">
              {profileData.stats.totalInterviews.toLocaleString()}
            </p>
          </div>

          {/* Total Hires */}
          <div className="bg-[#f5f5f5] flex-1 flex flex-col gap-1 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#737373] leading-4">
                Total Hires
              </p>
              <Users className="w-4 h-4 text-[#02563d]" />
            </div>
            <p className="text-2xl font-bold text-[#02563d] leading-8">
              {profileData.stats.totalHires}
            </p>
          </div>

          {/* Active Jobs */}
          <div className="bg-[#f5f5f5] flex-1 flex flex-col gap-1 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#737373] leading-4">
                Active Jobs
              </p>
              <Briefcase className="w-4 h-4 text-[#02563d]" />
            </div>
            <p className="text-2xl font-bold text-[#02563d] leading-8">
              {profileData.stats.activeJobs}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex gap-2.5">
        {/* Left Column - Personal Details & Company Info */}
        <div className="flex-1 bg-white border border-[#e5e5e5] rounded-[10px] pt-2 pb-5">
          {/* Personal Details */}
          <div className="space-y-1">
            <div className="flex items-center justify-between h-14 px-6">
              <h2 className="text-base font-medium text-[#0a0a0a] leading-5">
                Personal details
              </h2>
              <Button
                variant="secondary"
                size="default"
                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                className="h-9 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            </div>
            <div className="flex flex-col gap-6 px-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-[#737373] leading-4">
                    First name
                  </p>
                  <p className="text-sm text-[#0a0a0a] leading-5">
                    {profileData.personalDetails.firstName}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-[#737373] leading-4">
                    Last name
                  </p>
                  <p className="text-sm text-[#0a0a0a] leading-5">
                    {profileData.personalDetails.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-[#737373] leading-4">
                    Email address
                  </p>
                  <p className="text-sm text-[#0a0a0a] leading-5">
                    {profileData.personalDetails.email}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-[#737373] leading-4">
                    Phone number
                  </p>
                  <p className="text-sm text-[#0a0a0a] leading-5">
                    {profileData.personalDetails.phone}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-[#737373] leading-4">
                  Designation
                </p>
                <p className="text-sm text-[#0a0a0a] leading-5">
                  {profileData.personalDetails.designation}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e5e5e5] my-0" />

          {/* Company Information */}
          <div className="space-y-1">
            <div className="flex items-center justify-between h-14 px-6">
              <h2 className="text-base font-medium text-[#0a0a0a] leading-5">
                Company Information
              </h2>
              <Button
                variant="secondary"
                size="default"
                onClick={() => setIsEditingCompany(!isEditingCompany)}
                className="h-9 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            </div>
            <div className="flex flex-col gap-6 px-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-[#737373] leading-4">
                    Organization name
                  </p>
                  <p className="text-sm text-[#0a0a0a] leading-5">
                    {profileData.companyInfo.organizationName}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-[#737373] leading-4">
                    Organization website
                  </p>
                  <p className="text-sm text-[#0a0a0a] leading-5">
                    {profileData.companyInfo.organizationWebsite}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-[#737373] leading-4">
                    Industry
                  </p>
                  <p className="text-sm text-[#0a0a0a] leading-5">
                    {profileData.companyInfo.industry}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-[#737373] leading-4">
                    Organization size
                  </p>
                  <p className="text-sm text-[#0a0a0a] leading-5">
                    {profileData.companyInfo.organizationSize}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="w-[588px] bg-white border border-[#e5e5e5] rounded-[10px] pt-2 pb-5">
          <div className="space-y-0.5">
            <div className="h-14 px-6 flex items-center">
              <h2 className="text-base font-medium text-[#0a0a0a] leading-5">
                Settings
              </h2>
            </div>
            <div className="flex flex-col gap-4 px-6">
              {/* Interview Reminders */}
              <div className="border border-[#e5e5e5] rounded p-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-sm font-medium text-[#0a0a0a] leading-none pt-0.5">
                      Interview Reminders
                    </p>
                    <p className="text-sm text-[#737373] leading-5">
                      Reminders 1 hour before interviews
                    </p>
                  </div>
                  <div className="mt-0.5">
                    <Switch
                      checked={
                        profileData.notificationSettings.interviewReminders
                      }
                      onCheckedChange={() =>
                        handleToggleSetting("interviewReminders")
                      }
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* New Candidate Applied */}
              <div className="border border-[#e5e5e5] rounded p-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-sm font-medium text-[#0a0a0a] leading-none pt-0.5">
                      New Candidate Applied
                    </p>
                    <p className="text-sm text-[#737373] leading-5">
                      Alert when candidates apply to your jobs
                    </p>
                  </div>
                  <div className="mt-0.5">
                    <Switch
                      checked={
                        profileData.notificationSettings.newCandidateApplied
                      }
                      onCheckedChange={() =>
                        handleToggleSetting("newCandidateApplied")
                      }
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Interview Completed */}
              <div className="border border-[#e5e5e5] rounded p-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-sm font-medium text-[#0a0a0a] leading-none pt-0.5">
                      Interview Completed
                    </p>
                    <p className="text-sm text-[#737373] leading-5">
                      Get notified when interviews are completed
                    </p>
                  </div>
                  <div className="mt-0.5">
                    <Switch
                      checked={
                        profileData.notificationSettings.interviewCompleted
                      }
                      onCheckedChange={() =>
                        handleToggleSetting("interviewCompleted")
                      }
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Save Preferences Button */}
              <Button
                onClick={handleSavePreferences}
                className="h-9 bg-[#02563d] hover:bg-[#02563d]/90 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
              >
                Save preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
