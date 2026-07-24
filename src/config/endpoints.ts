export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    SEND_OTP: 'auth/send-otp',
    VERIFY_OTP: 'auth/verify-otp',
    REGISTER: 'auth/register',
    CHECK_PASSWORD: 'auth/check-password',
  },
  PLANS: {
    USER_DETAILS: 'plans/user-details',
  },
  FACE: {
    STATUS: 'face/status',
  },
  GROUPS: {
    LIST: 'groups',
    DETAILS: (id: string | number) => `groups/${id}`,
    PHOTOS: (id: string | number) => `groups/${id}/photos`,
    UPLOAD_PHOTOS: (id: string | number) => `groups/${id}/photos/upload`,
    PARTICIPANTS_MATCHED: (id: string | number) => `groups/${id}/participants-matched-photos`,
    PHOTO_DELETE_REQUESTS: (id: string | number) => `groups/${id}/photo-delete-requests`,
    VIDEO_DELETE_REQUESTS: (id: string | number) => `groups/${id}/video-delete-requests`,
  },
  USERS: {
    PROFILE: (id: string | number) => `users/${id}/profile`,
  }
};
