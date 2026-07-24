import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Edit3, Link as LinkIcon, EyeOff, ScanFace, Lock, Globe, Users, CheckCircle2 } from 'lucide-react-native';

export default function PrivacySettings() {
  const { id } = useLocalSearchParams();
  const [canChangeName, setCanChangeName] = useState(false);
  const [linkJoin, setLinkJoin] = useState(true);
  const [anonView, setAnonView] = useState(false);
  const [liveness, setLiveness] = useState(false);
  
  const [photoAccess, setPhotoAccess] = useState('Small'); // Small, Big
  const [uploadPerm, setUploadPerm] = useState('All'); // Select, All

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Privacy Settings</Text>
            <Text style={styles.headerSubtitle}>Configure access controls and permissions</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Group Access & Joining */}
        <Text style={styles.sectionTitle}>
          <Globe color="#8E8E93" size={14} style={{marginRight: 6}} /> GROUP ACCESS & JOINING
        </Text>
        <View style={styles.switchGrid}>
          <View style={styles.switchCard}>
            <View style={styles.switchLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F0F5FF' }]}>
                <Edit3 color="#3B82F6" size={16} />
              </View>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Anyone can change Name and Icon</Text>
                <Text style={styles.switchSub}>Allow all members to edit group name and icon</Text>
              </View>
            </View>
            <Switch value={canChangeName} onValueChange={setCanChangeName} trackColor={{ false: '#E5E5EA', true: '#FF6B00' }} />
          </View>
          
          <View style={styles.switchCard}>
            <View style={styles.switchLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                <LinkIcon color="#10B981" size={16} />
              </View>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Anyone with link can join</Text>
                <Text style={styles.switchSub}>Users with the group link can join without invitation</Text>
              </View>
            </View>
            <Switch value={linkJoin} onValueChange={setLinkJoin} trackColor={{ false: '#E5E5EA', true: '#FF6B00' }} />
          </View>

          <View style={styles.switchCard}>
            <View style={styles.switchLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
                <EyeOff color="#8B5CF6" size={16} />
              </View>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Anonymous Viewing</Text>
                <Text style={styles.switchSub}>Users can join and view group photos without Login</Text>
              </View>
            </View>
            <Switch value={anonView} onValueChange={setAnonView} trackColor={{ false: '#E5E5EA', true: '#FF6B00' }} />
          </View>

          <View style={styles.switchCard}>
            <View style={styles.switchLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                <ScanFace color="#F97316" size={16} />
              </View>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Liveness Detection</Text>
                <Text style={styles.switchSub}>Verify real users with facial liveness detection</Text>
              </View>
            </View>
            <Switch value={liveness} onValueChange={setLiveness} trackColor={{ false: '#E5E5EA', true: '#FF6B00' }} />
          </View>
        </View>

        {/* Photo Access */}
        <Text style={styles.sectionTitle}>
          <Lock color="#8E8E93" size={14} style={{marginRight: 6}} /> PHOTO ACCESS (READ ONLY)
        </Text>
        <View style={styles.cardsRow}>
          <TouchableOpacity style={[styles.selectionCard, photoAccess === 'Small' && styles.selectionCardActive]} onPress={() => setPhotoAccess('Small')}>
            <View style={[styles.cardIconBox, { backgroundColor: photoAccess === 'Small' ? '#FFB075' : '#E5E7EB' }]}>
              <Lock color="#fff" size={18} />
            </View>
            <Text style={[styles.scTitle, photoAccess === 'Small' && { color: '#111' }]}>Small Personal Group</Text>
            <Text style={styles.scSub}>Private access for selected members only</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectionCard, photoAccess === 'Big' && styles.selectionCardActive]} onPress={() => setPhotoAccess('Big')}>
             <View style={[styles.cardIconBox, { backgroundColor: photoAccess === 'Big' ? '#FFB075' : '#E5E7EB' }]}>
              <Globe color="#666" size={18} />
            </View>
            <Text style={[styles.scTitle, photoAccess === 'Big' && { color: '#111' }]}>Big Public Group</Text>
            <Text style={styles.scSub}>Open access for everyone to view photos</Text>
          </TouchableOpacity>
        </View>

        {/* Upload Permission */}
        <Text style={styles.sectionTitle}>
          <Users color="#8E8E93" size={14} style={{marginRight: 6}} /> UPLOAD PERMISSION
        </Text>
        <View style={styles.cardsRow}>
          <TouchableOpacity style={[styles.selectionCard, uploadPerm === 'Select' && styles.selectionCardActive]} onPress={() => setUploadPerm('Select')}>
            <View style={[styles.cardIconBox, { backgroundColor: uploadPerm === 'Select' ? '#FFB075' : '#E5E7EB' }]}>
              <Users color="#666" size={18} />
            </View>
            <Text style={[styles.scTitle, uploadPerm === 'Select' && { color: '#111' }]}>Select Users</Text>
            <Text style={styles.scSub}>Only selected users can upload photos</Text>
            {uploadPerm === 'Select' && <CheckCircle2 color="#FF6B00" size={16} style={styles.scCheck} />}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectionCard, uploadPerm === 'All' && styles.selectionCardActive]} onPress={() => setUploadPerm('All')}>
             <View style={[styles.cardIconBox, { backgroundColor: uploadPerm === 'All' ? '#FF6B00' : '#E5E7EB' }]}>
              <Users color="#fff" size={18} />
            </View>
            <Text style={[styles.scTitle, uploadPerm === 'All' && { color: '#111' }]}>All Participants</Text>
            <Text style={styles.scSub}>Every member can upload photos</Text>
            {uploadPerm === 'All' && <CheckCircle2 color="#FF6B00" size={16} style={styles.scCheck} />}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backBtn: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  headerSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  saveBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  content: { flex: 1, padding: 15 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#8E8E93', marginBottom: 12, marginTop: 20, flexDirection: 'row', alignItems: 'center' },
  
  switchGrid: { marginBottom: 10 },
  switchCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 10 },
  switchLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 },
  iconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  switchTextContainer: { flex: 1 },
  switchTitle: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  switchSub: { fontSize: 11, color: '#666', lineHeight: 14 },

  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  selectionCard: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 15, position: 'relative', backgroundColor: '#fff' },
  selectionCardActive: { borderColor: '#FF6B00', backgroundColor: '#FFF9F2' },
  cardIconBox: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  scTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 4 },
  scSub: { fontSize: 11, color: '#888', lineHeight: 16 },
  scCheck: { position: 'absolute', top: 12, right: 12 },
});
