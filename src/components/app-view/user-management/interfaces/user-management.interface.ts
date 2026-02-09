export interface InviteFormValues {
  email: string;
  role: string;
}

export interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}
