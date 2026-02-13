export const API_ENDPOINTS = {
  APP: {
    FORM: "/api/orgs/69521ba88ecab90ed22cbcd9/forms",
    VIEWS: "/api/apps/69521cd1c9ba83a076aac3ae/objects/views",
  },
  AUTH: {
    VERIFY_EMAIL: "/admin/auth/_verify",
    LOGIN: "/admin/auth/login",
  },
  JOB_OPENING: {
    CREATE: "/api/v2/forminstances",
    LIST: "/api/objects/{objectId}/views/{viewId}/records",
    DELETE: "/api/objects/{objectId}/records/{id}",
    DETAIL: "/api/objects/{objectId}/records/{id}",
    UPDATE: "/api/objects/{objectId}/records/{id}",
    FORM_PROPERTIES: "/api/objects/{objectId}/forms/{formId}/properties",
  },
  APPLICANT: {
    CREATE: "/api/v2/forminstances",
    LIST: "/api/objects/{objectId}/views/{viewId}/records",
    DELETE: "/api/objects/69521d7dc9ba83a076aac3c8/records/{id}",
    UPDATE: "/api/objects/69521d7dc9ba83a076aac3c8/records/{id}",
    UPLOAD_ATTACHMENT: "/api/storage-accounts/lego/upload",
    UPLOAD_ATTACHMENT_TO_S3:
      "/api/https://cosmocloud-storage-accounts.s3.amazonaws.com/",
    DOWNLOAD_ATTACHMENT: "/api/storage-accounts/lego/download",
  },
  INTERVIEWER: {
    CREATE: "/api/v2/forminstances",
    LIST: "/api/objects/{objectId}/views/{viewId}/records",
    UPDATE: "/api/objects/{objectId}/records/{id}",
    FROM_PROPERTIES: "/api/objects/{objectId}/forms/{formId}/properties",
  },
  CREATE_ROUND: {
    CREATE: "/api/v2/forminstances",
    LIST: "/api/objects/69521d61c9ba83a076aac3c0/views/69521d61c9ba83a076aac3c1/records",
    UPDATE: "/api/objects/69521d61c9ba83a076aac3c0/records/{id}",
    DELETE: "/api/objects/69521d61c9ba83a076aac3c0/records/{id}",
    FORM_PROPERTIES: "/api/objects/{objectId}/forms/{formId}/properties",
  },
  INTERVIEW: {
    CREATE: "/api/v2/forminstances",
    LIST: "/api/objects/{objectId}/views/{viewId}/records",
    UPDATE: "/api/objects/interviews/records/{id}",
    DETAIL: "/api/objects/interviews/records/{id}",
    DELETE: "/api/objects/interviews/records/{id}",
    CANCEL: "/api/objects/interviews/records/{id}/cancel",
    VERIFY_APPLICANT: "/api/interviews/{id}/verify-applicant",
  },
  FEEDBACK: {
    SAVE: "/api/v2/forminstances",
  },
  USER: {
    LIST: "/admin/orgs/{orgId}/apps/{appId}/users",
    INVITE: "/admin/orgs/{orgId}/users",
    ROLES_LIST: "/admin/orgs/{orgId}/roles",
  },
  INTERVIEW_PENALTY: {
    CREATE: "/api/v2/forminstances",
  },
};
