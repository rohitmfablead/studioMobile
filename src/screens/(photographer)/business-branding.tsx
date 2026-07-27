import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';
import { ChevronLeft, Camera, Upload, Briefcase, Globe, Phone, CheckCircle, Share2, Link, Video } from 'lucide-react-native';

export default function BusinessBrandingScreen() {
  const insets = useSafeAreaInsets();

  const renderInput = (icon: any, placeholder: string, label: string) => {
    const Icon = icon;
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputWrapper}>
          <Icon color="#A1A1AA" size={18} style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#52525B" />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Identity</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <CheckCircle color="#10B981" size={20} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Logo Section */}
          <View style={styles.glassCard}>
            <View style={styles.cardHeader}>
              <Briefcase color="#EC4899" size={20} />
              <Text style={styles.cardTitle}>Primary Logo</Text>
            </View>
            <Text style={styles.cardDesc}>Upload your brand mark. This will be visible across all your client galleries.</Text>
            
            <View style={styles.logoUploadArea}>
              <View style={styles.logoPreview}>
                <Camera color="#71717A" size={32} />
              </View>
              <TouchableOpacity style={styles.uploadBtn}>
                <Upload color="#fff" size={14} />
                <Text style={styles.uploadBtnText}>Upload New</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Details */}
          <View style={styles.glassCard}>
            <View style={styles.cardHeader}>
              <Phone color="#3B82F6" size={20} />
              <Text style={styles.cardTitle}>Contact Details</Text>
            </View>
            
            {renderInput(Briefcase, 'Studio Name', 'BUSINESS NAME')}
            {renderInput(Phone, '+91 98765 43210', 'PHONE NUMBER')}
            {renderInput(Globe, 'yourstudio.com', 'WEBSITE')}
            
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Show in Gallery</Text>
                <Text style={styles.toggleDesc}>Make these details visible to your clients</Text>
              </View>
              <Switch value={true} trackColor={{ true: '#10B981' }} />
            </View>
          </View>

          {/* Social Links */}
          <View style={styles.glassCard}>
            <View style={styles.cardHeader}>
              <Share2 color="#F59E0B" size={20} />
              <Text style={styles.cardTitle}>Social Links</Text>
            </View>
            
            {renderInput(Link, '@username', 'INSTAGRAM')}
            {renderInput(Globe, 'facebook.com/username', 'FACEBOOK')}
            {renderInput(Video, 'youtube.com/channel', 'YOUTUBE')}
          </View>

          {/* Branding Preview */}
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>BRANDING PREVIEW</Text>
            <View style={styles.previewBox}>
              <View style={styles.previewIconBox}>
                <Camera color="#A1A1AA" size={16} />
              </View>
              <View>
                <Text style={styles.previewLabel}>ALBUM BY</Text>
                <Text style={styles.previewName}>Your Studio Name</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#27272A' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  saveBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)' },
  
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  glassCard: { backgroundColor: '#18181B', borderRadius: 24, padding: 25, marginBottom: 20, borderWidth: 1, borderColor: '#27272A', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginLeft: 10 },
  cardDesc: { fontSize: 13, color: '#A1A1AA', lineHeight: 20, marginBottom: 20 },
  
  logoUploadArea: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#09090B', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#27272A' },
  logoPreview: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#3F3F46', borderStyle: 'dashed' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#27272A', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, marginLeft: 20 },
  uploadBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', marginLeft: 8 },
  
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 10, fontWeight: '800', color: '#71717A', letterSpacing: 1, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#09090B', borderWidth: 1, borderColor: '#27272A', borderRadius: 12, height: 48, paddingHorizontal: 15 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#fff' },
  
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#09090B', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#27272A', marginTop: 10 },
  toggleTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 2 },
  toggleDesc: { fontSize: 12, color: '#71717A' },
  
  previewCard: { backgroundColor: '#09090B', borderRadius: 24, padding: 25, borderWidth: 1, borderColor: '#27272A', alignItems: 'center', borderStyle: 'dashed', marginTop: 10 },
  previewTitle: { fontSize: 10, fontWeight: '800', color: '#52525B', letterSpacing: 2, marginBottom: 15 },
  previewBox: { flexDirection: 'row', alignItems: 'center' },
  previewIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center', marginRight: 15, borderWidth: 1, borderColor: '#27272A' },
  previewLabel: { fontSize: 10, fontWeight: '800', color: '#71717A', letterSpacing: 1, marginBottom: 2 },
  previewName: { fontSize: 16, fontWeight: '800', color: '#fff' }
});
