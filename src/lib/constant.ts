export const API_ENDPOINTS = {
  APP: {
    FORM: "/api/organisations/{orgId}/forms?limit=10000",
    VIEWS: "/api/organisations/{orgId}/apps/{appId}/objects/views",
  },
  AUTH: {
    VERIFY_EMAIL: "/admin/auth/_verify",
    LOGIN: "/admin/auth/login",
    REGISTER: "/admin/auth/register",
    VERIFY_OTP: "/admin/auth/user/verify/verify-otp",
    RESEND_OTP: "/admin/auth/user/verify/request-otp",
  },
  JOB_OPENING: {
    CREATE: "/api/objects/{objectId}/records",
    LIST: "/api/objects/{objectId}/views/{viewId}/records",
    DELETE: "/api/objects/{objectId}/records/{id}",
    DETAIL: "/api/objects/{objectId}/records/{id}",
    UPDATE: "/api/objects/{objectId}/records/{id}",
    FORM_PROPERTIES: "/api/objects/{objectId}/forms/{formId}/properties",
  },
  APPLICANT: {
    CREATE: "/api/objects/{objectId}/records",
    FORM_PROPERTIES: "/api/objects/{objectId}/forms/{formId}/properties",
    LIST: "/api/objects/{objectId}/views/{viewId}/records",
    DELETE: "/api/objects/{objectId}/records/{id}",
    UPDATE: "/api/objects/{objectId}/records/{id}",
    UPLOAD_ATTACHMENT: "/api/storage-accounts/lego/upload",
    DOWNLOAD_ATTACHMENT: "/api/storage-accounts/lego/download",
  },
  INTERVIEWER: {
    CREATE: "/api/objects/{objectId}/records",
    LIST: "/api/objects/{objectId}/views/{viewId}/records",
    UPDATE: "/api/objects/{objectId}/records/{id}",
    FROM_PROPERTIES: "/api/objects/{objectId}/forms/{formId}/properties",
  },
  CREATE_ROUND: {
    CREATE: "/api/objects/{objectId}/records",
    LIST: "/api/objects/{objectId}/views/{viewId}/records",
    UPDATE: "/api/objects/{objectId}/records/{id}",
    DELETE: "/api/objects/{objectId}/records/{id}",
    FORM_PROPERTIES: "/api/objects/{objectId}/forms/{formId}/properties",
  },
  INTERVIEW: {
    CREATE: "/api/objects/{objectId}/records",
    LIST: "/api/objects/{objectId}/views/{viewId}/records",
    DETAIL: "/api/objects/interviews/records/{id}",
    FORM_PROPERTIES: "/api/objects/{objectId}/forms/{formId}/properties",
  },
  FEEDBACK: {
    SAVE: "/api/objects/{objectId}/records",
    FORM_PROPERTIES: "/api/objects/{objectId}/forms/{formId}/properties",
  },
  USER: {
    LIST: "/admin/orgs/{orgId}/apps/{appId}/users",
    INVITE: "/admin/orgs/{orgId}/users",
    ROLES_LIST: "/admin/orgs/{orgId}/roles",
  },
  INTERVIEW_PENALTY: {
    CREATE: "/api/objects/{objectId}/records",
    UPLOAD: "/api/storage-accounts/lego/upload",
    FROM_PROPERTIES: "/api/objects/{objectId}/forms/{formId}/properties",
  },
};
