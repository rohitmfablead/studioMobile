import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, StatusBar, Animated, Modal, Button, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';
import { Bell, QrCode, Hash, Link as LinkIcon, ChevronRight, Sparkles, Camera, Users, Calendar, Trash2, X, Image as ImageIcon, LogOut } from 'lucide-react-native';
import { useRef, useState, useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSelector } from 'react-redux';
import { useGetUserProfileQuery, useGetGroupsQuery, useDeleteGroupMutation } from '../../store/apiSlice';
import { RefreshControl, ActivityIndicator } from 'react-native';

export default function ParticipantHome() {
  const insets = useSafeAreaInsets();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const userId = useSelector((state: any) => state.app.user?.id);
  const { data: userProfileData, refetch: refetchProfile } = useGetUserProfileQuery(userId as string, { skip: !userId });
  const user = userProfileData?.user;
  
  const { data: groupsData, isLoading: isGroupsLoading, refetch: refetchGroups } = useGetGroupsQuery();
  const groups = groupsData?.groups || [];

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchGroups(),
        userId ? refetchProfile() : Promise.resolve(),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [refetchGroups, refetchProfile, userId]);

  const [deleteGroup] = useDeleteGroupMutation();

  const handleDelete = (id: string | number, isOwner: boolean) => {
    const execute = async () => {
      try {
        await deleteGroup(id).unwrap();
        refetchGroups();
      } catch (e) {
        console.error(e);
        alert(isOwner ? 'Failed to delete event' : 'Failed to leave event');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to ${isOwner ? 'delete' : 'leave'} this event?`)) {
        execute();
      }
    } else {
      Alert.alert(
        isOwner ? "Delete Event" : "Leave Event",
        isOwner ? "Are you sure you want to delete this event?" : "Are you sure you want to leave this event?",
        [
          { text: "Cancel", style: "cancel" },
          { text: isOwner ? "Delete" : "Leave", style: "destructive", onPress: execute }
        ]
      );
    }
  };
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [150, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Floating Sticky Header */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity, paddingTop: insets.top + 10 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' }} style={styles.floatingAvatar} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.floatingHeaderSub}>GOOD MORNING</Text>
            <Text style={styles.floatingHeaderTitle}>{user?.first_name || user?.name || 'Participant'}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.bellBtn, { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }]}>
          <Bell color="#111" size={20} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollContent} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />}
      >
        {/* Premium Header */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1000&auto=format&fit=crop' }} 
          style={styles.headerBackground}
        >
          <View style={[styles.headerOverlay, { paddingTop: insets.top + 20 }]}>
            <View style={styles.headerTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' }} style={styles.mainAvatar} />
                <View style={{ marginLeft: 15 }}>
                  <Text style={styles.greeting}>Hello, {user?.first_name || 'there'}!</Text>
                  <Text style={styles.subtitle}>Ready for new memories?</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.bellBtnWhite}>
                <Bell color="#fff" size={24} />
                <View style={styles.badge} />
              </TouchableOpacity>
            </View>

            {/* Quick Stats/Actions */}
            <View style={styles.statsCard}>
              <TouchableOpacity style={styles.actionItem} onPress={() => setShowQRScanner(true)}>
                <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                  <QrCode color="#0284C7" size={24} />
                </View>
                <Text style={styles.actionText}>Scan QR</Text>
              </TouchableOpacity>
              
              <View style={styles.verticalDivider} />
              
              <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/join-event')}>
                <View style={[styles.iconBox, { backgroundColor: '#FFF0E5' }]}>
                  <Hash color="#FF6B00" size={24} />
                </View>
                <Text style={styles.actionText}>Enter Code</Text>
              </TouchableOpacity>
              
              <View style={styles.verticalDivider} />
              
              <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/create-event')}>
                <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                  <LinkIcon color="#059669" size={24} />
                </View>
                <Text style={styles.actionText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={{ height: 70 }} />
        
        <View style={styles.contentPadding}>
          {/* AI Matches Card */}
        <View style={styles.matchCard}>
          <View style={styles.matchHeader}>
            <View style={styles.matchIconBadge}>
              <Sparkles color="#3B82F6" size={20} />
            </View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.matchTitle}>24 new photos found!</Text>
              <Text style={styles.matchSub}>From "Priya & Rahul Wedding"</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewPhotosBtn} onPress={() => router.push('/(participant)/my-photos')}>
            <Text style={styles.viewPhotosText}>View My Photos</Text>
            <ChevronRight color="#fff" size={18} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Events</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {isGroupsLoading ? (
          <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 40 }} />
        ) : groups.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconBox}>
              <ImageIcon color="#0284C7" size={32} />
            </View>
            <Text style={styles.emptyStateTitle}>No Events Yet</Text>
            <Text style={styles.emptyStateDesc}>You haven't joined any events. Scan a QR code or enter a link to join your first event.</Text>
            <TouchableOpacity style={styles.emptyStateBtn} onPress={() => setShowQRScanner(true)}>
              <QrCode color="#fff" size={20} />
              <Text style={styles.emptyStateBtnText}>Scan QR to Join</Text>
            </TouchableOpacity>
          </View>
        ) : (
          groups.map((item: any) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.eventCard} 
              onPress={() => router.push(`/event/${item.id}`)}
            >
              {/* Top Image Section */}
              <View style={styles.cardImageContainer}>
                <Image source={{ uri: item.coverImage || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }} style={styles.cardImage} />
                <View style={styles.badgePrivate}>
                  <Text style={styles.badgePrivateText}>private</Text>
                </View>
              </View>
              
              {/* Bottom Content Section */}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                
                <View style={styles.cardStatsRow}>
                  <View style={styles.cardStat}>
                    <Camera color="#888" size={14} />
                    <Text style={styles.cardStatText}>{item.photoCount || 0}</Text>
                  </View>
                  <View style={styles.cardStat}>
                    <Users color="#888" size={14} />
                    <Text style={styles.cardStatText}>{item.participantsCount || 1}</Text>
                  </View>
                  <View style={[styles.cardStat, { marginLeft: 'auto', marginRight: 0 }]}>
                    <Calendar color="#888" size={14} />
                    <Text style={styles.cardStatText}>{item.eventDate || 'TBD'}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.cardDeleteBtn, { backgroundColor: (item.owner?.id == userId || item.user_id == userId) ? '#FEF2F2' : '#FFF3E0' }]} 
                  onPress={() => handleDelete(item.id, item.owner?.id == userId || item.user_id == userId)}
                >
                  {(item.owner?.id == userId || item.user_id == userId) ? (
                    <>
                      <Trash2 color="#EF4444" size={14} />
                      <Text style={styles.cardDeleteText}>Delete</Text>
                    </>
                  ) : (
                    <>
                      <LogOut color="#FF6B00" size={14} />
                      <Text style={[styles.cardDeleteText, { color: '#FF6B00' }]}>Leave</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
        </View>
      </Animated.ScrollView>

      {/* QR Scanner Modal */}
      <Modal visible={showQRScanner} animationType="slide" transparent={false}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={[styles.qrHeader, { paddingTop: insets.top + 20 }]}>
            <Text style={styles.qrTitle}>Scan Event QR</Text>
            <TouchableOpacity onPress={() => setShowQRScanner(false)} style={styles.qrCloseBtn}>
              <X color="#fff" size={24} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cameraContainer}>
            {!permission ? (
              <View />
            ) : !permission.granted ? (
              <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                  <Text style={styles.permissionBtnText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={(result) => {
                  setShowQRScanner(false);
                  // Push to the event that was scanned. Assuming the QR contains the event ID.
                  router.push(`/event/${result.data}`);
                }}
              />
            )}
            
            {/* Overlay for scanning */}
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerBox} />
              <Text style={styles.scannerHint}>Align QR code within the frame</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerBackground: { width: '100%', height: 260 },
  headerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  mainAvatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)' },
  greeting: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 4, fontWeight: '500' },
  bellBtnWhite: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)' },
  bellBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  badge: { position: 'absolute', top: 10, right: 10, width: 10, height: 10, backgroundColor: '#FF3B30', borderRadius: 5, borderWidth: 2, borderColor: '#fff' },
  
  statsCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, paddingVertical: 20, paddingHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, position: 'absolute', bottom: -50, left: 20, right: 20 },
  actionItem: { flex: 1, alignItems: 'center' },
  iconBox: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionText: { fontSize: 13, fontWeight: '700', color: '#333' },
  verticalDivider: { width: 1, height: '60%', backgroundColor: '#F2F2F7', alignSelf: 'center' },

  scrollContent: { flex: 1 },
  contentPadding: { paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  seeAll: { color: '#FF6B00', fontWeight: '700', fontSize: 14 },
  
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyStateIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0F9FF', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyStateTitle: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 10 },
  emptyStateDesc: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10, marginBottom: 25 },
  emptyStateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0284C7', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, shadowColor: '#0284C7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  emptyStateBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

  matchCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 30, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10, borderWidth: 1, borderColor: 'rgba(37, 99, 235, 0.1)' },
  matchHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  matchIconBadge: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' },
  matchTitle: { fontSize: 18, fontWeight: '800', color: '#1E3A8A' },
  matchSub: { fontSize: 13, color: '#2563EB', marginTop: 4, fontWeight: '500' },
  viewPhotosBtn: { backgroundColor: '#2563EB', borderRadius: 14, flexDirection: 'row', paddingVertical: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  viewPhotosText: { color: '#fff', fontSize: 15, fontWeight: '700', marginRight: 8 },

  eventCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20, overflow: 'hidden' },
  cardImageContainer: { height: 160, width: '100%', position: 'relative' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  badgePrivate: { position: 'absolute', top: 12, right: 12, backgroundColor: '#FF6B00', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgePrivateText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'lowercase' },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 12 },
  cardStatsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardStat: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  cardStatText: { fontSize: 12, color: '#666', marginLeft: 4, fontWeight: '600' },
  cardDeleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', paddingVertical: 10, borderRadius: 8 },
  cardDeleteText: { color: '#EF4444', fontSize: 13, fontWeight: '700', marginLeft: 6 },
  
  floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.98)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 15, paddingHorizontal: 20, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  floatingAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#E5E7EB' },
  floatingHeaderSub: { fontSize: 11, color: '#6B7280', fontWeight: '700', letterSpacing: 0.5 },
  floatingHeaderTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginTop: 2 },
  
  qrHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20, zIndex: 10 },
  qrTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  qrCloseBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  cameraContainer: { flex: 1, position: 'relative', overflow: 'hidden', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  permissionBtn: { backgroundColor: '#FF6B00', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  permissionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  scannerOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' },
  scannerBox: { width: 250, height: 250, borderWidth: 3, borderColor: '#FF6B00', borderRadius: 20, backgroundColor: 'transparent' },
  scannerHint: { color: '#fff', fontSize: 16, marginTop: 40, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, overflow: 'hidden' },
});
