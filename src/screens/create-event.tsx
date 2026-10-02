import { router } from '../utils/routerShim';
import { X, PlayCircle, Image as ImageIcon, Heart, Briefcase, Gift, Sparkles, Users, Baby, Music, MoreHorizontal, Check } from 'lucide-react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Image, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, ScrollView, View, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const isLoading = false;
  const [groupType, setGroupType] = useState('private');
  const [eventType, setEventType] = useState('wedding');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const createGroup = async (args?: any) => { console.log("Mock mutation:", args); return { data: {} }; };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      if (result.assets[0].base64) {
        setCoverImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      } else {
        setCoverImage(result.assets[0].uri);
      }
    }
  };

  const handleCreate = async () => {
    setNameError(''); // clear any previous error
    if (!name.trim()) {
      setNameError('Please enter a group name');
      return;
    }
    
    try {
      const dataToSubmit: any = {
        name,
        type: groupType,
        eventType,
        description: "",
        eventDate: "",
        location: "",
        is_platform: Platform.OS,
        monetization: {
          enabled: false,
          pricePerPhoto: 0,
          currency: "INR",
          clientAlbumSelection: false,
          maxSelections: 0,
          watermarkText: ""
        }
      };

      if (coverImage) {
        dataToSubmit.cover_image = coverImage;
      }
      
      const res = await createGroup(dataToSubmit);
      
      if (res.success || res.group || res.data) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.back();
        }, 1500);
      }
    } catch (error: any) {
      console.error('Failed to create group:', error);
      alert(error?.data?.message || 'Failed to create group. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Main Container */}
      <SafeAreaView style={{ flex: 1 }}>

        {/* Custom Header */}
        <View style={[styles.header, { marginTop: Platform.OS === 'android' ? 40 : 0 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <X color="#111" size={24} />
          </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Create New Group</Text>
                <Text style={styles.headerSubtitle}>Set up your event details</Text>
              </View>
              <View style={{ width: 44 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
              

              {/* Form Card */}
              <View style={styles.glassCard}>
                
                {/* Group Name & Cover Row */}
                <Text style={styles.label}>Group Name</Text>
                <TextInput 
                  style={[styles.input, name ? styles.inputActive : null, nameError ? styles.inputError : null]}
                  placeholder="e.g., Summer Music Fest 2026"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (nameError) setNameError('');
                  }}
                  selectionColor="#2563EB"
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

                <Text style={styles.label}>Cover Image <Text style={styles.optional}>(optional)</Text></Text>
                <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                  {coverImage ? (
                    <Image source={{ uri: coverImage }} style={{ width: '100%', height: '100%', borderRadius: 14 }} />
                  ) : (
                    <>
                      <ImageIcon color="#2563EB" size={24} style={{marginBottom: 8}} />
                      <Text style={styles.uploadText}>Tap to upload cover image</Text>
                      <Text style={styles.uploadSub}>High resolution recommended (Max 10MB)</Text>
                    </>
                  )}
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
                        <Icon color={isActive ? '#2563EB' : '#666'} size={20} style={styles.gridIcon} />
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

          {/* Success Modal */}
          {showSuccess && (
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
              <View style={styles.successCard}>
                <View style={styles.successIconRing}>
                  <Check color="#fff" size={40} strokeWidth={3} />
                </View>
                <Text style={styles.successTitle}>Success!</Text>
                <Text style={styles.successDesc}>Group created successfully.</Text>
              </View>
            </View>
          )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15 },
  headerTextContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  headerSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E5EA' },
  
  content: { flex: 1, paddingHorizontal: 20 },
  
  glassBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  videoThumbnail: { width: 60, height: 60, backgroundColor: '#fff', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 15, borderWidth: 1, borderColor: '#E5E5EA' },
  videoInfo: { flex: 1 },
  videoTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 4 },
  videoTime: { fontSize: 13, color: '#666', fontWeight: '500' },
  watchBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  watchBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  
  glassCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  
  label: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 12, marginTop: 20 },
  optional: { color: '#999', fontWeight: '400', fontSize: 13 },
  
  input: {
    height: 56,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  inputActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  inputError: { borderColor: '#FF3B30', backgroundColor: '#FFF2F2' },
  errorText: { color: '#FF3B30', fontSize: 13, marginTop: 6, marginLeft: 4, fontWeight: '500' },
  
  uploadBox: {
    height: 120,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  uploadText: { fontSize: 14, fontWeight: '700', color: '#111' },
  uploadSub: { fontSize: 12, color: '#999', marginTop: 4 },
  
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    flexDirection: 'row',
  },
  toggleBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 15, fontWeight: '600', color: '#666' },
  toggleTextActive: { color: '#2563EB', fontWeight: '800' },
  
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
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  gridItemActive: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  gridIcon: { marginBottom: 8 },
  gridText: { fontSize: 12, fontWeight: '700', color: '#666' },
  gridTextActive: { color: '#2563EB' },
  
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  createBtn: {
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  createBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 8 },
  successDesc: { fontSize: 15, color: '#666', textAlign: 'center' }
});
