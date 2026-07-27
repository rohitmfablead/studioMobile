import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, ImageBackground, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';
import { ChevronLeft, Check, Camera, Image as ImageIcon } from 'lucide-react-native';
import { useGetBusinessSettingsQuery, useUpdateBusinessSettingsMutation } from '../../store/apiSlice';
import { Alert } from 'react-native';
import { useState, useEffect } from 'react';

export default function FlipbookScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useGetBusinessSettingsQuery();
  const settings = data?.settings;

  const [businessName, setBusinessName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [syncPortfolio, setSyncPortfolio] = useState(false);
  const [localFile, setLocalFile] = useState<any>(null);
  
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setLocalFile(result.assets[0]);
      setLogoUrl(result.assets[0].uri);
    }
  };
  const [updateBusinessSettings, { isLoading: isSaving }] = useUpdateBusinessSettingsMutation();

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', businessName);
      formData.append('business_name', businessName);
      formData.append('flipbook_portfolio_enabled', syncPortfolio ? '1' : '0');
      formData.append('_method', 'put');

      if (localFile) {
        if (Platform.OS === 'web' && localFile.file) {
          formData.append('flipbook_logo', localFile.file);
        } else {
          formData.append('flipbook_logo', {
            uri: localFile.uri,
            name: localFile.fileName || 'flipbook_logo.png',
            type: localFile.mimeType || 'image/png'
          } as any);
        }
      }

      await updateBusinessSettings(formData).unwrap();
      Alert.alert('Success', 'Business settings updated successfully!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update settings.');
    }
  };

  useEffect(() => {
    if (settings) {
      setBusinessName(settings.business_name || '');
      setLogoUrl(settings.flipbook_logo_url || null);
      setSyncPortfolio(settings.flipbook_portfolio_enabled || false);
    }
  }, [settings]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flipbook Experience</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Check color="#fff" size={20} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FF6B00" />
          </View>
        )}
        {!isLoading && <>
        
        {/* Live Preview Wrapper */}
        <View style={styles.previewWrapper}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?auto=format&fit=crop&w=800&q=80' }} 
            style={styles.previewImageBg}
          >
            <View style={styles.previewOverlay}>
              <View style={styles.previewHeader}>
                {logoUrl ? (
                  <ImageBackground source={{ uri: logoUrl }} style={styles.mockLogo} imageStyle={{ borderRadius: 12 }} />
                ) : (
                  <View style={styles.mockLogo} />
                )}
                <Text style={styles.mockBusinessName}>{businessName || 'Your Studio'}</Text>
              </View>
              <Text style={styles.mockAlbumTitle}>Wedding Memories</Text>
              <Text style={styles.mockAlbumSubtitle}>Scroll to open album</Text>
            </View>
          </ImageBackground>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE PREVIEW</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>BRANDING SETTINGS</Text>
        
        <View style={styles.glassCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>STUDIO NAME</Text>
            <View style={styles.inputWrapper}>
              <Camera color="#A1A1AA" size={18} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Enter your Business Name" 
                placeholderTextColor="#52525B" 
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>FLIPBOOK LOGO</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
            {logoUrl ? (
               <ImageBackground source={{ uri: logoUrl }} style={{ width: 80, height: 80, alignSelf: 'center', marginBottom: 10 }} resizeMode="contain" />
            ) : (
              <View style={styles.uploadIconWrap}>
                <ImageIcon color="#FF6B00" size={24} />
              </View>
            )}
            <Text style={styles.uploadTitle}>{logoUrl ? 'Change Logo' : 'Upload Transparent Logo'}</Text>
            <Text style={styles.uploadDesc}>PNG format (Max 2MB)</Text>
          </TouchableOpacity>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Sync with Portfolio</Text>
              <Text style={styles.toggleDesc}>Use these settings across your portfolio</Text>
            </View>
            <Switch 
              value={syncPortfolio} 
              onValueChange={setSyncPortfolio}
              trackColor={{ true: '#FF6B00' }} 
            />
          </View>
        </View>
        </>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#27272A' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  saveBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center', shadowColor: '#FF6B00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  previewWrapper: { height: 350, borderRadius: 24, overflow: 'hidden', marginBottom: 30, backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A', position: 'relative' },
  previewImageBg: { width: '100%', height: '100%' },
  previewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: 25, justifyContent: 'space-between' },
  
  previewHeader: { flexDirection: 'row', alignItems: 'center' },
  mockLogo: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', marginRight: 10 },
  mockBusinessName: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  
  mockAlbumTitle: { color: '#fff', fontSize: 32, fontWeight: '800', marginTop: 'auto', marginBottom: 4 },
  mockAlbumSubtitle: { color: '#D4D4D8', fontSize: 13, letterSpacing: 1 },
  
  liveBadge: { position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444', marginRight: 6 },
  liveText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#52525B', letterSpacing: 1.5, marginBottom: 15, marginLeft: 5 },
  
  glassCard: { backgroundColor: '#18181B', borderRadius: 24, padding: 25, borderWidth: 1, borderColor: '#27272A', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 10, fontWeight: '800', color: '#71717A', letterSpacing: 1, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#09090B', borderWidth: 1, borderColor: '#27272A', borderRadius: 12, height: 48, paddingHorizontal: 15 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#fff' },
  
  uploadBox: { backgroundColor: '#09090B', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#27272A', borderStyle: 'dashed', alignItems: 'center', marginBottom: 20 },
  uploadIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255, 107, 0, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  uploadTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 4 },
  uploadDesc: { fontSize: 12, color: '#A1A1AA' },
  
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  toggleTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 2 },
  toggleDesc: { fontSize: 12, color: '#71717A' }
});
