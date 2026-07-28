import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import { Image, ImageBackground } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Check, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, Copy, Download, FolderOpen, Heart, Image as ImageIcon, LayoutGrid, Link as LinkIcon, MessageCircle, PlayCircle, Plus, QrCode, ScanFace, Settings, Share2, Trash2, Upload, UploadCloud, Users, Video, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, FlatList, Linking, Modal, RefreshControl, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Photo, useAddDownloadHistoryMutation, useDeletePhotosMutation, useFavoritePhotoMutation, useGetGroupDetailsQuery, useGetGroupFoldersQuery, useGetGroupParticipantsMatchedQuery, useGetGroupPhotoDeleteRequestsQuery, useGetGroupPhotosQuery, useGetGroupVideoDeleteRequestsQuery, useGetGroupVideosQuery, useLikePhotoMutation, useMatchMyPhotosMutation, useRequestDeletePhotoMutation, useUnfavoritePhotoMutation, useUnlikePhotoMutation, useUploadPhotosMutation, useUploadVideosMutation } from '../../../store/apiSlice';
import { router, useLocalSearchParams } from '../../../utils/routerShim';
import { toast } from '../../../utils/toast';

const { width } = Dimensions.get('window');

export default function PhotographerEventGallery() {
  const { id } = useLocalSearchParams();
  const { data: detailsData, isLoading: isDetailsLoading, refetch: refetchDetails } = useGetGroupDetailsQuery(id as string);
  const group = detailsData?.group;
  const userId = useSelector((state: any) => state.app.user?.id);
  const isOwner = group?.owner?.id == userId || (group as any)?.user_id == userId;

  const [page, setPage] = useState(1);
  const [renderLimit, setRenderLimit] = useState(18);
  const isFetchingRef = useRef(false);

  const { data: photosData, isLoading: isPhotosLoading, isFetching: isPhotosFetching, refetch: refetchPhotos } = useGetGroupPhotosQuery({
    id: id as string,
    params: { sortBy: 'created_at', sortOrder: 'desc', limit: 30, page }
  });
  const { data: videosData, isLoading: isVideosLoading, refetch: refetchVideos } = useGetGroupVideosQuery(
    { id: id as string, params: { page, limit: 30 } },
    { skip: !id }
  );

  const PHOTOS = photosData?.data?.photos || [];
  const VIDEOS = videosData?.data?.videos || [];

  useEffect(() => {
    if (activeTab === 'videos') {
      console.log('DEBUG VIDEOS DATA:', {
        rawResponse: videosData,
        extractedVideosLength: VIDEOS.length,
        isLoading: isVideosLoading
      });
    }
  }, [videosData, activeTab, isVideosLoading]);

  useEffect(() => {
    isFetchingRef.current = isPhotosFetching;
  }, [isPhotosFetching]);

  const [activeTab, setActiveTab] = useState('all');
  const tabsScrollRef = useRef<ScrollView>(null);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const tabMeasurements = useRef<{ [key: string]: { x: number, width: number } }>({}).current;

  const handleTabLayout = (tabKey: string, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    tabMeasurements[tabKey] = { x, width };
    if (activeTab === tabKey && scrollViewWidth) {
      const scrollPosition = x + (width / 2) - (scrollViewWidth / 2);
      tabsScrollRef.current?.scrollTo({ x: Math.max(0, scrollPosition), animated: true });
    }
  };

  useEffect(() => {
    if (activeTab && tabMeasurements[activeTab] && scrollViewWidth) {
      const { x, width } = tabMeasurements[activeTab];
      const scrollPosition = x + (width / 2) - (scrollViewWidth / 2);
      tabsScrollRef.current?.scrollTo({ x: Math.max(0, scrollPosition), animated: true });
    }
  }, [activeTab, scrollViewWidth]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const shareUrl = group?.inviteLink || group?.invite_link || `https://fablead-studio.com/join/${id}`;
  const shareCode = group?.joinCode || group?.inviteCode || group?.invite_code || id;

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(shareUrl);
    toast.success('Link Copied!', 'Share link copied to clipboard.');
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(shareCode as string);
    toast.success('Code Copied!', 'Join code copied to clipboard.');
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Join our photo gallery on FabStudio! Link: ${shareUrl} or use code: ${shareCode}`,
        url: shareUrl,
        title: `Join ${group?.name || 'Group'}`
      });
    } catch (error: any) {
      toast.error('Share Failed', error.message);
    }
  };

  const [likePhoto] = useLikePhotoMutation();
  const [favoritePhoto] = useFavoritePhotoMutation();
  const [unlikePhoto] = useUnlikePhotoMutation();
  const [unfavoritePhoto] = useUnfavoritePhotoMutation();
  const [addDownloadHistory] = useAddDownloadHistoryMutation();
  const [deletePhotos] = useDeletePhotosMutation();
  const [requestDeletePhoto] = useRequestDeletePhotoMutation();

  const handleRequestDelete = (photoId: number) => {
    Alert.prompt(
      "Request Deletion",
      "Please provide a reason for deleting this photo:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit Request",
          onPress: async (reason) => {
            if (!reason) {
              toast.error('Error', 'A reason is required to submit a delete request.');
              return;
            }
            try {
              await requestDeletePhoto({ id: id as string, photoId: photoId.toString(), reason }).unwrap();
              toast.success('Submitted', 'Delete request submitted successfully!');
            } catch (err) {
              console.error(err);
              toast.error('Error', 'Failed to submit delete request.');
            }
          }
        }
      ],
      "plain-text"
    );
  };

  const handleLikeSelected = async () => {
    if (selectedPhotos.length === 0) return;
    try {
      await Promise.all(selectedPhotos.map(async (photoId) => {
        const results = await Promise.allSettled([
          likePhoto(photoId).unwrap(),
          favoritePhoto(photoId).unwrap()
        ]);
        console.log(`LIKE results for photo ${photoId}:`, results);
      }));
      toast.success('Liked!', 'Selected photos liked successfully.');
      setSelectedPhotos([]);
      setIsSelecting(false);
      refetchPhotos();
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to like some photos.');
    }
  };

  const handleUnlikeSelected = async () => {
    if (selectedPhotos.length === 0) return;
    try {
      await Promise.all(selectedPhotos.map(async (photoId) => {
        const results = await Promise.allSettled([
          unlikePhoto(photoId).unwrap(),
          unfavoritePhoto(photoId).unwrap()
        ]);
        console.log(`UNLIKE results for photo ${photoId}:`, results);
      }));
      toast.success('Unliked!', 'Selected photos unliked successfully.');
      setSelectedPhotos([]);
      setIsSelecting(false);
      refetchPhotos();
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to unlike some photos.');
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPhotos.length === 0) return;

    Alert.alert(
      "Delete Photos",
      `Are you sure you want to delete ${selectedPhotos.length} photos?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePhotos({ photoIds: selectedPhotos.map(String) }).unwrap();
              toast.success('Deleted!', 'Photos deleted successfully.');
              setSelectedPhotos([]);
              setIsSelecting(false);
              refetchPhotos();
            } catch (err) {
              console.error(err);
              toast.error('Error', 'Failed to delete photos.');
            }
          }
        }
      ]
    );
  };

  const handleLikePhoto = async (photoId: number) => {
    const photo = PHOTOS.find((p: any) => p.id === photoId);
    if (!photo) return;
    const isCurrentlyLiked = photo.isLiked || photo.liked || photo.likes_count > 0;

    try {
      if (isCurrentlyLiked) {
        const results = await Promise.allSettled([
          unlikePhoto(photoId).unwrap(),
          unfavoritePhoto(photoId).unwrap()
        ]);
        console.log(`UNLIKE single photo ${photoId} results:`, results);
      } else {
        const results = await Promise.allSettled([
          likePhoto(photoId).unwrap(),
          favoritePhoto(photoId).unwrap()
        ]);
        console.log(`LIKE single photo ${photoId} results:`, results);
      }
      refetchPhotos();
    } catch (e) {
      console.error(e);
      toast.error('Error', 'Failed to update like status.');
    }
  };

  const handleDownloadPhoto = async (photo: any) => {
    const downloadUrl = `https://fablead-studio.com/services/api/photos/${photo.id}/download?no_watermark=1`;
    try {
      const MediaLibrary = require('expo-media-library');
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission denied');
      }

      const ext = photo.format === 'mp4' || photo.format === 'mov' ? photo.format : 'jpg';
      const fileUri = `${FileSystem.documentDirectory}download_${photo.id}.${ext}`;

      const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri);
      await MediaLibrary.saveToLibraryAsync(downloadRes.uri);

      await addDownloadHistory({
        group_id: id as string,
        participants_id: userId as string,
        photo_id: [String(photo.id)],
        file_type: photo.format === 'mp4' || photo.format === 'mov' ? 'video' : 'photo',
        download_type: 'unique'
      }).unwrap();

      toast.success('Downloaded!', 'File saved to your device gallery.');
    } catch (e) {
      console.log('Native download failed, falling back to web', e);
      import('react-native').then(RN => RN.Linking.openURL(downloadUrl));

      try {
        await addDownloadHistory({
          group_id: id as string,
          participants_id: userId as string,
          photo_id: [String(photo.id)],
          file_type: photo.format === 'mp4' || photo.format === 'mov' ? 'video' : 'photo',
          download_type: 'unique'
        }).unwrap();
      } catch (err) { }
    }
  };
  const [showQrModal, setShowQrModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [showDownloadConfirmModal, setShowDownloadConfirmModal] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [matchMessage, setMatchMessage] = useState('');
  const [matchedPhotos, setMatchedPhotos] = useState<any[]>([]);

  const { data: foldersData, error: foldersError, isLoading: isLoadingFolders } = useGetGroupFoldersQuery(id as string);
  const folders = foldersData?.data || [];

  const [matchMyPhotos, { isLoading: isMatching }] = useMatchMyPhotosMutation();

  const [hasFetchedMyPhotos, setHasFetchedMyPhotos] = useState(false);

  useEffect(() => {
    if (activeTab === 'my-photos' && !hasFetchedMyPhotos && !isMatching) {
      setHasFetchedMyPhotos(true);
      matchMyPhotos(id as string).unwrap().then(res => {
        setMatchMessage(res.message || 'Face matched successfully');
        if (res.photos) {
          setMatchedPhotos(res.photos);
        }
      }).catch(e => {
        setMatchMessage('Failed to match photos');
      });
    }
  }, [activeTab, hasFetchedMyPhotos]);

  const { data: participantsData, isLoading: isLoadingParticipants, refetch: refetchParticipants } = useGetGroupParticipantsMatchedQuery(id as string, { skip: activeTab !== 'participants' });
  const participants = participantsData?.data || [];

  const { data: photoDeleteRes, isLoading: loadingPhotoDelete, refetch: refetchPhotoDelete } = useGetGroupPhotoDeleteRequestsQuery(
    { id: id as string, params: { status: 'pending', page: 1, limit: 20 } },
    { skip: activeTab !== 'delete' }
  );
  const { data: videoDeleteRes, isLoading: loadingVideoDelete, refetch: refetchVideoDelete } = useGetGroupVideoDeleteRequestsQuery(
    { id: id as string, params: { status: 'pending', page: 1, limit: 20 } },
    { skip: activeTab !== 'delete' }
  );

  const deleteRequests = [...(photoDeleteRes?.data || []), ...(videoDeleteRes?.data || [])];
  const isLoadingDelete = loadingPhotoDelete || loadingVideoDelete;

  const isLoading = isDetailsLoading || isPhotosLoading || isVideosLoading;

  const [uploadPhotosMutation] = useUploadPhotosMutation();
  const [uploadVideosMutation] = useUploadVideosMutation();
  const insets = useSafeAreaInsets();
  const [selectedUploadAssets, setSelectedUploadAssets] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'images' | 'videos'>('images');

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: uploadType === 'videos' ? 'videos' : 'images',
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedUploadAssets(prev => [...prev, ...result.assets]);
    }
  };

  const [bulkProgress, setBulkProgress] = useState<number | null>(null);

  const handleUpload = async () => {
    if (selectedUploadAssets.length === 0) return;
    setIsUploading(true);
    setBulkProgress(0);

    try {
      const uploadPayload = {
        id: id as string,
        assets: selectedUploadAssets,
        enable_watermark: '0',
        no_watermark: '1',
        is_platform: 'mobile',
        onProgress: (p: number) => setBulkProgress(p)
      };

      const res = await (uploadType === 'videos'
        ? uploadVideosMutation(uploadPayload).unwrap()
        : uploadPhotosMutation(uploadPayload).unwrap());

      if (!res.error) {
        setSelectedUploadAssets([]);
        setShowUploadModal(false);
        setBulkProgress(null);
        if (uploadType === 'videos') refetchVideos();
        else refetchPhotos();
      } else {
        alert(`Some ${uploadType === 'videos' ? 'videos' : 'photos'} failed to upload. Please try again.`);
        setBulkProgress(null);
      }
    } catch (error) {
      console.error("Upload error: ", error);
      alert(`Failed to upload ${uploadType === 'videos' ? 'videos' : 'photos'}.`);
      setBulkProgress(null);
    }

    setIsUploading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchDetails(),
        refetchPhotos(),
        refetchVideos(),
        activeTab === 'participants' ? refetchParticipants() : Promise.resolve(),
        activeTab === 'delete' ? Promise.all([refetchPhotoDelete(), refetchVideoDelete()]) : Promise.resolve()
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchDetails, refetchPhotos, refetchParticipants, refetchPhotoDelete, refetchVideoDelete, activeTab]);

  const toggleSelection = (photoId: number) => {
    setSelectedPhotos(prev => prev.includes(photoId) ? prev.filter(p => p !== photoId) : [...prev, photoId]);
  };

  const handleSelectAll = () => {
    setSelectedPhotos(PHOTOS.map(p => p.id));
  };

  const renderPhotoItem = ({ item, isVideo = false }: { item: Photo, isVideo?: boolean }) => {
    const isSelected = selectedPhotos.includes(item.id);
    return (
      <TouchableOpacity
        style={{ flex: 1 / 2, padding: 1, position: 'relative' }}
        onPress={() => {
          if (isSelecting) {
            toggleSelection(item.id);
          } else {
            if (isVideo) {
              Linking.openURL(item.url).catch(err => {
                console.error("Failed to play video: ", err);
                Alert.alert("Error", "Could not play this video.");
              });
            } else {
              const idx = PHOTOS.findIndex((p) => p.id === item.id);
              if (idx !== -1) setPreviewIndex(idx);
            }
          }
        }}
      >
        <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#eee', overflow: 'hidden' }}>
          <Image source={{ uri: item.thumbnail_url || item.url }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={200} cachePolicy="memory-disk" />
          {isVideo && (
            <View style={styles.videoPlayOverlay}>
              <PlayCircle color="#fff" size={40} style={{ opacity: 0.9 }} strokeWidth={1.5} />
            </View>
          )}
        </View>

        {isSelecting && (
          <View style={[styles.checkboxOverlay, isSelected && styles.checkboxOverlayActive]}>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Check color="#fff" size={14} strokeWidth={3} />}
            </View>
          </View>
        )}

        {!isSelecting && (
          <>
            <View style={styles.photoActionsRow}>
              <TouchableOpacity
                style={[styles.photoActionMicroBtn, { width: 'auto', paddingHorizontal: 8, flexDirection: 'row', gap: 4 }]}
                onPress={() => handleLikePhoto(item.id)}
              >
                <Heart color={(item.isLiked || item.liked || item.likes_count > 0) ? "#FF3B30" : "#fff"} fill={(item.isLiked || item.liked || item.likes_count > 0) ? "#FF3B30" : "transparent"} size={12} />
                {item.likes_count > 0 && <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{item.likes_count}</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoActionMicroBtn, { width: 'auto', paddingHorizontal: 8, flexDirection: 'row', gap: 4 }]}
                onPress={() => handleDownloadPhoto(item)}
              >
                <Download color="#fff" size={12} />
              </TouchableOpacity>
              {item.comments_count > 0 && (
                <TouchableOpacity style={[styles.photoActionMicroBtn, { width: 'auto', paddingHorizontal: 8, flexDirection: 'row', gap: 4 }]}>
                  <MessageCircle color="#fff" size={12} />
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{item.comments_count}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Client Selection Badge */}
            {item.is_selected_by_client && (
              <View style={{ position: 'absolute', top: 6, right: 6, backgroundColor: '#34C759', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Check color="#fff" size={10} strokeWidth={3} />
                <Text style={{ color: '#fff', fontSize: 8, fontWeight: 'bold', marginLeft: 2 }}>SELECTED</Text>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [150, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 200;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
          if (renderLimit < PHOTOS.length) {
            setRenderLimit(prev => prev + 18);
          } else if (!isFetchingRef.current && PHOTOS.length >= page * 50) {
            setPage(prev => prev + 1);
            setRenderLimit(prev => prev + 18);
          }
        }
      }
    }
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity, paddingTop: insets.top }]}>
        <View style={styles.floatingHeaderContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={[styles.floatingBackBtn, styles.headerIconBg]} onPress={() => router.back()}>
              <ChevronLeft color="#111" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerCenter} pointerEvents="none">
            <Text style={styles.floatingTitle} numberOfLines={1}>{group?.name || 'Loading...'}</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBg} onPress={() => setShowShareModal(true)}>
              <Share2 color="#111" size={18} />
            </TouchableOpacity>
            {isOwner && (
              <TouchableOpacity style={styles.headerIconBg} onPress={() => router.push(`/(main)/event/${id}/settings`)}>
                <Settings color="#111" size={18} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF6B00" />
        </View>
      ) : (
        <>
          <Animated.ScrollView
            style={{ flex: 1 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />}
          >
            {/* Immersive Cover */}
            <ImageBackground
              source={{ uri: group?.coverImage || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }}
              style={[styles.cover, { paddingTop: insets.top }]} contentFit="cover"
            >
              <View style={styles.overlay} />

              <View style={styles.headerTop}>
                <TouchableOpacity style={styles.iconBtnBlur} onPress={() => router.back()}>
                  <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
              </View>

              <View style={styles.headerBottom}>
                <Text style={styles.eventTitle}>{group?.name || 'Event'}</Text>
                <Text style={styles.eventSubtitle}>{group?.eventDate || 'TBD'} • {group?.photoCount || 0} Photos</Text>
              </View>
            </ImageBackground>

            {/* Main Action Bar (Select, Share, Settings, Chat) */}
            <View style={styles.iconActionBar}>
              <TouchableOpacity
                style={[styles.actionItem, PHOTOS.length === 0 && { opacity: 0.3 }]}
                onPress={() => { setIsSelecting(!isSelecting); setSelectedPhotos([]); }}
                disabled={PHOTOS.length === 0}
              >
                <View style={[styles.actionCircle, isSelecting && { backgroundColor: '#333', borderColor: '#333' }]}><CheckSquare color={isSelecting ? "#fff" : "#111"} size={22} /></View>
              </TouchableOpacity>

              {isOwner && isSelecting && selectedPhotos.length > 0 && (
                <TouchableOpacity style={styles.actionItem} onPress={handleDeleteSelected}>
                  <View style={[styles.actionCircle, { borderColor: '#FF3B30' }]}><Trash2 color="#FF3B30" size={22} /></View>
                </TouchableOpacity>
              )}

              {isOwner && (
                <TouchableOpacity
                  style={[styles.actionItem, PHOTOS.length === 0 && { opacity: 0.3 }]}
                  onPress={() => setShowDownloadConfirmModal(true)}
                  disabled={PHOTOS.length === 0}
                >
                  <View style={styles.actionCircle}><Download color="#111" size={22} /></View>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.actionItem} onPress={() => setShowShareModal(true)}>
                <View style={styles.actionCircle}><Share2 color="#111" size={22} /></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => router.push(`/(main)/event/${id}/chat`)}>
                <View style={styles.actionCircle}><MessageCircle color="#111" size={22} /></View>
              </TouchableOpacity>
              {isOwner && (
                <TouchableOpacity style={styles.actionItem} onPress={() => router.push(`/(main)/event/${id}/settings`)}>
                  <View style={styles.actionCircle}><Settings color="#111" size={22} /></View>
                </TouchableOpacity>
              )}
            </View>

            {/* Scrollable Tabs */}
            {PHOTOS.length > 0 && (
              <View style={styles.tabWrapper}>
                <ScrollView
                  ref={tabsScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tabContainer}
                  onLayout={(e) => setScrollViewWidth(e.nativeEvent.layout.width)}
                >
                  <TouchableOpacity style={[styles.tab, activeTab === 'all' && styles.activeTab]} onPress={() => setActiveTab('all')} onLayout={(e) => handleTabLayout('all', e)}>
                    <LayoutGrid color={activeTab === 'all' ? "#fff" : "#666"} size={16} />
                    <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Photos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tab, activeTab === 'liked' && styles.activeTab]} onPress={() => setActiveTab('liked')} onLayout={(e) => handleTabLayout('liked', e)}>
                    <Heart color={activeTab === 'liked' ? "#fff" : "#666"} size={16} />
                    <Text style={[styles.tabText, activeTab === 'liked' && styles.activeTabText]}>Liked</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tab, activeTab === 'my-photos' && styles.activeTab]} onPress={() => setActiveTab('my-photos')} onLayout={(e) => handleTabLayout('my-photos', e)}>
                    <ImageIcon color={activeTab === 'my-photos' ? "#fff" : "#666"} size={16} />
                    <Text style={[styles.tabText, activeTab === 'my-photos' && styles.activeTabText]}>My Photos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tab, activeTab === 'participants' && styles.activeTab]} onPress={() => setActiveTab('participants')} onLayout={(e) => handleTabLayout('participants', e)}>
                    <Users color={activeTab === 'participants' ? "#fff" : "#666"} size={16} />
                    <Text style={[styles.tabText, activeTab === 'participants' && styles.activeTabText]}>Participants</Text>
                  </TouchableOpacity>
                  {foldersError && (
                    <View style={[styles.tab, { backgroundColor: '#FFE4E6' }]}>
                      <Text style={{ color: '#E11D48', fontSize: 12 }}>Folder Auth Error (401)</Text>
                    </View>
                  )}
                  {folders.map((folder: any) => (
                    <TouchableOpacity key={folder.id} style={[styles.tab, activeTab === `folder_${folder.id}` && styles.activeTab]} onPress={() => setActiveTab(`folder_${folder.id}`)} onLayout={(e) => handleTabLayout(`folder_${folder.id}`, e)}>
                      <FolderOpen color={activeTab === `folder_${folder.id}` ? "#fff" : "#666"} size={16} />
                      <Text style={[styles.tabText, activeTab === `folder_${folder.id}` && styles.activeTabText]}>{folder.name}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={[styles.tab, activeTab === 'videos' && styles.activeTab]} onPress={() => setActiveTab('videos')} onLayout={(e) => handleTabLayout('videos', e)}>
                    <Video color={activeTab === 'videos' ? "#fff" : "#666"} size={16} />
                    <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>Videos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tab, activeTab === 'delete' && styles.activeTab]} onPress={() => setActiveTab('delete')} onLayout={(e) => handleTabLayout('delete', e)}>
                    <Trash2 color={activeTab === 'delete' ? "#fff" : "#666"} size={16} />
                    <Text style={[styles.tabText, activeTab === 'delete' && styles.activeTabText]}>Delete Requests</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}

            {/* Grid Content */}
            <View style={styles.content}>
              {activeTab === 'all' && (
                PHOTOS.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7389/7389146.png' }} style={styles.emptyIcon} contentFit="contain" />
                    <Text style={styles.emptyTitle}>No photos yet</Text>
                    <Text style={styles.emptySub}>Tap Upload to start sharing moments.</Text>
                    <TouchableOpacity style={styles.uploadBtn} onPress={() => setShowUploadModal(true)}>
                      <UploadCloud color="#fff" size={20} />
                      <Text style={styles.uploadText}>Upload Photos</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <FlatList
                      data={PHOTOS.slice(0, renderLimit)}
                      numColumns={2}
                      scrollEnabled={false}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={(props) => renderPhotoItem(props)}
                    />
                    {isPhotosFetching && page > 1 && (
                      <View style={{ padding: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="small" color="#FF6B00" />
                      </View>
                    )}
                  </>
                )
              )}

              {activeTab === 'liked' && (
                (() => {
                  const likedPhotos = PHOTOS.filter((p: any) => p.isLiked || p.liked || p.likes_count > 0);
                  console.log("DEBUG LIKED PHOTOS - Total PHOTOS:", PHOTOS.length, "Liked count:", likedPhotos.length);
                  if (PHOTOS.length > 0) {
                    console.log("Entire First Photo Object from API:", JSON.stringify(PHOTOS[0], null, 2));
                  }

                  return likedPhotos.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Heart color="#ccc" size={48} style={{ marginBottom: 16 }} />
                      <Text style={styles.emptyTitle}>No Liked Photos</Text>
                      <Text style={styles.emptySub}>Photos you or participants like will appear here.</Text>
                    </View>
                  ) : (
                    <>
                      <FlatList
                        data={likedPhotos.slice(0, renderLimit)}
                        numColumns={2}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={(props) => renderPhotoItem(props)}
                      />
                    </>
                  );
                })()
              )}

              {activeTab === 'my-photos' && (
                <View style={{ flex: 1 }}>
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <TouchableOpacity
                      style={[styles.uploadBtn, { backgroundColor: '#FF6B00' }]}
                      onPress={async () => {
                        try {
                          const res = await matchMyPhotos(id as string).unwrap();
                          setMatchMessage(res.message || 'Face matched successfully');
                          if (res.photos) {
                            setMatchedPhotos(res.photos);
                          }
                        } catch (e) {
                          setMatchMessage('Failed to match photos');
                        }
                      }}
                      disabled={isMatching}
                    >
                      <ScanFace color="#fff" size={20} />
                      {isMatching ? <ActivityIndicator color="#fff" style={{ marginLeft: 8 }} /> : <Text style={styles.uploadText}>Match My Photos</Text>}
                    </TouchableOpacity>
                    {matchMessage ? <Text style={{ marginTop: 15, textAlign: 'center', color: '#111', fontWeight: 'bold' }}>{matchMessage}</Text> : null}
                  </View>
                  {matchedPhotos.length > 0 ? (
                    <FlatList
                      data={matchedPhotos}
                      numColumns={2}
                      scrollEnabled={false}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={(props) => renderPhotoItem(props)}
                    />
                  ) : null}
                </View>
              )}

              {activeTab === 'participants' && (
                <FlatList
                  data={participants}
                  keyExtractor={(item: any) => item.id.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.participantItem}>
                      <View style={styles.avatarWrap}>
                        {item.avatar ? (
                          <Image source={{ uri: item.avatar }} style={{ width: '100%', height: '100%', borderRadius: 20 }} contentFit="cover" />
                        ) : (
                          <Users color="#fff" size={20} />
                        )}
                      </View>
                      <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={styles.participantName}>{item.name}</Text>
                        <Text style={styles.participantRole}>Matches: {item.matched_photos_count || 0}</Text>
                      </View>
                      <TouchableOpacity style={styles.participantBtn}><Text style={styles.participantBtnText}>Remove</Text></TouchableOpacity>
                    </View>
                  )}
                  contentContainerStyle={{ padding: 20 }}
                  ListEmptyComponent={isLoadingParticipants ? <ActivityIndicator size="large" color="#FF6B00" /> : <Text style={{ textAlign: 'center', marginTop: 20 }}>No participants found.</Text>}
                />
              )}

              {activeTab === 'videos' && (
                <FlatList
                  data={VIDEOS}
                  numColumns={2}
                  scrollEnabled={false}
                  keyExtractor={(item: any) => item.id.toString()}
                  renderItem={({ item }) => renderPhotoItem({ item, isVideo: true })}
                />
              )}

              {activeTab === 'delete' && (
                isLoadingDelete ? (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <ActivityIndicator size="large" color="#FF6B00" />
                  </View>
                ) : deleteRequests.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Trash2 color="#ccc" size={60} style={{ marginBottom: 20 }} />
                    <Text style={styles.emptyTitle}>No Delete Requests</Text>
                    <Text style={styles.emptySub}>All good here!</Text>
                  </View>
                ) : (
                  <FlatList
                    data={deleteRequests}
                    keyExtractor={(item: any, index) => item?.id?.toString() || index.toString()}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <View style={[styles.participantItem, { justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            source={{ uri: item?.photo?.thumbnail_url || item?.video?.thumbnail_url || 'https://via.placeholder.com/50' }}
                            style={{ width: 50, height: 50, borderRadius: 8, backgroundColor: '#eee' }}
                          />
                          <View style={{ marginLeft: 15 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>Request #{item?.id}</Text>
                            <Text style={{ fontSize: 13, color: '#FF3B30', marginTop: 4 }}>Pending Review</Text>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                )
              )}

              {activeTab.startsWith('folder_') && (
                <View style={styles.emptyState}>
                  <FolderOpen color="#ccc" size={60} style={{ marginBottom: 20 }} />
                  <Text style={styles.emptyTitle}>Folder Empty</Text>
                  <Text style={styles.emptySub}>This folder does not have any photos yet.</Text>
                </View>
              )}
            </View>
          </Animated.ScrollView>

          {/* Floating Bottom Selection Bar */}
          {isSelecting && (
            <View style={styles.floatingSelectionBar}>
              <Text style={styles.selectionText}>{selectedPhotos.length} Selected</Text>
              <View style={{ flex: 1, overflow: 'hidden' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.selectionActions, { paddingRight: 15 }]}>
                  {selectedPhotos.length === PHOTOS.length ? (
                    <TouchableOpacity style={styles.selBtn} onPress={() => setSelectedPhotos([])}>
                      <Text style={styles.selBtnText}>Deselect All ({PHOTOS.length})</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.selBtn} onPress={handleSelectAll}>
                      <Text style={styles.selBtnText}>Select All ({PHOTOS.length})</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.selBtn} onPress={handleLikeSelected}>
                    <Text style={styles.selBtnText}>Favorite</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selBtn} onPress={handleUnlikeSelected}>
                    <Text style={styles.selBtnText}>Unlike</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selBtn} onPress={handleDeleteSelected}>
                    <Text style={[styles.selBtnText, { color: '#FF3B30' }]}>Delete</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          )}

          {/* Share Modal */}
          <Modal visible={showShareModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderLeft}>
                    <View style={styles.shareIconBg}><Share2 color="#FF6B00" size={24} /></View>
                    <View style={{ marginLeft: 15 }}>
                      <Text style={styles.modalTitle}>Share Album</Text>
                      <Text style={styles.modalSubtitle}>Invite others to view photos</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setShowShareModal(false)}>
                    <X color="#333" size={24} />
                  </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                  <View style={styles.infoHeader}>
                    <Users color="#FF6B00" size={20} />
                    <Text style={styles.infoCardTitle}>What can users do with the share link?</Text>
                  </View>
                  <View style={styles.bulletItem}><View style={styles.bullet} /><Text style={styles.bulletText}>View all photos and videos in the album</Text></View>
                  <View style={styles.bulletItem}><View style={styles.bullet} /><Text style={styles.bulletText}>Download photos (if permitted by owner)</Text></View>
                  <View style={styles.bulletItem}><View style={styles.bullet} /><Text style={styles.bulletText}>Like and favorite their favorite moments</Text></View>
                  <View style={styles.bulletItem}><View style={styles.bullet} /><Text style={styles.bulletText}>Use AI face matching to find their photos</Text></View>
                </View>

                <View style={styles.videoBanner}>
                  <View style={styles.videoLeft}>
                    <View style={styles.videoThumb}><PlayCircle color="#FF0000" size={24} /></View>
                    <View style={{ marginLeft: 15 }}>
                      <Text style={styles.videoTitle}>How to Share Group</Text>
                      <Text style={styles.videoSub}>01:30 min</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.watchBtn}>
                    <Text style={styles.watchBtnText}>Watch Video</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.shareActionRow}>
                  <TouchableOpacity style={styles.shareActionBtn} onPress={handleCopyLink}>
                    <LinkIcon color="#FF6B00" size={18} />
                    <Text style={styles.shareActionText}>Copy Link</Text>
                    <Copy color="#666" size={14} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareActionBtn} onPress={handleCopyCode}>
                    <Users color="#FF6B00" size={18} />
                    <Text style={styles.shareActionText}>Copy Code</Text>
                    <Copy color="#666" size={14} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareActionBtn} onPress={() => { setShowShareModal(false); setShowQrModal(true); }}>
                    <QrCode color="#FF6B00" size={18} />
                    <Text style={styles.shareActionText}>Scan QR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* QR Modal */}
          <Modal visible={showQrModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Invite Participants</Text>
                  <TouchableOpacity onPress={() => setShowQrModal(false)}>
                    <X color="#333" size={24} />
                  </TouchableOpacity>
                </View>

                <View style={styles.proTipCard}>
                  <Text style={styles.proTipText}><Text style={{ fontWeight: 'bold', color: '#FF6B00' }}>PRO TIP:</Text> Make photo sharing effortless—print this QR code on visiting cards for your event guests.</Text>
                </View>

                <View style={styles.qrContainer}>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg' }} style={styles.qrImage} contentFit="contain" />
                </View>

                <View style={styles.urlBox}>
                  <Text style={styles.urlText} numberOfLines={1}>{shareUrl}</Text>
                  <TouchableOpacity style={styles.copyBox} onPress={handleCopyLink}>
                    <Copy color="#666" size={18} />
                  </TouchableOpacity>
                </View>

                <View style={styles.qrActionsRow}>
                  <TouchableOpacity style={styles.qrShareBtn} onPress={handleShareLink}>
                    <Share2 color="#fff" size={18} />
                    <Text style={styles.qrShareBtnText}>Share Link</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.qrGetBtn}>
                    <Download color="#fff" size={18} />
                    <Text style={styles.qrGetBtnText}>Get QR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* Download Confirm Modal */}
          <Modal visible={showDownloadConfirmModal} transparent animationType="fade">
            <View style={styles.modalOverlayCenter}>
              <View style={styles.confirmModalCard}>
                <View style={styles.confirmIconWrap}>
                  <Download color="#FF6B00" size={28} />
                </View>
                <Text style={styles.confirmTitle}>Download Event</Text>
                <Text style={styles.confirmSub}>Are you sure you want to download all available photos and videos from this event?</Text>

                <View style={styles.confirmBtnRow}>
                  <TouchableOpacity style={styles.confirmCancelBtn} onPress={() => setShowDownloadConfirmModal(false)}>
                    <Text style={styles.confirmCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmActionBtn} onPress={() => setShowDownloadConfirmModal(false)}>
                    <Text style={styles.confirmActionText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Image Lightbox Modal */}
          <Modal visible={previewIndex !== null} transparent animationType="fade">
            {previewIndex !== null && PHOTOS[previewIndex] && (
              <View style={styles.lightboxContainer}>
                <View style={[styles.lightboxHeader, { paddingTop: insets.top + 15 }]}>
                  <Text style={styles.lightboxCounter}>
                    {previewIndex !== null ? `${previewIndex + 1} / ${PHOTOS.length}` : ''}
                  </Text>
                  <View style={styles.lightboxActions}>
                    {!isOwner && (
                      <TouchableOpacity style={styles.lightboxBtn} onPress={() => handleRequestDelete(PHOTOS[previewIndex!].id)}>
                        <Trash2 color="#fff" size={24} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.lightboxBtn} onPress={() => handleDownloadPhoto(PHOTOS[previewIndex!])}>
                      <Download color="#fff" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.lightboxBtn} onPress={() => handleLikePhoto(PHOTOS[previewIndex!].id)}>
                      <Heart
                        color={PHOTOS[previewIndex!].isLiked ? "#FF3B30" : "#fff"}
                        fill={PHOTOS[previewIndex!].isLiked ? "#FF3B30" : "transparent"}
                        size={24}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.lightboxBtn} onPress={() => setPreviewIndex(null)}>
                      <X color="#fff" size={28} />
                    </TouchableOpacity>
                  </View>
                </View>
                {previewIndex !== null && (
                  <Image
                    source={{ uri: PHOTOS[previewIndex].url }}
                    style={styles.lightboxImage} contentFit="contain"
                    resizeMode="contain"
                  />
                )}
                {previewIndex !== null && previewIndex > 0 && (
                  <TouchableOpacity style={[styles.lightboxArrow, { left: 20 }]} onPress={() => setPreviewIndex(previewIndex - 1)}>
                    <ChevronLeft color="#fff" size={36} />
                  </TouchableOpacity>
                )}
                {previewIndex !== null && previewIndex < PHOTOS.length - 1 && (
                  <TouchableOpacity style={[styles.lightboxArrow, { right: 20 }]} onPress={() => setPreviewIndex(previewIndex + 1)}>
                    <ChevronRight color="#fff" size={36} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Modal>

          {/* Upload Modal */}
          <Modal visible={showUploadModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 15 }}>
                <View style={styles.uploadModalCard}>
                  <View style={styles.uploadHeader}>
                    <View style={styles.modalHeaderLeft}>
                      <UploadCloud color="#FF6B00" size={24} style={{ marginRight: 10 }} />
                      <Text style={styles.uploadTitle}>Upload to {group?.name || 'Event'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {/* <View style={styles.uploadVideoBanner}>
                    <PlayCircle color="#fff" fill="#111" size={24} />
                    <View style={{marginLeft: 8, marginRight: 12}}>
                      <Text style={styles.uploadVideoTitle}>Photo Upload Guide</Text>
                      <Text style={styles.uploadVideoSub}>00:30 min</Text>
                    </View>
                    <TouchableOpacity style={styles.uploadWatchBtn}>
                      <Text style={styles.uploadWatchText}>Watch Video</Text>
                    </TouchableOpacity>
                  </View> */}
                      <TouchableOpacity onPress={() => setShowUploadModal(false)} style={{ marginLeft: 15 }}>
                        <X color="#666" size={24} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.uploadTabs}>
                    <TouchableOpacity
                      style={[styles.uploadTab, uploadType === 'images' && styles.uploadTabActive]}
                      onPress={() => { setUploadType('images'); setSelectedUploadAssets([]); }}
                    >
                      <ImageIcon color={uploadType === 'images' ? "#FF6B00" : "#888"} size={18} />
                      <Text style={uploadType === 'images' ? styles.uploadTabTextActive : styles.uploadTabText}>Images</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.uploadTab, uploadType === 'videos' && styles.uploadTabActive]}
                      onPress={() => { setUploadType('videos'); setSelectedUploadAssets([]); }}
                    >
                      <Video color={uploadType === 'videos' ? "#FF6B00" : "#888"} size={18} />
                      <Text style={uploadType === 'videos' ? styles.uploadTabTextActive : styles.uploadTabText}>Videos</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.uploadFolderSec}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <FolderOpen color="#FF6B00" size={14} style={{ marginRight: 6 }} />
                      <Text style={styles.uploadFolderLabel}>UPLOAD TO FOLDER (OPTIONAL)</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={styles.uploadDropdown}>
                        <Text style={styles.uploadDropdownText}>No Folder (Root)</Text>
                        <ChevronDown color="#666" size={20} />
                      </View>
                      <TouchableOpacity style={styles.uploadCreateBtn}>
                        <Plus color="#fff" size={16} style={{ marginRight: 4 }} />
                        <Text style={styles.uploadCreateText}>Create</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {selectedUploadAssets.length > 0 ? (
                    <View style={[styles.uploadDropZone, { alignItems: 'stretch', paddingHorizontal: 0, paddingVertical: 0 }]}>
                      <ScrollView
                        showsVerticalScrollIndicator={true}
                        style={{ width: '100%', maxHeight: 300 }}
                      >
                        {selectedUploadAssets.map((asset, index) => {
                          const fileName = asset.fileName || asset.uri.split('/').pop() || `photo_${index + 1}.jpg`;
                          const fileSize = asset.fileSize ? (asset.fileSize / 1024).toFixed(2) + ' KB' : '';

                          return (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' }}>
                              <Text style={{ flex: 1, color: '#105B9C', fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{fileName}</Text>

                              <Text style={{ color: '#6B7280', fontSize: 13, marginRight: 24 }}>{fileSize}</Text>

                              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                                <Text style={{ color: isUploading ? '#FF6B00' : '#6B7280', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginRight: 10 }}>UPLOAD</Text>
                                <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: isUploading ? '#FF6B00' : '#D1D5DB', overflow: 'hidden', justifyContent: 'flex-end' }}>
                                  {isUploading && bulkProgress !== null && (
                                    <View style={{ width: '100%', height: `${bulkProgress}%`, backgroundColor: '#FF6B00' }} />
                                  )}
                                </View>
                              </View>

                              {!isUploading && (
                                <TouchableOpacity onPress={() => setSelectedUploadAssets(prev => prev.filter((_, i) => i !== index))}>
                                  <X color="#4B5563" size={16} strokeWidth={1.5} />
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        })}
                      </ScrollView>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.uploadDropZone} onPress={pickMedia}>
                      <View style={styles.uploadDropIconWrap}>
                        <UploadCloud color="#444" size={28} />
                      </View>
                      <Text style={styles.uploadDropTitle}>Tap to browse {uploadType === 'videos' ? 'videos' : 'photos'}</Text>
                      <Text style={styles.uploadDropSub}>Supports {uploadType === 'videos' ? 'MP4, MOV' : 'JPG, PNG, WEBP'}</Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.uploadFooter}>
                    <Text style={styles.uploadFooterText}>
                      {selectedUploadAssets.length > 0 ? `${selectedUploadAssets.length} file(s) ready` : 'No files selected'}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity style={styles.uploadAddBtn} onPress={pickMedia}>
                        <ImageIcon color="#111" size={16} style={{ marginRight: 6 }} />
                        <Text style={styles.uploadAddText}>Add More</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.uploadSubmitBtn, (selectedUploadAssets.length === 0 || isUploading) && { opacity: 0.5 }]}
                        onPress={handleUpload}
                        disabled={selectedUploadAssets.length === 0 || isUploading}
                      >
                        {isUploading ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ActivityIndicator size="small" color="#fff" />
                            {bulkProgress !== null && (
                              <Text style={{ color: '#fff', marginLeft: 8, fontWeight: 'bold' }}>{bulkProgress}%</Text>
                            )}
                          </View>
                        ) : (
                          <>
                            <Upload color="#fff" size={16} style={{ marginRight: 6 }} />
                            <Text style={styles.uploadSubmitText}>Upload</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </SafeAreaView>
            </View>
          </Modal>

          {/* Sticky Upload FAB */}
          {!(activeTab === 'all' && PHOTOS.length === 0) && (
            <TouchableOpacity
              style={[styles.fabBtn, isSelecting && { bottom: 100 }]}
              onPress={() => setShowUploadModal(true)}
            >
              <UploadCloud color="#fff" size={26} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  cover: { width: '100%', height: 240, justifyContent: 'space-between' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },

  headerTop: { flexDirection: 'row', paddingHorizontal: 15, marginTop: 10 },
  iconBtnBlur: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  headerBottom: { padding: 20 },
  eventTitle: { color: '#fff', fontSize: 32, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  eventSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 15, marginTop: 4 },

  iconActionBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  actionItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  actionCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },

  floatingSelectionBar: { position: 'absolute', bottom: 30, left: 15, right: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingLeft: 15, backgroundColor: '#333', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, overflow: 'hidden' },
  selectionText: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginRight: 15 },
  selectionActions: { alignItems: 'center' },
  selBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  selBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  tabWrapper: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  tabContainer: { padding: 15, paddingRight: 30, flexDirection: 'row', alignItems: 'center' },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F2F2F7', marginRight: 10 },
  activeTab: { backgroundColor: '#333' },
  tabText: { color: '#666', fontWeight: '600', marginLeft: 6 },
  activeTabText: { color: '#fff' },

  content: { flex: 1, backgroundColor: '#fff', minHeight: Dimensions.get('window').height },

  floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 100, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  floatingHeaderContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 15, minHeight: 60 },
  headerLeft: { zIndex: 10 },
  headerCenter: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 15, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10 },
  headerIconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  floatingBackBtn: {},
  floatingTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', textAlign: 'center' },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 },
  emptyIcon: { width: 80, height: 80, opacity: 0.3, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptySub: { fontSize: 15, color: '#8E8E93', textAlign: 'center', marginBottom: 20 },

  participantItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#fff', padding: 15, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1, borderWidth: 1, borderColor: '#F2F2F7' },
  avatarWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center' },
  participantName: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  participantRole: { fontSize: 13, color: '#666', marginTop: 2 },
  participantBtn: { backgroundColor: '#FFF5F0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  participantBtnText: { color: '#FF6B00', fontWeight: 'bold', fontSize: 12 },
  videoPlayOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },

  photoActionsRow: { position: 'absolute', top: 6, left: 6, flexDirection: 'row', zIndex: 10 },
  photoActionMicroBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', marginLeft: 4 },

  checkboxOverlay: { position: 'absolute', top: 6, right: 6, zIndex: 10 },
  checkboxOverlayActive: {},
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#fff', backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 2 },
  checkboxSelected: { backgroundColor: '#FF6B00', borderColor: '#FF6B00' },

  uploadBtn: { backgroundColor: '#007AFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 14, borderRadius: 25 },
  uploadText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },

  /* Lightbox Styles */
  lightboxContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  lightboxHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, zIndex: 10 },
  lightboxCounter: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  lightboxActions: { flexDirection: 'row', alignItems: 'center' },
  lightboxBtn: { marginLeft: 25 },
  lightboxImage: { width: '100%', height: '100%' },
  lightboxArrow: { position: 'absolute', top: '50%', marginTop: -25, width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },

  /* Modal Styles */
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  confirmModalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 25, width: '100%', maxWidth: 340, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  confirmIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF5F0', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  confirmTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  confirmSub: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 25 },
  confirmBtnRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  confirmCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F2F2F7', alignItems: 'center', marginRight: 10 },
  confirmCancelText: { fontSize: 15, fontWeight: 'bold', color: '#666' },
  confirmActionBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#FF6B00', alignItems: 'center' },
  confirmActionText: { fontSize: 15, fontWeight: 'bold', color: '#fff' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  shareIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF0E5', justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  modalSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },

  infoCard: { backgroundColor: '#FAFAFA', borderRadius: 12, padding: 15, marginBottom: 15 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginLeft: 10 },
  bulletItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingRight: 20 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF6B00', marginRight: 10 },
  bulletText: { fontSize: 14, color: '#444' },

  videoBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF9F5', borderRadius: 12, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#FFE4CC' },
  videoLeft: { flexDirection: 'row', alignItems: 'center' },
  videoThumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  videoTitle: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  videoSub: { fontSize: 13, color: '#666', marginTop: 2 },
  watchBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  watchBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  shareActionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  shareActionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 10, marginHorizontal: 4 },
  shareActionText: { color: '#FF6B00', fontWeight: '600', fontSize: 13, marginLeft: 6 },

  proTipCard: { backgroundColor: '#FFF9F5', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#FFE4CC', marginBottom: 20 },
  proTipText: { color: '#D9534F', fontSize: 14, lineHeight: 20 },

  qrContainer: { alignItems: 'center', marginBottom: 20, padding: 20, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#E5E5EA' },
  qrImage: { width: 200, height: 200 },

  urlBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 10, overflow: 'hidden', marginBottom: 20 },
  urlText: { flex: 1, padding: 15, color: '#333', fontSize: 14 },
  copyBox: { padding: 15, backgroundColor: '#F8F8F8', borderLeftWidth: 1, borderLeftColor: '#E5E5EA' },

  qrActionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  qrShareBtn: { flex: 1, backgroundColor: '#FF6B00', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10, marginRight: 10 },
  qrShareBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  qrGetBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },

  fabBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 999,
  },

  uploadModalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, width: '100%', maxWidth: 700, alignSelf: 'center' },
  uploadHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  uploadTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  uploadVideoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5F0', padding: 6, paddingRight: 10, borderRadius: 30, borderWidth: 1, borderColor: '#FFE4CC' },
  uploadVideoTitle: { fontSize: 12, fontWeight: 'bold', color: '#111' },
  uploadVideoSub: { fontSize: 10, color: '#666' },
  uploadWatchBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  uploadWatchText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  uploadTabs: { flexDirection: 'row', backgroundColor: '#F9FAFB', borderRadius: 10, padding: 4, marginBottom: 20 },
  uploadTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  uploadTabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
  uploadTabText: { fontSize: 14, fontWeight: '600', color: '#666', marginLeft: 8 },
  uploadTabTextActive: { fontSize: 14, fontWeight: '600', color: '#FF6B00', marginLeft: 8 },

  uploadFolderSec: { marginBottom: 20 },
  uploadFolderLabel: { fontSize: 11, fontWeight: 'bold', color: '#666' },
  uploadDropdown: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, height: 44, marginRight: 10 },
  uploadDropdownText: { fontSize: 14, color: '#111' },
  uploadCreateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B00', height: 44, paddingHorizontal: 16, borderRadius: 8 },
  uploadCreateText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  uploadDropZone: { borderWidth: 1.5, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 40, alignItems: 'center', marginBottom: 20 },
  uploadDropIconWrap: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
  uploadDropTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 5 },
  uploadDropSub: { fontSize: 14, color: '#666', marginBottom: 10 },
  uploadDropNote: { fontSize: 12, color: '#999' },

  uploadFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F2F2F7', paddingTop: 15 },
  uploadFooterText: { fontSize: 13, color: '#666' },
  uploadAddBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 10 },
  uploadAddText: { fontSize: 13, fontWeight: 'bold', color: '#111' },
  uploadSubmitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B00', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  uploadSubmitText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },
});
