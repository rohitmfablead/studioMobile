import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Camera, Briefcase, KeyRound, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';

export default function BusinessProfileScreen() {
  const insets = useSafeAreaInsets();
  
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#111" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Business Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Top Profile Card */}
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }} style={styles.avatar} />
                <TouchableOpacity style={styles.cameraIconBtn}>
                  <Camera color="#fff" size={12} />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Rohit Kumar</Text>
                <Text style={styles.profileEmail}>rohit.fablead@gmail.com</Text>
                <TouchableOpacity style={styles.changePhotoBtn}>
                  <Camera color="#FF6B00" size={14} />
                  <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput style={styles.input} value="Rohit" />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} value="Kumar" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value="rohit.fablead@gmail.com" keyboardType="email-address" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <TextInput style={[styles.input, styles.phoneInput]} value="9865328965" keyboardType="phone-pad" />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          {/* Business Information */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.iconCircle}><Briefcase color="#FF6B00" size={18} /></View>
                <Text style={styles.sectionTitleNoMargin}>Business Information</Text>
              </View>
              <TouchableOpacity style={styles.outlineBtn} onPress={() => router.push('/business-branding')}>
                <Text style={styles.outlineBtnText}>Edit Branding</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>BUSINESS NAME</Text>
              <TextInput style={styles.input} placeholder="Enter business name" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>BUSINESS EMAIL</Text>
              <TextInput style={styles.input} placeholder="Enter business email" keyboardType="email-address" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>BUSINESS PHONE</Text>
              <TextInput style={styles.input} placeholder="Enter business phone" keyboardType="phone-pad" />
            </View>
          </View>

          {/* Change Password */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.iconCircle}><KeyRound color="#FF6B00" size={18} /></View>
              <Text style={styles.sectionTitleNoMargin}>Change Password</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput} value="•••••••••••••" secureTextEntry={!showPassword.current} />
                <TouchableOpacity onPress={() => setShowPassword(p => ({...p, current: !p.current}))}>
                  {showPassword.current ? <EyeOff color="#888" size={20} /> : <Eye color="#888" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput} placeholder="Enter new password" secureTextEntry={!showPassword.new} />
                <TouchableOpacity onPress={() => setShowPassword(p => ({...p, new: !p.new}))}>
                  {showPassword.new ? <EyeOff color="#888" size={20} /> : <Eye color="#888" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput} placeholder="Re-enter new password" secureTextEntry={!showPassword.confirm} />
                <TouchableOpacity onPress={() => setShowPassword(p => ({...p, confirm: !p.confirm}))}>
                  {showPassword.confirm ? <EyeOff color="#888" size={20} /> : <Eye color="#888" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Update Password</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  backBtn: { padding: 10, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  
  scrollContent: { padding: 15, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 },
  
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative' },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  cameraIconBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FF6B00', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  profileInfo: { marginLeft: 15, flex: 1 },
  profileName: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 2 },
  profileEmail: { fontSize: 14, color: '#666', marginBottom: 8 },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center' },
  changePhotoText: { color: '#FF6B00', fontSize: 13, fontWeight: '700', marginLeft: 6 },
  
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 20 },
  sectionTitleNoMargin: { fontSize: 16, fontWeight: '800', color: '#111' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF0E5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  
  rowInputs: { flexDirection: 'row', width: '100%' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 12, fontWeight: '700', color: '#333', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  input: { height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 15, fontSize: 15, color: '#111', backgroundColor: '#fff' },
  
  phoneInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, backgroundColor: '#fff' },
  countryCode: { paddingHorizontal: 15, borderRightWidth: 1, borderRightColor: '#E5E7EB', height: 50, justifyContent: 'center' },
  countryCodeText: { fontSize: 15, color: '#111', fontWeight: '500' },
  phoneInput: { flex: 1, borderWidth: 0, backgroundColor: 'transparent' },
  
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, backgroundColor: '#fff', paddingRight: 15 },
  passwordInput: { flex: 1, height: 50, paddingHorizontal: 15, fontSize: 15, color: '#111' },
  
  saveBtn: { backgroundColor: '#FF6B00', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 30 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  
  outlineBtn: { borderWidth: 1, borderColor: '#FF6B00', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  outlineBtnText: { color: '#FF6B00', fontWeight: '700', fontSize: 13 },
});
