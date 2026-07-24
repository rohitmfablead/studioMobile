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
    getGroupDetails: builder.query<GetGroupDetailsResponse, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.GROUPS.DETAILS(id),
        method: 'GET',
      }),
    }),
    getGroupPhotos: builder.query<GetGroupPhotosResponse, { id: string | number; params?: any }>({
      query: ({ id, params }) => ({
        url: API_ENDPOINTS.GROUPS.PHOTOS(id),
        method: 'GET',
        params,
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
    uploadPhotos: builder.mutation<any, { id: string | number; body: FormData }>({
      queryFn: async ({ id, body }, api) => {
        try {
          const state = api.getState() as any;
          const token = state.app.token;
          const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://fablead-studio.com/services/api/';
          const response = await fetch(`${baseUrl}groups/${id}/photos/upload`, {
            method: 'POST',
            headers: token ? { 'authorization': `Bearer ${token}` } : {},
            body,
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
  useGetGroupDetailsQuery,
  useGetGroupPhotosQuery,
  useGetGroupParticipantsMatchedQuery,
  useGetGroupPhotoDeleteRequestsQuery,
  useGetGroupVideoDeleteRequestsQuery,
  useUploadPhotosMutation,
} = appApi;
