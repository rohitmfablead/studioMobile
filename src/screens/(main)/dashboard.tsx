import { Bell, Calendar, Camera, Image as ImageIcon, LogOut, Plus, Trash2, Users } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Image, ImageBackground, Platform, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useDeleteGroupMutation, useGetGroupsQuery, useGetUserProfileQuery } from '../../store/apiSlice';
import { router } from '../../utils/routerShim';

export default function PhotographerDashboard() {
  const userId = useSelector((state: any) => state.app.user?.id);
  const userRole = useSelector((state: any) => state.app.user?.role);
  const isPhotographer = userRole === 'photographer';
  
  const { data: userProfileData, refetch: refetchProfile } = useGetUserProfileQuery(userId as string, { skip: !userId });
  const user = userProfileData?.user;

  const insets = useSafeAreaInsets();
  const { data: groupsData, isLoading, refetch: refetchGroups } = useGetGroupsQuery();
  const EVENTS = groupsData?.groups || [];

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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string | number, isOwner: boolean } | null>(null);

  const handleDelete = (id: string | number, isOwner: boolean) => {
    setItemToDelete({ id, isOwner });
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteGroup(itemToDelete.id).unwrap();
      refetchGroups();
    } catch (e) {
      console.error(e);
      alert(itemToDelete.isOwner ? 'Failed to delete event' : 'Failed to leave event');
    } finally {
      setDeleteModalVisible(false);
      setItemToDelete(null);
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
          <Image source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }} style={styles.floatingAvatar} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.floatingHeaderSub}>GOOD MORNING</Text>
            <Text style={styles.floatingHeaderTitle}>{user?.first_name || user?.name || 'Photographer'}</Text>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />
        }
      >
        {/* Premium Header */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1000&auto=format&fit=crop' }}
          style={styles.headerBackground}
        >
          <View style={[styles.headerOverlay, { paddingTop: insets.top + 20 }]}>
            <View style={styles.headerTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }} style={styles.mainAvatar} />
                <View style={{ marginLeft: 15 }}>
                  <Text style={styles.greeting}>Hello, {user?.first_name || 'there'}!</Text>
                  <Text style={styles.subtitle}>Welcome back to your studio</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.bellBtnWhite}>
                <Bell color="#fff" size={24} />
                <View style={styles.badge} />
              </TouchableOpacity>
            </View>

            {/* Quick Stats/Actions */}
            <View style={styles.statsCard}>
              <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/create-event')}>
                <View style={[styles.iconBox, { backgroundColor: '#FFF0E5' }]}>
                  <Plus color="#FF6B00" size={24} />
                </View>
                <Text style={styles.actionText}>New Group</Text>
              </TouchableOpacity>
              <View style={styles.verticalDivider} />

              <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/join-event')}>
                <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                  <Users color="#0284C7" size={24} />
                </View>
                <Text style={styles.actionText}>Join Group</Text>
              </TouchableOpacity>

              {isPhotographer && (
                <>
                  <View style={styles.verticalDivider} />
                  <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/storage')}>
                    <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
                      <ImageIcon color="#8B5CF6" size={24} />
                    </View>
                    <Text style={styles.actionText}>Storage</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ImageBackground>

        <View style={{ height: 70 }} />

        <View style={styles.contentPadding}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color="#FF6B00" size="large" />
          ) : EVENTS.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIconBox}>
                <ImageIcon color="#FF6B00" size={32} />
              </View>
              <Text style={styles.emptyStateTitle}>No Events Yet</Text>
              <Text style={styles.emptyStateDesc}>You haven't joined or created any events yet. Create or join a group to get started.</Text>
              <TouchableOpacity style={styles.emptyStateBtn} onPress={() => router.push('/create-event')}>
                <Plus color="#fff" size={20} />
                <Text style={styles.emptyStateBtnText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          ) : (
            EVENTS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.eventCard}
                onPress={() => router.push(`/(main)/event/${item.id}`)}
              >
                {/* Top Image Section */}
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: item.coverImage || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }} style={styles.cardImage} />
                  <View style={styles.badgePrivate}>
                    <Text style={styles.badgePrivateText}>{item.type}</Text>
                  </View>
                </View>

                {/* Bottom Content Section */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.name}</Text>

                  <View style={styles.cardStatsRow}>
                    <View style={styles.cardStat}>
                      <Camera color="#888" size={14} />
                      <Text style={styles.cardStatText}>{item.photoCount}</Text>
                    </View>
                    <View style={styles.cardStat}>
                      <Users color="#888" size={14} />
                      <Text style={styles.cardStatText}>{item.memberCount}</Text>
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
            )))}
        </View>
      </Animated.ScrollView>

      {/* Custom Delete Confirmation Modal */}
      {deleteModalVisible && (
        <View style={{
          position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
          top: 0, left: 0,
          width: Platform.OS === 'web' ? '100vw' as any : Dimensions.get('window').width,
          height: Platform.OS === 'web' ? '100vh' as any : Dimensions.get('window').height,
          zIndex: 999999,
          elevation: 999999,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteIconRing}>
              <Trash2 color="#EF4444" size={32} />
            </View>
            <Text style={styles.deleteModalTitle}>
              {itemToDelete?.isOwner ? 'Delete Event' : 'Leave Event'}
            </Text>
            <Text style={styles.deleteModalDesc}>
              {itemToDelete?.isOwner
                ? 'Are you sure you want to delete this event? This action cannot be undone.'
                : 'Are you sure you want to leave this event?'}
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setItemToDelete(null);
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmDelete}>
                <Text style={styles.confirmBtnText}>{itemToDelete?.isOwner ? 'Delete' : 'Leave'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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
  emptyStateIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF0E5', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyStateTitle: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 10 },
  emptyStateDesc: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10, marginBottom: 25 },
  emptyStateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B00', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, shadowColor: '#FF6B00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  emptyStateBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

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

  deleteModalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 30, alignItems: 'center', width: '100%', maxWidth: 320, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  deleteIconRing: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  deleteModalTitle: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 10 },
  deleteModalDesc: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  deleteModalActions: { flexDirection: 'row', width: '100%', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, backgroundColor: '#F2F2F7', borderRadius: 12, alignItems: 'center', marginRight: 6 },
  cancelBtnText: { color: '#333', fontSize: 15, fontWeight: '700' },
  confirmBtn: { flex: 1, paddingVertical: 14, backgroundColor: '#EF4444', borderRadius: 12, alignItems: 'center', marginLeft: 6 },
  confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' }
});
