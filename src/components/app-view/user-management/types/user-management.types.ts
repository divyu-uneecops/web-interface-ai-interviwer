export type ApiUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: { number: string; countryCode: string };
  userId?: string;
  appRoles?: string[];
};
