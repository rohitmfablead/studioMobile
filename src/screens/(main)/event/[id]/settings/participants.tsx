import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from '../../../../../utils/routerShim';
import { ChevronLeft, Search, MoreVertical, Trash2, LogOut, UserPlus, Shield } from 'lucide-react-native';

export default function ParticipantsSettings() {
  const isLoading = false;

  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('All');
  
  const [participantsData, set_participantsData] = useState<any>({});
  
  const participants = participantsData?.participants || [];
  const totalParticipants = participantsData?.total || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.headerBackground}
      >
        <View style={styles.headerOverlay}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Participants</Text>
            <Text style={styles.headerSubtitle}>Manage group members and their permissions</Text>
          </View>
        </View>
      </ImageBackground>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>
        
        {/* Action Buttons */}
        <View style={styles.actionRow}>
           <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: '#FF3B30' }]}>
             <Trash2 color="#FF3B30" size={14} style={{marginRight: 6}} />
             <Text style={[styles.actionBtnOutlineText, { color: '#FF3B30' }]}>Delete Group</Text>
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.actionBtnOutline}>
             <LogOut color="#333" size={14} style={{marginRight: 6}} />
             <Text style={styles.actionBtnOutlineText}>Leave</Text>
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.actionBtnSolid}>
             <UserPlus color="#fff" size={14} style={{marginRight: 6}} />
             <Text style={styles.actionBtnSolidText}>Invite</Text>
           </TouchableOpacity>
        </View>

        {/* Search & Filter Row */}
        <View style={styles.searchFilterRow}>
          <View style={styles.searchBox}>
            <Search color="#999" size={18} />
            <TextInput placeholder="Search participants..." style={styles.searchInput} />
          </View>

          <View style={styles.filterTabs}>
            {['All', 'Admins', 'Members', 'Blocked'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)} 
                style={[styles.filterTab, activeTab === tab && styles.filterTabActive]}
              >
                <Text style={[styles.filterTabText, activeTab === tab && styles.filterTabTextActive]}>{tab}</Text>
                <View style={[styles.badge, activeTab === tab && styles.badgeActive]}>
                  <Text style={[styles.badgeText, activeTab === tab && styles.badgeTextActive]}>
                    {tab === 'All' ? totalParticipants : '0'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* List Container */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <Text style={{ padding: 20, textAlign: 'center', color: '#666' }}>Loading participants...</Text>
          ) : participants.length === 0 ? (
            <Text style={{ padding: 20, textAlign: 'center', color: '#666' }}>No participants found.</Text>
          ) : (
            participants.map((user: any, index: number) => (
              <View key={user.id || index} style={[styles.userRow, index !== participants.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#F2F2F7' }]}>
                <Image source={{ uri: user.avatar || 'https://i.pravatar.cc/150' }} style={styles.userAvatar} />
                <View style={styles.userInfo}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.userName}>{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}</Text>
                    <View style={styles.personIcon}>
                      {user.role === 'owner' ? <Shield color="#2563EB" size={12} /> : <UserPlus color="#999" size={10} />}
                    </View>
                  </View>
                  <Text style={styles.userEmail}>{user.email || 'No email'}</Text>
                </View>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user.role === 'owner' ? 'Owner' : 'Member'}</Text>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                  <MoreVertical color="#999" size={18} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <Text style={styles.footerText}>Showing {participants.length} of {totalParticipants} participants</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: { width: '100%', height: 160 },
  headerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 15, paddingTop: 15, justifyContent: 'space-between' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { padding: 4, flexDirection: 'row', alignItems: 'center' },
  headerContent: { paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  
  content: { flex: 1, padding: 15 },
  
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginBottom: 20 },
  actionBtnOutline: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff' },
  actionBtnOutlineText: { fontSize: 13, fontWeight: '600', color: '#333' },
  actionBtnSolid: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  actionBtnSolidText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  searchFilterRow: { gap: 15, marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#111' },
  
  filterTabs: { flexDirection: 'row', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#F2F2F7' },
  filterTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8 },
  filterTabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  filterTabText: { fontSize: 12, color: '#666', fontWeight: '500' },
  filterTabTextActive: { color: '#111', fontWeight: '600' },
  badge: { backgroundColor: '#F2F2F7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginLeft: 6 },
  badgeActive: { backgroundColor: '#2563EB' },
  badgeText: { fontSize: 10, fontWeight: '600', color: '#666' },
  badgeTextActive: { color: '#fff' },

  listContainer: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden', marginBottom: 15 },
  userRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  userAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '700', color: '#111' },
  personIcon: { marginLeft: 6 },
  userEmail: { fontSize: 12, color: '#888', marginTop: 2 },
  roleBadge: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 10 },
  roleText: { fontSize: 11, fontWeight: '600', color: '#555' },
  moreBtn: { padding: 4 },

  footerText: { fontSize: 12, color: '#888', marginTop: 5 },
});
