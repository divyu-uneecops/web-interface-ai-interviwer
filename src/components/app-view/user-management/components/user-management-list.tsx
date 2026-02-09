"use client";

import { useEffect, useState, useMemo } from "react";
import { MoreHorizontal, Eye, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusTag } from "@/components/ui/status-tag";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

import { DataTable, Column } from "@/components/shared/components/data-table";

import { DataTableSkeleton } from "@/components/shared/components/data-table-skeleton";

import { userService } from "../services/user.service";
import { InviteTeamMemberModal } from "./invite-modal";

const PAGE_LIMIT = 15;

type ApiUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: { number: string; countryCode: string };
  userId?: string;
  appRoles?: string[];
};

function formatUserName(user: ApiUser): string {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "--";
}

function formatPhone(user: ApiUser): string {
  const p = user.phoneNumber;
  if (!p?.number) return "--";
  return p.countryCode ? `${p.countryCode} ${p.number}` : p.number;
}

function formatRole(user: ApiUser): string {
  const roles = user.appRoles;
  if (!roles?.length) return "--";
  return roles.join(", ");
}

export default function UserManagementList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    nextOffset: null as number | null,
    previousOffset: null as number | null,
    limit: PAGE_LIMIT,
  });
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [currentOffset]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setUsers([]);
    setPagination({
      total: 0,
      nextOffset: null,
      previousOffset: null,
      limit: PAGE_LIMIT,
    });
    try {
      const params: Record<string, any> = {
        limit: PAGE_LIMIT,
        offset: currentOffset,
      };

      const response = await userService.getUsers(params);
      const data = response?.data ?? [];
      const page = response?.page ?? { limit: PAGE_LIMIT, total: 0 };
      const total = page.total ?? 0;
      const limit = page.limit ?? PAGE_LIMIT;

      setUsers(Array.isArray(data) ? data : []);

      const nextOffset =
        currentOffset + limit < total ? currentOffset + limit : null;
      const previousOffset = currentOffset > 0 ? currentOffset - limit : null;

      setPagination({
        total,
        nextOffset,
        previousOffset,
        limit,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load users", {
        duration: 8000,
      });
      setUsers([]);
      setPagination({
        total: 0,
        nextOffset: null,
        previousOffset: null,
        limit: PAGE_LIMIT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<ApiUser>[] = useMemo(
    () => [
      {
        id: "userName",
        header: "User name",
        align: "left",
        accessor: (user) => formatUserName(user),
      },
      {
        id: "email",
        header: "Email",
        align: "center",
        accessor: (user) => user.email ?? "--",
      },
      {
        id: "contact",
        header: "Contact number",
        align: "center",
        accessor: (user) => formatPhone(user),
      },
      {
        id: "role",
        header: "Role",
        align: "center",
        accessor: (user) => formatRole(user),
      },
      // {
      //   id: "status",
      //   header: "Status",
      //   align: "center",
      //   width: "125px",
      //   cell: () => (
      //     <div className="flex justify-center">
      //       <StatusTag variant="success">Active</StatusTag>
      //     </div>
      //   ),
      // },
      // {
      //   id: "joinedOn",
      //   header: "Joined on",
      //   align: "center",
      //   accessor: () => "--",
      // },
    ],
    []
  );

  const renderRowActions = (user: ApiUser) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye className="h-4 text-[#737373]" />
          View details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
      {/* Page Header - same layout as job-list */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsModalOpen(true)}>
            Invite team member
          </Button>
        </div>
      </div>

      {/* Users Table - DataTable like job-list */}
      <DataTable<ApiUser>
        data={users}
        columns={columns}
        getRowId={(user) => user?.id}
        pagination={pagination}
        currentOffset={currentOffset}
        onPaginationChange={setCurrentOffset}
        isLoading={isLoading}
        loadingState={<DataTableSkeleton columns={7} rows={11} />}
        emptyState={
          <Empty className="py-12">
            <EmptyMedia variant="icon">
              <UserPlus className="h-8 w-8 text-[#737373]" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No users found</EmptyTitle>
              <EmptyDescription>
                Invite team members to get started
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        }
        rowActions={renderRowActions}
      />

      {/* Invite Modal */}
      <InviteTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleInvite}
      />
    </div>
  );
}
