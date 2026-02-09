"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InviteModalProps,
  InviteFormValues,
} from "../interfaces/user-management.interface";
import { isValidEmail } from "@/lib/utils";
import { userService, ROLE_ID_MAP } from "../services/user.service";
import { toast } from "sonner";

const initialValues: InviteFormValues = {
  email: "",
  role: "",
};

export const validateInviteForm = (values: InviteFormValues) => {
  const errors: Partial<Record<keyof InviteFormValues, string>> = {};

  // Email validation
  if (!values.email || values?.email?.trim()?.length === 0) {
    errors.email = "Email address is required";
  } else if (!isValidEmail(values?.email?.trim())) {
    errors.email = "Please enter a valid email address";
  }

  // Role validation
  if (!values.role || values?.role?.trim()?.length === 0) {
    errors.role = "Role is required";
  }

  return errors;
};

export function InviteTeamMemberModal({
  isOpen,
  onClose,
  onSuccess,
}: InviteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<InviteFormValues>({
    initialValues,
    validate: validateInviteForm,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const roleId = ROLE_ID_MAP[values.role] ?? values.role;
        await userService.inviteUsers({
          roleIds: [roleId],
          emails: [values.email.trim()],
        });
        toast.success("Invitation sent successfully.", { duration: 5000 });
        formik.resetForm();
        onSuccess?.();
        onClose();
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          error?.message ??
          "Failed to send invitation. Please try again.";
        toast.error(message, { duration: 5000 });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      formik.resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[779px] sm:max-w-[779px]">
        <DialogHeader>
          <DialogTitle className="text-[#0a0a0a]">
            Invite team member
          </DialogTitle>
          <DialogDescription className="text-[#737373]">
            Send an invitation to join your team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
          <div className="flex flex-col gap-2">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="rohan@gmail.com"
              required
              value={formik?.values?.email}
              onChange={formik?.handleChange}
              onBlur={formik?.handleBlur}
              disabled={isSubmitting}
              error={
                formik?.touched?.email && formik?.errors?.email
                  ? formik?.errors?.email
                  : undefined
              }
              className="h-9 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-1 text-sm leading-5 text-[#0a0a0a] placeholder:text-[#737373]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="role"
              className="text-sm font-medium text-[#0a0a0a]"
            >
              Role <span className="text-destructive ml-1">*</span>
            </label>
            <Select
              value={formik?.values?.role}
              onValueChange={(value) => {
                formik.setFieldValue("role", value);
                formik.setFieldTouched("role", true, false);
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger
                id="role"
                className="w-full"
                onBlur={() => formik.setFieldTouched("role", true)}
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                {/* <SelectItem value="member">Member</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isSubmitting || !formik?.isValid}>
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
