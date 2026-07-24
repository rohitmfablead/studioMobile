import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Globe, Upload, Camera, Heart, Video, MonitorPlay, Book, Briefcase, Plus, Check } from 'lucide-react-native';
import { useState } from 'react';

export default function PortfolioSettingsScreen() {
  const insets = useSafeAreaInsets();
  
  const [services, setServices] = useState([
    { id: 1, title: 'Wedding Photography', icon: Camera, active: true, price: '₹1,50,000' },
    { id: 2, title: 'Pre-Wedding Shoot', icon: Heart, active: false, price: '' },
    { id: 3, title: 'Cinematic Videography', icon: Video, active: true, price: '₹2,00,000' },
    { id: 4, title: 'Traditional Videography', icon: MonitorPlay, active: false, price: '' }
  ]);

  const toggleService = (id: number) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Portfolio Setup</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Check color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Hero Cover Image Upload */}
          <View style={styles.coverUploadBox}>
            <ImageBackground 
              source={{ uri: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }} 
              style={styles.coverImageBg}
              imageStyle={{ opacity: 0.4 }}
            >
              <View style={styles.coverOverlay}>
                <View style={styles.uploadIconWrap}>
                  <Upload color="#fff" size={24} />
                </View>
                <Text style={styles.coverUploadTitle}>Update Cover Image</Text>
                <Text style={styles.coverUploadDesc}>High-res landscape image (16:9)</Text>
              </View>
            </ImageBackground>
          </View>

          {/* Public Link Card */}
          <View style={styles.linkCard}>
            <View style={styles.linkIconBox}>
              <Globe color="#10B981" size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.linkTitle}>Public Portfolio Live</Text>
              <Text style={styles.linkUrl} numberOfLines={1}>fablead.com/p/rohit-kumar</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn}>
              <Text style={styles.copyBtnText}>COPY</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeading}>SERVICES & PRICING</Text>
          
          <View style={styles.servicesGrid}>
            {services.map((item) => (
              <View key={item.id} style={[styles.serviceCard, item.active && styles.serviceCardActive]}>
                <View style={styles.serviceHeader}>
                  <View style={[styles.serviceIconBox, item.active && { backgroundColor: 'rgba(255, 107, 0, 0.15)' }]}>
                    <item.icon color={item.active ? "#FF6B00" : "#71717A"} size={20} />
                  </View>
                  <Switch 
                    value={item.active} 
                    onValueChange={() => toggleService(item.id)}
                    trackColor={{ true: '#FF6B00' }}
                    style={{ transform: [{ scale: 0.8 }] }}
                  />
                </View>
                <Text style={[styles.serviceTitle, item.active && { color: '#fff' }]}>{item.title}</Text>
                
                {item.active ? (
                  <View style={styles.priceInputWrap}>
                    <Text style={styles.rupeeSymbol}>₹</Text>
                    <TextInput 
                      style={styles.priceInput}
                      value={item.price}
                      placeholder="Pricing"
                      placeholderTextColor="#71717A"
                    />
                  </View>
                ) : (
                  <Text style={styles.inactiveText}>Not offered</Text>
                )}
              </View>
            ))}
            
            <TouchableOpacity style={styles.addServiceCard}>
              <View style={styles.addServiceIcon}>
                <Plus color="#A1A1AA" size={24} />
              </View>
              <Text style={styles.addServiceText}>Add Custom Service</Text>
            </TouchableOpacity>
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
  saveBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center', shadowColor: '#FF6B00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  coverUploadBox: { height: 200, borderRadius: 24, overflow: 'hidden', marginBottom: 20, backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A' },
  coverImageBg: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  coverOverlay: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 16 },
  uploadIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  coverUploadTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  coverUploadDesc: { fontSize: 11, color: '#D4D4D8' },
  
  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181B', borderRadius: 16, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#27272A' },
  linkIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.15)', alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 2 },
  linkUrl: { fontSize: 11, color: '#A1A1AA' },
  copyBtn: { backgroundColor: '#27272A', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  copyBtnText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#52525B', letterSpacing: 1.5, marginBottom: 15, marginLeft: 5 },
  
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  serviceCard: { width: '48%', backgroundColor: '#18181B', borderRadius: 20, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#27272A' },
  serviceCardActive: { borderColor: '#FF6B00', backgroundColor: 'rgba(255, 107, 0, 0.05)' },
  
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  serviceIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#27272A', alignItems: 'center', justifyContent: 'center' },
  
  serviceTitle: { fontSize: 14, fontWeight: '600', color: '#A1A1AA', marginBottom: 15, height: 40 },
  
  priceInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#09090B', borderRadius: 8, borderWidth: 1, borderColor: '#3F3F46', paddingHorizontal: 10, height: 36 },
  rupeeSymbol: { color: '#A1A1AA', fontSize: 13, marginRight: 5 },
  priceInput: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '600' },
  
  inactiveText: { fontSize: 12, color: '#52525B', fontWeight: '600', marginTop: 10 },
  
  addServiceCard: { width: '48%', backgroundColor: 'transparent', borderRadius: 20, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#27272A', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', minHeight: 160 },
  addServiceIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  addServiceText: { fontSize: 13, fontWeight: '600', color: '#A1A1AA', textAlign: 'center' }
});
