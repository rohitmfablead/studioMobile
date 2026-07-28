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
    PHOTOGRAPHER: 'plans/photographer',
  },
  FACE: {
    STATUS: 'face/status',
  },
  GROUPS: {
    LIST: 'groups',
    CREATE: 'groups',
    JOIN: 'groups/join',
    DETAILS: (id: string | number) => `groups/${id}`,
    PHOTOS: (id: string | number) => `groups/${id}/photos`,
    VIDEOS: (id: string | number) => `groups/${id}/videos`,
    UPLOAD_PHOTOS: (id: string | number) => `groups/${id}/photos/upload`,
    PARTICIPANTS: (id: string | number) => `groups/${id}/participants`,
    PARTICIPANTS_MATCHED: (id: string | number) => `groups/${id}/participants-matched-photos`,
    PHOTO_DELETE_REQUESTS: (id: string | number) => `groups/${id}/photo-delete-requests`,
    VIDEO_DELETE_REQUESTS: (id: string | number) => `groups/${id}/video-delete-requests`,
    REQUEST_DELETE_PHOTO: (id: string | number, photoId: string | number) => `groups/${id}/photos/${photoId}/delete-request`,
    FOLDERS: (id: string | number) => `groups/${id}/folders`,
    FOLDER_ACTION: (id: string | number, folderId: string | number) => `groups/${id}/folders/${folderId}`,
    VIEW_DOWNLOAD: (id: string | number) => `groups/${id}/settings/view-download`,
    DOWNLOAD_HISTORY: (id: string | number) => `groups/${id}/downloads/history`,
    MATCH_MY_PHOTOS: (id: string | number) => `groups/${id}/match-my-photos-by-cluster`,
  },
  USERS: {
    PROFILE: (id: string | number) => `users/${id}/profile`,
    UPDATE_AVATAR: 'users/avatar',
  },
  PHOTO_ACTIONS: {
    LIKE: (id: string | number) => `photos/${id}/like`,
    FAVORITE: (id: string | number) => `photos/${id}/favorite`,
    DOWNLOAD: (id: string | number) => `photos/${id}/download?no_watermark=1`,
  },
  PHOTOS: 'photos',
  DOWNLOADS: {
    HISTORY: 'downloads/history',
  },
  DASHBOARD: {
    STATS: 'dashboard/stats',
  },
  WATERMARK: {
    SETTINGS: 'watermark/settings',
  },
  BUSINESS: {
    SETTINGS: 'business/settings',
  }
};
