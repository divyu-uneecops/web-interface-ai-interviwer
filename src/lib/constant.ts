export const API_ENDPOINTS = {
  AUTH: {
    VERIFY_EMAIL: "/admin/auth/_verify",
  },
  JOB_OPENING: {
    CREATE: "/v2/forminstances",
    LIST: "/objects/69521d4cc9ba83a076aac3b8/views/69521d4cc9ba83a076aac3b9/records",
    DELETE: "/objects/69521d4cc9ba83a076aac3b8/records/{id}",
    DETAIL: "/objects/69521d4cc9ba83a076aac3b8/records/{id}",
    UPDATE: "/objects/69521d4cc9ba83a076aac3b8/records/{id}",
    FORM_PROPERTIES: "/forms/69521d4cc9ba83a076aac3bb/properties",
  },
  APPLICANT: {
    CREATE: "/v2/forminstances",
    LIST: "/objects/69521d7dc9ba83a076aac3c8/views/69521d7dc9ba83a076aac3c9/records",
    DELETE: "/objects/69521d7dc9ba83a076aac3c8/records/{id}",
    UPDATE: "/objects/69521d7dc9ba83a076aac3c8/records/{id}",
    UPLOAD_ATTACHMENT: "/storage-accounts/lego/upload",
    UPLOAD_ATTACHMENT_TO_S3:
      "https://cosmocloud-storage-accounts.s3.amazonaws.com/",
    DOWNLOAD_ATTACHMENT: "/storage-accounts/lego/download",
  },
  INTERVIEWER: {
    CREATE: "/v2/forminstances",
    LIST: "/objects/69521d56c9ba83a076aac3bc/views/69521d56c9ba83a076aac3bd/records",
    UPDATE: "/objects/69521d56c9ba83a076aac3bc/records/{id}",
    DETAIL: "/objects/69521d56c9ba83a076aac3bc/records/{id}",
  },
  CREATE_ROUND: {
    CREATE: "/v2/forminstances",
    LIST: "/objects/69521d61c9ba83a076aac3c0/views/69521d61c9ba83a076aac3c1/records",
    UPDATE: "/objects/69521d61c9ba83a076aac3c0/records/{id}",
    DELETE: "/objects/69521d61c9ba83a076aac3c0/records/{id}",
    FORM_PROPERTIES: "/forms/69521d61c9ba83a076aac3c3/properties",
  },
  INTERVIEW: {
    CREATE: "/v2/forminstances",
    LIST: "/objects/interviews/views/interviews/records",
    UPDATE: "/objects/interviews/records/{id}",
    DETAIL: "/objects/interviews/records/{id}",
    DELETE: "/objects/interviews/records/{id}",
    CANCEL: "/objects/interviews/records/{id}/cancel",
  },
};
