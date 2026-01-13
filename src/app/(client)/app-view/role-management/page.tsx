"use client";

import { useState } from "react";
import { Activity, CircleCheck, UserPlus, Target, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/app-view/stats-card";
import { StatusTag } from "@/components/ui/status-tag";
import { InviteTeamMemberModal } from "@/components/app-view/invite-modal";

// Sample data for the users table
const usersData = [
  {
    id: 1,
    name: "Mohit Kumar",
    email: "mohitkumar@gmail.com",
    phone: "+91 9876543210",
    role: "Admin",
    status: "Active" as const,
    joinedOn: "12/10/2025",
  },
  {
    id: 2,
    name: "Mohit Kumar",
    email: "mohitkumar@gmail.com",
    phone: "+91 9876543210",
    role: "Member",
    status: "Pending" as const,
    joinedOn: "12/10/2025",
  },
  {
    id: 3,
    name: "Mohit Kumar",
    email: "mohitkumar@gmail.com",
    phone: "+91 9876543210",
    role: "Member",
    status: "Inactive" as const,
    joinedOn: "12/10/2025",
  },
];

const statusVariantMap = {
  Active: "success",
  Pending: "warning",
  Inactive: "neutral",
} as const;

const tableHeaders = [
  "User name",
  "Email",
  "Contact number",
  "Role",
  "Status",
  "Joined on",
  "Action",
];

export default function RoleManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInvite = (data: {
    email: string;
    role: string;
    permissions: Record<string, Record<string, boolean>>;
  }) => {
    console.log("Inviting user:", data);
    // Here you would typically call an API to send the invitation
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">User Management</h2>
        <Button onClick={() => setIsModalOpen(true)}>Invite team member</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          icon={Activity}
          value={25}
          label="Total users"
          iconBgColor="bg-[rgba(2,86,61,0.1)]"
          iconColor="text-[#02563d]"
        />
        <StatsCard
          icon={CircleCheck}
          value={16}
          label="Active users"
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatsCard
          icon={UserPlus}
          value={7}
          label="Inactive users"
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          icon={Target}
          value={4}
          label="Pending invite"
          iconBgColor="bg-yellow-50"
          iconColor="text-yellow-600"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#e5e5e5]">
                {tableHeaders.map((header, idx) => (
                  <th
                    key={header}
                    className={[
                      "h-10 px-4 text-sm font-medium text-[#737373]",
                      idx === 0 ? "text-left" : "text-center",
                    ].join(" ")}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#e5e5e5] last:border-b-0 h-[77px]"
                >
                  <td className="px-4 text-sm text-[#0a0a0a] text-left">
                    {user.name}
                  </td>
                  <td className="px-4 text-sm text-[#0a0a0a] text-center">
                    {user.email}
                  </td>
                  <td className="px-4 text-sm text-[#0a0a0a] text-center">
                    {user.phone}
                  </td>
                  <td className="px-4 text-sm text-[#0a0a0a] text-center">
                    {user.role}
                  </td>
                  <td className="px-4 text-center">
                    <StatusTag variant={statusVariantMap[user.status]}>
                      {user.status}
                    </StatusTag>
                  </td>
                  <td className="px-4 text-sm text-[#0a0a0a] text-center">
                    {user.joinedOn}
                  </td>
                  <td className="px-4 text-center">
                    <button className="p-1 hover:bg-[rgba(0,0,0,0.05)] rounded transition-colors">
                      <Eye className="w-4 h-4 text-[#737373]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleInvite}
      />
    </div>
  );
}
