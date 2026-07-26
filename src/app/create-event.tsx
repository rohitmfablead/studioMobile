import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ImageBackground, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, PlayCircle, Image as ImageIcon, Heart, Briefcase, Gift, Sparkles, Users, Baby, Music, MoreHorizontal, Check } from 'lucide-react-native';
import { useState } from 'react';
import { useCreateGroupMutation } from '../store/apiSlice';
import { ActivityIndicator } from 'react-native';

const EVENT_TYPES = [
  { id: 'wedding', label: 'Wedding', icon: Heart },
  { id: 'corporate', label: 'Corporate', icon: Briefcase },
  { id: 'birthday', label: 'Birthday', icon: Gift },
  { id: 'engagement', label: 'Engagement', icon: Heart },
  { id: 'festival', label: 'Festival', icon: Sparkles },
  { id: 'reunion', label: 'Reunion', icon: Users },
  { id: 'babyshower', label: 'Baby Shower', icon: Baby },
  { id: 'concert', label: 'Concert', icon: Music },
  { id: 'other', label: 'Other', icon: MoreHorizontal },
];

export default function CreateEventScreen() {
  const [groupType, setGroupType] = useState('private');
  const [eventType, setEventType] = useState('wedding');
  const [name, setName] = useState('');
  
  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Please enter a group name");
      return;
    }
    
    try {
      const res = await createGroup({
        name,
        type: groupType,
        eventType,
        description: "",
        eventDate: "",
        location: "",
        is_platform: Platform.OS,
        monetization: { enabled: false, pricePerPhoto: 0, currency: "INR" }
      }).unwrap();
      
      if (res.success && res.group) {
        router.replace(`/(photographer)/event/${res.group.id}`);
      }
    } catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.bgImage}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={{ flex: 1 }}>
            
            {/* Custom Header */}
            <View style={[styles.header, { marginTop: Platform.OS === 'android' ? 20 : 0 }]}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                <X color="#fff" size={24} />
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Create New Group</Text>
                <Text style={styles.headerSubtitle}>Set up your event details</Text>
              </View>
              <View style={{ width: 44 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
              
              {/* Video Banner (Glassmorphism) */}
              <View style={styles.glassBanner}>
                <View style={styles.videoThumbnail}>
                  <PlayCircle color="#fff" size={36} strokeWidth={1.5} />
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>Quick Setup Guide</Text>
                  <Text style={styles.videoTime}>03:40 min</Text>
                </View>
                <TouchableOpacity style={styles.watchBtn}>
                  <Text style={styles.watchBtnText}>Watch</Text>
                </TouchableOpacity>
              </View>

              {/* Form Card */}
              <View style={styles.glassCard}>
                
                {/* Group Name & Cover Row */}
                <Text style={styles.label}>Group Name</Text>
                <TextInput 
                  style={[styles.input, name ? styles.inputActive : null]}
                  placeholder="e.g., Summer Music Fest 2026"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.label}>Cover Image <Text style={styles.optional}>(optional)</Text></Text>
                <TouchableOpacity style={styles.uploadBox}>
                  <ImageIcon color="rgba(255,255,255,0.6)" size={24} style={{marginBottom: 8}} />
                  <Text style={styles.uploadText}>Tap to upload cover image</Text>
                  <Text style={styles.uploadSub}>High resolution recommended (Max 10MB)</Text>
                </TouchableOpacity>

                {/* Group Type */}
                <Text style={styles.label}>Group Privacy</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, groupType === 'private' && styles.toggleBtnActive]}
                    onPress={() => setGroupType('private')}
                  >
                    {groupType === 'private' && <Check color="#111" size={16} style={{marginRight: 6}} />}
                    <Text style={[styles.toggleText, groupType === 'private' && styles.toggleTextActive]}>Private</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.toggleBtn, groupType === 'public' && styles.toggleBtnActive]}
                    onPress={() => setGroupType('public')}
                  >
                    {groupType === 'public' && <Check color="#111" size={16} style={{marginRight: 6}} />}
                    <Text style={[styles.toggleText, groupType === 'public' && styles.toggleTextActive]}>Public</Text>
                  </TouchableOpacity>
                </View>

                {/* Event Type Grid */}
                <Text style={styles.label}>Event Category</Text>
                <View style={styles.grid}>
                  {EVENT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isActive = eventType === type.id;
                    return (
                      <TouchableOpacity 
                        key={type.id}
                        style={[styles.gridItem, isActive && styles.gridItemActive]}
                        onPress={() => setEventType(type.id)}
                      >
                        <Icon color={isActive ? '#111' : 'rgba(255,255,255,0.6)'} size={20} style={styles.gridIcon} />
                        <Text style={[styles.gridText, isActive && styles.gridTextActive]}>{type.label}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>

              </View>
            </ScrollView>
            
            {/* Floating Footer Button */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.createBtn} onPress={handleCreate} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#111" />
                ) : (
                  <Text style={styles.createBtnText}>Create Group Now</Text>
                )}
              </TouchableOpacity>
            </View>

          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgImage: { flex: 1, width: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15 },
  headerTextContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  
  content: { flex: 1, paddingHorizontal: 20 },
  
  glassBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20,20,20,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  videoThumbnail: { width: 60, height: 60, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  videoInfo: { flex: 1 },
  videoTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  videoTime: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  watchBtn: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  watchBtnText: { color: '#111', fontSize: 14, fontWeight: '800' },
  
  glassCard: {
    backgroundColor: 'rgba(20,20,20,0.85)',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  
  label: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 12, marginTop: 20 },
  optional: { color: 'rgba(255,255,255,0.5)', fontWeight: '400', fontSize: 13 },
  
  input: {
    height: 56,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  inputActive: { borderColor: '#fff', backgroundColor: 'rgba(0,0,0,0.5)' },
  
  uploadBox: {
    height: 120,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  uploadText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  uploadSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    flexDirection: 'row',
  },
  toggleBtnActive: { backgroundColor: '#fff' },
  toggleText: { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  toggleTextActive: { color: '#111', fontWeight: '800' },
  
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  gridItem: {
    width: '31%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  gridItemActive: { backgroundColor: '#fff', borderColor: '#fff' },
  gridIcon: { marginBottom: 8 },
  gridText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  gridTextActive: { color: '#111' },
  
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  createBtn: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  createBtnText: { color: '#111', fontSize: 18, fontWeight: '800' }
});
