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

export interface SetPasswordRequest {
  user_id: string;
  password: string;
  password_confirmation: string;
}

export interface SetPasswordResponse {
  success: boolean;
  message: string;
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
  sortBy: string;
  enableWatermark: boolean;
  coverImage: string | null;
  joinCode: string;
  inviteCode: string;
  invite_code: string;
  inviteLink: string;
  invite_link: string;
  memberCount: number;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string | null;
    role: string;
    whatsappNumber: string | null;
    logo: string | null;
    businessName: string | null;
    businessEmail: string | null;
    businessPhone: string | null;
    businessAddress: string | null;
    businessWebsite: string | null;
    socialLinks: any | null;
    isVerified: number;
    emailVerifiedAt: string;
    createdAt: string;
    updatedAt: string;
  };
  privacy?: {
    allowMemberEdit: boolean;
    allowJoinByLink: boolean;
    allowAnonymousView: boolean;
    requireFaceVerification: boolean;
    uploadPermission: string;
  };
  viewDownload?: {
    allowDownloading: boolean;
    enableSharing: boolean;
    enableScreenshots: boolean;
    downloadQuality: string;
    bulkDownloads: boolean;
    viewingPlatform: string;
  };
  participants?: any[];
  team_members?: any[];
  monetization?: {
    enabled: boolean;
    sellPhotos: boolean;
    paidDownloads: boolean;
    pricePerPhoto: number;
    pricePerAlbum: number;
    currency: string;
    clientAlbumSelection: boolean;
    maxSelections: number;
    watermarkText: string;
    enableClientFavorites: boolean;
    allowDownloadFavorites: boolean;
    allowShareFavorites: boolean;
    autoNotifyFavorites: boolean;
    maxFavoritesPerClient: number;
  };
  flipbook?: {
    enabled: boolean;
    autoPlay: boolean;
    showPageNumbers: boolean;
    animation: string;
    backgroundColor: string;
    backgroundMusic: string | null;
  };
  branding?: {
    name: string | null;
    logo: string | null;
    show: boolean;
    onLoginPage: boolean;
  };
  albumDownloadPin: string | null;
  watermark?: {
    type: string;
    opacity: string;
    tiled: boolean;
    position: string;
    scale: string;
    image_url: string | null;
  };
  sponsors?: any[];
  user_id?: number;
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

export interface GetGroupVideosResponse {
  success: boolean;
  data: {
    videos: any[];
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
  tagTypes: ['Groups', 'Photos', 'GroupDetails', 'Downloads', 'VideoDeleteRequests', 'PhotoDeleteRequests'],
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
      providesTags: ['Groups'],
    }),
    createGroup: builder.mutation<any, any>({
      query: (body) => ({
        url: API_ENDPOINTS.GROUPS.CREATE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Groups'],
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
    deletePhotos: builder.mutation<any, { photoIds: string[] }>({
      query: (data) => ({
        url: API_ENDPOINTS.PHOTOS,
        method: 'POST', // Use POST with _method spoofing to bypass WAF on DELETE with body
        body: { ...data, _method: 'DELETE' },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Photos', id: 'LIST' }],
    }),
    requestDeletePhoto: builder.mutation<any, { id: string | number; photoId: string | number; reason: string }>({
      query: ({ id, photoId, reason }) => ({
        url: API_ENDPOINTS.GROUPS.REQUEST_DELETE_PHOTO(id, photoId),
        method: 'POST',
        body: { reason },
      }),
    }),
    updateGroupDetails: builder.mutation<any, { id: string | number; body: any }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.GROUPS.DETAILS(id),
        method: 'PUT',
        body,
      }),
    }),
    getDashboardStats: builder.query<any, void>({
      query: () => ({
        url: API_ENDPOINTS.DASHBOARD.STATS,
        method: 'GET',
      }),
    }),
    getWatermarkSettings: builder.query<any, void>({
      query: () => ({
        url: API_ENDPOINTS.WATERMARK.SETTINGS,
        method: 'GET',
      }),
    }),
    getPhotographerPlans: builder.query<any, void>({
      query: () => ({
        url: API_ENDPOINTS.PLANS.PHOTOGRAPHER,
        method: 'GET',
      }),
    }),
    getBusinessSettings: builder.query<any, void>({
      query: () => ({
        url: API_ENDPOINTS.BUSINESS.SETTINGS,
        method: 'GET',
      }),
    }),
    updateBusinessSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: API_ENDPOINTS.BUSINESS.SETTINGS,
        method: 'PUT',
        body,
      }),
    }),
    saveWatermarkSettings: builder.mutation<any, FormData>({
      query: (body) => ({
        url: 'watermark',
        method: 'POST',
        body,
      }),
    }),
    likePhoto: builder.mutation<any, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.PHOTO_ACTIONS.LIKE(id),
        method: 'POST',
      }),
    }),
    favoritePhoto: builder.mutation<any, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.PHOTO_ACTIONS.FAVORITE(id),
        method: 'POST',
      }),
    }),
    unlikePhoto: builder.mutation<any, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.PHOTO_ACTIONS.LIKE(id),
        method: 'DELETE',
      }),
    }),
    unfavoritePhoto: builder.mutation<any, string | number>({
      query: (id) => ({
        url: API_ENDPOINTS.PHOTO_ACTIONS.FAVORITE(id),
        method: 'DELETE',
      }),
    }),
    addDownloadHistory: builder.mutation<any, any>({
      query: (body) => ({
        url: API_ENDPOINTS.DOWNLOADS.HISTORY,
        method: 'POST',
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
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}_${queryArgs.id}`; // cache by group id and endpoint
      },
      merge: (currentCache, newItems, otherArgs) => {
        if (otherArgs.arg.params?.page > 1) {
          if (newItems.data?.photos?.length) {
            currentCache.data.photos.push(...newItems.data.photos);
          }
        } else {
          return newItems;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.params?.page !== previousArg?.params?.page;
      },
    }),
    getGroupVideos: builder.query<GetGroupVideosResponse, { id: string | number; params?: any }>({
      query: ({ id, params }) => ({
        url: API_ENDPOINTS.GROUPS.VIDEOS(id),
        method: 'GET',
        params,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}_${queryArgs.id}`;
      },
      merge: (currentCache, newItems, otherArgs) => {
        if (otherArgs.arg.params?.page > 1) {
          if (newItems.data?.videos?.length) {
            currentCache.data.videos.push(...newItems.data.videos);
          }
        } else {
          return newItems;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.params?.page !== previousArg?.params?.page;
      },
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
      onProgress?: (progress: number, current?: number, total?: number, fileProgresses?: { [key: number]: number }) => void;
      onItemSuccess?: () => void;
    }>({
      queryFn: async ({ id, assets, enable_watermark, no_watermark, is_platform, onProgress, onItemSuccess }, api) => {
        try {
          const state = api.getState() as any;
          const token = state.app.token;
          const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://fablead-studio.com/services/api/';
          
          const { Platform } = require('react-native');
          const FileSystem = require('expo-file-system/legacy');
          let Notifications: any = null;
          try {
            const Constants = require('expo-constants').default || require('expo-constants');
            if (Constants.appOwnership !== 'expo') {
              Notifications = require('expo-notifications');
              if (Notifications && Notifications.setNotificationHandler) {
                Notifications.setNotificationHandler({
                  handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: false,
                    shouldSetBadge: false,
                  }),
                });
              }
            }
          } catch (e) {
            console.warn('Expo Notifications not available in this environment');
          }
          
          let totalUploaded = 0;
          const totalAssets = assets.length;
          
          let notificationId: string | null = null;
          if (Platform.OS !== 'web' && Notifications) {
            try {
              notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Uploading Photos',
                  body: `Uploading 0 of ${totalAssets}...`,
                  autoDismiss: false,
                  sticky: true,
                },
                trigger: null,
              });
            } catch (e) {
              console.warn('Failed to schedule notification', e);
            }
          }

          let lastError = null;
          let results = [];
          let fileProgresses: { [key: number]: number } = {};

          let currentIndex = 0;
          const CONCURRENCY = 10;

          const uploadNext = async (): Promise<void> => {
            if (currentIndex >= assets.length) return;
            const actualIndex = currentIndex++;
            const asset = assets[actualIndex];
            const fileName = asset.fileName || `photo_${actualIndex}.jpg`;
            const mimeType = asset.mimeType || 'image/jpeg';
            
            if (Platform.OS === 'web') {
              // Web fallback uses standard XHR
              const formData = new FormData();
              const res = await fetch(asset.uri);
              const blob = await res.blob();
              const file = new File([blob], fileName, { type: mimeType });
              formData.append('photos[]', file);
              formData.append('files[]', file);
              if (enable_watermark !== undefined) formData.append('enable_watermark', String(enable_watermark));
              if (no_watermark !== undefined) formData.append('no_watermark', String(no_watermark));
              if (is_platform !== undefined) formData.append('is_platform', String(is_platform));

              try {
                const result = await new Promise((resolve, reject) => {
                  const xhr = new XMLHttpRequest();
                  xhr.open('POST', `${baseUrl}groups/${id}/photos/upload`);
                  if (token) xhr.setRequestHeader('authorization', `Bearer ${token}`);
                  
                  xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                      fileProgresses[actualIndex] = Math.round((event.loaded / event.total) * 100);
                      if (onProgress) onProgress(Math.round((totalUploaded / totalAssets) * 100), totalUploaded, totalAssets, fileProgresses);
                    }
                  };

                  xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300 ? { data: JSON.parse(xhr.responseText) } : { error: xhr.responseText });
                  xhr.onerror = () => reject(new Error('Network request failed'));
                  xhr.send(formData as any);
                });
                results.push(result);
                
                fileProgresses[actualIndex] = 100;
                totalUploaded++;
                if (onItemSuccess) onItemSuccess();
                if (onProgress) onProgress(Math.round((totalUploaded / totalAssets) * 100), totalUploaded, totalAssets, fileProgresses);
              } catch (e) {
                lastError = e;
              }
            } else {
              // Native uses background FileSystem upload
              try {
                const parameters: Record<string, string> = {};
                if (enable_watermark !== undefined) parameters['enable_watermark'] = String(enable_watermark);
                if (no_watermark !== undefined) parameters['no_watermark'] = String(no_watermark);
                if (is_platform !== undefined) parameters['is_platform'] = String(is_platform);

                const uploadTask = FileSystem.createUploadTask(
                  `${baseUrl}groups/${id}/photos/upload`,
                  asset.uri,
                  {
                    httpMethod: 'POST',
                    headers: { authorization: `Bearer ${token}` },
                    uploadType: 1, // FileSystem.FileSystemUploadType.MULTIPART
                    fieldName: 'files[]',
                    mimeType: mimeType,
                    parameters,
                    sessionType: 1, // FileSystem.FileSystemSessionType.BACKGROUND
                  },
                  (progressData: any) => {
                    if (progressData && progressData.totalBytesExpectedToSend) {
                      const pct = Math.round((progressData.totalBytesSent / progressData.totalBytesExpectedToSend) * 100);
                      fileProgresses[actualIndex] = pct;
                      if (onProgress) {
                        onProgress(Math.round((totalUploaded / totalAssets) * 100), totalUploaded, totalAssets, fileProgresses);
                      }
                    }
                  }
                );
                
                const response = await uploadTask.uploadAsync();
                console.log(`NATIVE UPLOAD RESPONSE for ${fileName}:`, response.status, response.body);
                if (response.status < 200 || response.status >= 300) {
                  throw new Error(`Server returned ${response.status}: ${response.body}`);
                }
                results.push(response);
                
                fileProgresses[actualIndex] = 100;
                totalUploaded++;
                if (onItemSuccess) {
                  onItemSuccess();
                }
                if (onProgress) onProgress(Math.round((totalUploaded / totalAssets) * 100), totalUploaded, totalAssets, fileProgresses);
              } catch (e) {
                console.error("Native upload error:", e);
                lastError = e;
              }
            }
            
            if (Platform.OS !== 'web' && notificationId && Notifications) {
              try {
                await Notifications.scheduleNotificationAsync({
                  identifier: notificationId,
                  content: {
                    title: 'Uploading Photos',
                    body: `Uploading ${totalUploaded} of ${totalAssets}...`,
                    autoDismiss: false,
                    sticky: true,
                  },
                  trigger: null,
                });
              } catch (e) {}
            }

            await uploadNext();
          };

          const workers = [];
          for (let i = 0; i < CONCURRENCY; i++) {
            workers.push(uploadNext());
          }
          await Promise.all(workers);
          
          if (Platform.OS !== 'web' && notificationId && Notifications) {
            try {
              await Notifications.scheduleNotificationAsync({
                identifier: notificationId,
                content: {
                  title: 'Upload Complete',
                  body: `Successfully uploaded ${totalUploaded} photos.`,
                  autoDismiss: true,
                  sticky: false,
                },
                trigger: null,
              });
            } catch (e) {}
          }
          
          return lastError ? { error: { status: 'FETCH_ERROR', error: String(lastError) } } : { data: { message: 'Uploaded successfully', results } };
        } catch (error: any) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
    }),
    uploadVideos: builder.mutation<any, { 
      id: string | number; 
      assets: any[]; 
      onProgress?: (progress: number, current?: number, total?: number) => void;
      onItemSuccess?: () => void;
    }>({
      queryFn: async ({ id, assets, onProgress, onItemSuccess }, api) => {
        try {
          const state = api.getState() as any;
          const token = state.app.token;
          const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://fablead-studio.com/services/api/';
          
          const { Platform } = require('react-native');
          const FileSystem = require('expo-file-system/legacy');
          let Notifications: any = null;
          try {
            const Constants = require('expo-constants').default || require('expo-constants');
            if (Constants.appOwnership !== 'expo') {
              Notifications = require('expo-notifications');
              if (Notifications && Notifications.setNotificationHandler) {
                Notifications.setNotificationHandler({
                  handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: false,
                    shouldSetBadge: false,
                  }),
                });
              }
            }
          } catch (e) {
            console.warn('Expo Notifications not available in this environment');
          }
          
          let totalUploaded = 0;
          const totalAssets = assets.length;
          
          let notificationId: string | null = null;
          if (Platform.OS !== 'web' && Notifications) {
            try {
              notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Uploading Videos',
                  body: `Uploading 0 of ${totalAssets}...`,
                  autoDismiss: false,
                  sticky: true,
                },
                trigger: null,
              });
            } catch (e) {
              console.warn('Failed to schedule notification', e);
            }
          }

          let lastError = null;
          let results = [];
          
          for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            const fileName = asset.fileName || `video_${i}.mp4`;
            const mimeType = asset.mimeType || 'video/mp4';
            
            if (Platform.OS === 'web') {
              const formData = new FormData();
              const res = await fetch(asset.uri);
              const blob = await res.blob();
              const file = new File([blob], fileName, { type: mimeType });
              formData.append('files[]', file);

              const result = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `${baseUrl}groups/${id}/videos/upload`);
                if (token) xhr.setRequestHeader('authorization', `Bearer ${token}`);
                xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300 ? { data: JSON.parse(xhr.responseText) } : { error: xhr.responseText });
                xhr.onerror = () => reject(new Error('Network request failed'));
                xhr.send(formData as any);
              });
              results.push(result);
            } else {
              try {
                const uploadTask = FileSystem.createUploadTask(
                  `${baseUrl}groups/${id}/videos/upload`,
                  asset.uri,
                  {
                    httpMethod: 'POST',
                    headers: { authorization: `Bearer ${token}` },
                    uploadType: 1, // FileSystem.FileSystemUploadType.MULTIPART
                    fieldName: 'files[]',
                    mimeType: mimeType,
                    sessionType: 1, // FileSystem.FileSystemSessionType.BACKGROUND
                  },
                  (progressData: any) => { }
                );
                
                const response = await uploadTask.uploadAsync();
                console.log('NATIVE VIDEO UPLOAD RESPONSE:', response.status, response.body);
                if (response.status < 200 || response.status >= 300) {
                  throw new Error(`Server returned ${response.status}: ${response.body}`);
                }
                results.push(response);
                
                totalUploaded++;
                if (onItemSuccess) {
                  onItemSuccess();
                }
              } catch (e) {
                console.error("Native video upload error:", e);
                lastError = e;
              }
            }
            
            if (onProgress) {
              onProgress(Math.round((totalUploaded / totalAssets) * 100), totalUploaded, totalAssets);
            }
            
            if (Platform.OS !== 'web' && notificationId && Notifications) {
              try {
                await Notifications.scheduleNotificationAsync({
                  identifier: notificationId,
                  content: {
                    title: 'Uploading Videos',
                    body: `Uploading ${totalUploaded} of ${totalAssets}...`,
                    autoDismiss: false,
                    sticky: true,
                  },
                  trigger: null,
                });
              } catch (e) {}
            }
          }

          if (Platform.OS !== 'web' && notificationId && Notifications) {
            try {
              await Notifications.scheduleNotificationAsync({
                identifier: notificationId,
                content: {
                  title: 'Upload Complete',
                  body: `Successfully uploaded ${totalUploaded} videos.`,
                  autoDismiss: true,
                  sticky: false,
                },
                trigger: null,
              });
            } catch (e) {}
          }
          
          return lastError ? { error: { status: 'FETCH_ERROR', error: String(lastError) } } : { data: { message: 'Uploaded successfully', results } };
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
    setPassword: builder.mutation<SetPasswordResponse, SetPasswordRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.SET_PASSWORD,
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
    registerFace: builder.mutation<any, { uri: string; type: string; name: string }>({
      queryFn: async ({ uri, type, name }, { getState }) => {
        try {
          const token = (getState() as any).app.token;
          const formData = new FormData();
          formData.append('image', { uri, type, name } as any);
          const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://fablead-studio.com/services/api/';
          
          const result = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${baseUrl}${API_ENDPOINTS.FACE.REGISTER}`);
            if (token) xhr.setRequestHeader('authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Accept', 'application/json');
            
            xhr.onload = () => {
              try {
                const res = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve({ data: res });
                } else {
                  resolve({ error: { status: xhr.status, data: res } });
                }
              } catch(e) {
                resolve({ error: { status: xhr.status, data: xhr.responseText } });
              }
            };
            
            xhr.onerror = () => reject(new Error('Network request failed'));
            xhr.send(formData as any);
          });
          
          return result as any;
        } catch (err: any) {
          return { error: { status: 'FETCH_ERROR', error: String(err) } };
        }
      },
    }),
    updateAvatar: builder.mutation<any, { userId: string | number; uri: string; type: string; name: string }>({
      queryFn: async ({ userId, uri, type, name }, { getState }) => {
        try {
          const token = (getState() as any).app.token;
          const formData = new FormData();
          formData.append('_method', 'PUT');
          formData.append('avatar', { uri, type, name } as any);
          const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://fablead-studio.com/services/api/';
          
          const result = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${baseUrl}${API_ENDPOINTS.USERS.PROFILE(userId)}`);
            if (token) xhr.setRequestHeader('authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Accept', 'application/json');
            
            xhr.onload = () => {
              try {
                const res = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve({ data: res });
                } else {
                  resolve({ error: { status: xhr.status, data: res } });
                }
              } catch(e) {
                resolve({ error: { status: xhr.status, data: xhr.responseText } });
              }
            };
            
            xhr.onerror = () => reject(new Error('Network request failed'));
            xhr.send(formData as any);
          });
          
          return result as any;
        } catch (err: any) {
          return { error: { status: 'FETCH_ERROR', error: String(err) } };
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRegisterMutation,
  useCheckPasswordMutation,
  useSetPasswordMutation,
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
  useGetGroupVideosQuery,
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
  useUploadVideosMutation,
  useRequestDeletePhotoMutation,
  useDeletePhotosMutation,
  useLikePhotoMutation,
  useFavoritePhotoMutation,
  useUnlikePhotoMutation,
  useUnfavoritePhotoMutation,
  useAddDownloadHistoryMutation,
  useGetDashboardStatsQuery,
  useGetWatermarkSettingsQuery,
  useSaveWatermarkSettingsMutation,
  useGetBusinessSettingsQuery,
  useUpdateBusinessSettingsMutation,
  useGetPhotographerPlansQuery,
  useUpdateAvatarMutation,
  useRegisterFaceMutation,
} = appApi;
