import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '../config/endpoints';

// Define API types
export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  user_id: string;
  is_verified?: number;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  user_id: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user_id: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  is_platform: string;
  otp: string;
  user_id: string;
}

export interface CheckPasswordRequest {
  user_id: string;
}

export interface CheckPasswordResponse {
  success: boolean;
  message: string;
  is_password_exists: boolean;
}

export interface UserDetailsRequest {
  user_id: number | string;
}

export interface UserDetailsResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      plan_id: string | null;
      is_plan_purchased: boolean;
      plan_starts_at: string | null;
      plan_expires_at: string | null;
    };
    plans: any[];
    purchased_features: any[];
  };
}

export interface FaceStatusResponse {
  registered: boolean;
  selfie_url: string | null;
  selfie_url_new: string | null;
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password?: string;
  type?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    role: string;
    facialRecognitionRegistered: boolean;
    is_verified: number;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
  };
}

export interface Group {
  id: number;
  name: string;
  type: string;
  status: string;
  eventType: string | null;
  eventDate: string | null;
  description: string | null;
  coverImage: string | null;
  joinCode: string;
  memberCount: number;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar: string;
    role: string;
    facial_recognition: number;
    is_verified: number;
    status: string;
    email_verified_at: string;
    whatsapp_number: string | null;
    logo: string | null;
    created_at: string;
    updated_at: string;
    portfolio_slug: string;
    portfolio_public_url: string;
    business: {
      name: string | null;
      phone: string | null;
      email: string | null;
      website: string | null;
      socialLinks: any[];
      showInfo: boolean;
    };
    settings: any[];
  };
}

export interface GetGroupsResponse {
  success: boolean;
  groups: Group[];
  total: number;
  page: number;
  limit: number;
}

export interface Photo {
  id: number;
  group_id: number;
  filename: string;
  url: string;
  thumbnail_url: string;
  photographer: any;
  size_bytes: number;
  size_formatted: string;
  resolution: string;
  width: number;
  height: number;
  format: string;
  status: string;
  is_selected_by_client: boolean;
  is_in_flipbook: boolean;
  isFavorite: boolean;
  isLiked: boolean;
  liked: boolean;
  is_processing: boolean;
  uploaded_at: string;
  created_at: string;
  metadata: any;
  tags: any[];
  likes_count: number;
  comments_count: number;
}

export interface GetGroupPhotosResponse {
  success: boolean;
  data: {
    photos: Photo[];
  };
}

export interface GetGroupDetailsResponse {
  success: boolean;
  group: Group & {
    owner: any;
    privacy: any;
    viewDownload: any;
    participants: any[];
    team_members: any[];
    monetization: any;
    flipbook: any;
    branding: any;
    albumDownloadPin: string | null;
    watermark: any;
    sponsors: any[];
  };
}

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://fablead-studio.com/services/api/',
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as any).app.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getGroups: builder.query<GetGroupsResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.GROUPS.LIST,
        method: 'GET',
      }),
    }),
    createGroup: builder.mutation<any, any>({
      query: (body) => ({
        url: API_ENDPOINTS.GROUPS.CREATE,
        method: 'POST',
        body,
      }),
    }),
    joinGroup: builder.mutation<any, any>({
      query: (body) => ({
        url: API_ENDPOINTS.GROUPS.JOIN,
        method: 'POST',
        body,
      }),
    }),
    getGroupDetails: builder.query<GetGroupDetailsResponse, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.GROUPS.DETAILS(id),
        method: 'GET',
      }),
    }),
    updateGroupDetails: builder.mutation<any, { id: string | number; body: any }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.GROUPS.DETAILS(id),
        method: 'PUT',
        body,
      }),
    }),
    deleteGroup: builder.mutation<any, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.GROUPS.DETAILS(id),
        method: 'DELETE',
      }),
    }),
    updateGroupViewDownloadSettings: builder.mutation<any, { id: string | number; body: any }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.GROUPS.VIEW_DOWNLOAD(id),
        method: 'PUT',
        body,
      }),
    }),
    getGroupPhotos: builder.query<GetGroupPhotosResponse, { id: string | number; params?: any }>({
      query: ({ id, params }) => ({
        url: API_ENDPOINTS.GROUPS.PHOTOS(id),
        method: 'GET',
        params,
      }),
    }),
    getGroupParticipants: builder.query<any, { id: string | number; params?: any }>({
      query: ({ id, params }) => ({
        url: API_ENDPOINTS.GROUPS.PARTICIPANTS(id),
        method: 'GET',
        params,
      }),
    }),
    matchMyPhotos: builder.mutation<any, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.GROUPS.MATCH_MY_PHOTOS(id),
        method: 'POST',
      }),
    }),
    getGroupDownloadHistory: builder.query<any, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.GROUPS.DOWNLOAD_HISTORY(id),
        method: 'GET',
      }),
    }),
    getGroupFolders: builder.query<any, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.GROUPS.FOLDERS(id),
        method: 'GET',
      }),
    }),
    getGroupFolders: builder.query<any, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.GROUPS.FOLDERS(id),
        method: 'GET',
      }),
    }),
    createGroupFolder: builder.mutation<any, { id: string | number; body: { name: string; description?: string } }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.GROUPS.FOLDERS(id),
        method: 'POST',
        body,
      }),
    }),
    updateGroupFolder: builder.mutation<any, { id: string | number; folderId: string | number; body: { name: string; description?: string } }>({
      query: ({ id, folderId, body }) => ({
        url: API_ENDPOINTS.GROUPS.FOLDER_ACTION(id, folderId),
        method: 'PUT',
        body,
      }),
    }),
    deleteGroupFolder: builder.mutation<any, { id: string | number; folderId: string | number }>({
      query: ({ id, folderId }) => ({
        url: API_ENDPOINTS.GROUPS.FOLDER_ACTION(id, folderId),
        method: 'DELETE',
      }),
    }),
    getGroupParticipantsMatched: builder.query<any, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.GROUPS.PARTICIPANTS_MATCHED(id),
        method: 'GET',
      }),
    }),
    getGroupPhotoDeleteRequests: builder.query<any, { id: string | number; params?: any }>({
      query: ({ id, params }) => ({
        url: API_ENDPOINTS.GROUPS.PHOTO_DELETE_REQUESTS(id),
        method: 'GET',
        params,
      }),
    }),
    uploadPhotos: builder.mutation<any, { 
      id: string | number; 
      assets: any[]; 
      enable_watermark?: string; 
      no_watermark?: string; 
      is_platform?: string; 
    }>({
      queryFn: async ({ id, assets, enable_watermark, no_watermark, is_platform }, api) => {
        try {
          const state = api.getState() as any;
          const token = state.app.token;
          const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://fablead-studio.com/services/api/';
          
          const { Platform } = require('react-native');
          const formData = new FormData();
          
          for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            const fileName = asset.fileName || `photo_${i}.jpg`;
            const mimeType = asset.mimeType || 'image/jpeg';
            
            if (Platform.OS === 'web') {
              // On web, fetch the blob from the URI to append a true File object
              const res = await fetch(asset.uri);
              const blob = await res.blob();
              const file = new File([blob], fileName, { type: mimeType });
              formData.append('photos[]', file);
              formData.append('files[]', file);
            } else {
              // React Native expects the object format
              const fileObj = {
                uri: String(asset.uri),
                name: String(fileName),
                type: String(mimeType),
              };
              formData.append('photos[]', fileObj as any);
              formData.append('files[]', fileObj as any);
            }
          }
          
          if (enable_watermark !== undefined) formData.append('enable_watermark', String(enable_watermark));
          if (no_watermark !== undefined) formData.append('no_watermark', String(no_watermark));
          if (is_platform !== undefined) formData.append('is_platform', String(is_platform));

          const response = await fetch(`${baseUrl}groups/${id}/photos/upload`, {
            method: 'POST',
            headers: token ? { 'authorization': `Bearer ${token}` } : {},
            body: formData,
          });
          const result = await response.json();
          if (!response.ok) {
            return { error: { status: response.status, data: result } };
          }
          return { data: result };
        } catch (error: any) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
    }),
    getGroupVideoDeleteRequests: builder.query<any, { id: string | number; params?: any }>({
      query: ({ id, params }) => ({
        url: API_ENDPOINTS.GROUPS.VIDEO_DELETE_REQUESTS(id),
        method: 'GET',
        params,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body,
      }),
    }),
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.SEND_OTP,
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.VERIFY_OTP,
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation<any, RegisterRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: 'POST',
        body,
      }),
    }),
    checkPassword: builder.mutation<CheckPasswordResponse, CheckPasswordRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.CHECK_PASSWORD,
        method: 'POST',
        body,
      }),
    }),
    getUserDetails: builder.query<UserDetailsResponse, UserDetailsRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.PLANS.USER_DETAILS,
        method: 'POST',
        body,
      }),
    }),
    getUserProfile: builder.query<UserProfileResponse, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.PROFILE(id),
        method: 'GET',
      }),
    }),
    getFaceStatus: builder.query<FaceStatusResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.FACE.STATUS,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRegisterMutation,
  useCheckPasswordMutation,
  useGetUserDetailsQuery,
  useGetUserProfileQuery,
  useGetFaceStatusQuery,
  useGetGroupsQuery,
  useCreateGroupMutation,
  useJoinGroupMutation,
  useGetGroupDetailsQuery,
  useUpdateGroupDetailsMutation,
  useDeleteGroupMutation,
  useUpdateGroupViewDownloadSettingsMutation,
  useGetGroupPhotosQuery,
  useGetGroupParticipantsQuery,
  useMatchMyPhotosMutation,
  useGetGroupDownloadHistoryQuery,
  useGetGroupParticipantsMatchedQuery,
  useGetGroupPhotoDeleteRequestsQuery,
  useGetGroupVideoDeleteRequestsQuery,
  useGetGroupFoldersQuery,
  useCreateGroupFolderMutation,
  useUpdateGroupFolderMutation,
  useDeleteGroupFolderMutation,
  useUploadPhotosMutation,
} = appApi;
