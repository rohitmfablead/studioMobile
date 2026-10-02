import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from '../../../../../utils/routerShim';
import { ChevronLeft } from 'lucide-react-native';

export default function BrandingSettings() {
  const { id } = useLocalSearchParams();
  const [showBranding, setShowBranding] = useState(false);

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
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Branding & Sponsors</Text>
            <Text style={styles.headerSubtitle}>Manage branding and sponsor information</Text>
          </View>
        </View>
      </ImageBackground>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.switchCard}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchTitle}>Show My Branding</Text>
            <Text style={styles.switchSub}>Turn off to show a Sponsor's branding first</Text>
          </View>
          <Switch value={showBranding} onValueChange={setShowBranding} trackColor={{ false: '#E5E5EA', true: '#2563EB' }} />
        </View>
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
  saveBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  
  content: { flex: 1, padding: 15 },
  switchCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginTop: 10 },
  switchTextContainer: { flex: 1, paddingRight: 15 },
  switchTitle: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  switchSub: { fontSize: 11, color: '#666', lineHeight: 14 },
});
