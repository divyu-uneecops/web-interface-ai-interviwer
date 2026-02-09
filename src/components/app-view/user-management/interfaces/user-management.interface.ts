export interface InviteFormValues {
  email: string;
  role: string;
}

export interface InviteModalProps {
  isOpen: boolean;
  roles: Record<string, any>[];
  onClose: () => void;
  onSuccess?: () => void;
}
