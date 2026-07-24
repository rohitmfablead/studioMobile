import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Check, Upload, Droplets, Grid3x3 } from 'lucide-react-native';
import { useState } from 'react';

export default function WatermarkScreen() {
  const insets = useSafeAreaInsets();
  const [placement, setPlacement] = useState(4); 

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Watermark Studio</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Check color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Live Preview Wrapper */}
        <View style={styles.previewWrapper}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80' }} 
            style={styles.previewImageBg}
          >
            <View style={styles.previewOverlay}>
              {/* Simulated watermark */}
              <View style={[styles.mockWatermarkBox, 
                placement === 0 && { top: 20, left: 20, bottom: 'auto', right: 'auto' },
                placement === 1 && { top: 20, alignSelf: 'center' },
                placement === 2 && { top: 20, right: 20, bottom: 'auto', left: 'auto', position: 'absolute' },
                placement === 3 && { top: '50%', left: 20, marginTop: -20, position: 'absolute' },
                placement === 4 && { top: '50%', alignSelf: 'center', marginTop: -20 },
                placement === 5 && { top: '50%', right: 20, marginTop: -20, position: 'absolute' },
                placement === 6 && { bottom: 20, left: 20, position: 'absolute' },
                placement === 7 && { bottom: 20, alignSelf: 'center', position: 'absolute' },
                placement === 8 && { bottom: 20, right: 20, position: 'absolute' },
              ]}>
                <Droplets color="rgba(255,255,255,0.7)" size={24} />
                <Text style={styles.mockWatermarkText}>YOUR LOGO</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>PREVIEW</Text>
          </View>
        </View>

        <View style={styles.glassCard}>
          <View style={styles.uploadRow}>
            <View style={styles.uploadInfo}>
              <Text style={styles.uploadTitle}>Transparency Logo</Text>
              <Text style={styles.uploadDesc}>Upload a white PNG logo for best results across all photo colors.</Text>
            </View>
            <TouchableOpacity style={styles.uploadBtn}>
              <Upload color="#FF6B00" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.placementSection}>
            <View style={styles.placementHeader}>
              <Grid3x3 color="#A1A1AA" size={18} />
              <Text style={styles.placementTitle}>Position</Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.tiledText}>TILED</Text>
              <Switch value={false} trackColor={{ true: '#FF6B00' }} style={{ transform: [{ scale: 0.8 }] }} />
            </View>

            <View style={styles.gridContainer}>
              {[0,1,2,3,4,5,6,7,8].map((i) => (
                <TouchableOpacity 
                  key={i} 
                  style={[styles.gridCell, placement === i && styles.gridCellActive]}
                  onPress={() => setPlacement(i)}
                >
                  <View style={[styles.gridDot, placement === i && styles.gridDotActive]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Glowing Sliders */}
          <View style={styles.sliderGroup}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>OPACITY</Text>
              <Text style={styles.sliderValue}>85%</Text>
            </View>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: '85%' }]} />
              <View style={[styles.sliderThumb, { left: '85%' }]} />
            </View>
          </View>

          <View style={styles.sliderGroup}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>SCALE</Text>
              <Text style={styles.sliderValue}>30%</Text>
            </View>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: '30%' }]} />
              <View style={[styles.sliderThumb, { left: '30%' }]} />
            </View>
          </View>

        </View>
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
  
  previewWrapper: { height: 280, borderRadius: 24, overflow: 'hidden', marginBottom: 20, backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A', position: 'relative' },
  previewImageBg: { width: '100%', height: '100%' },
  previewOverlay: { flex: 1, position: 'relative' },
  
  mockWatermarkBox: { alignItems: 'center', justifyContent: 'center' },
  mockWatermarkText: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '800', marginTop: 4, letterSpacing: 2 },
  
  liveBadge: { position: 'absolute', top: 15, left: 15, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444', marginRight: 6 },
  liveText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  
  glassCard: { backgroundColor: '#18181B', borderRadius: 24, padding: 25, borderWidth: 1, borderColor: '#27272A' },
  
  uploadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  uploadInfo: { flex: 1, paddingRight: 20 },
  uploadTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 4 },
  uploadDesc: { fontSize: 12, color: '#A1A1AA', lineHeight: 18 },
  uploadBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255, 107, 0, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255, 107, 0, 0.3)' },
  
  divider: { height: 1, backgroundColor: '#27272A', marginVertical: 20 },
  
  placementSection: { marginBottom: 10 },
  placementHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  placementTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginLeft: 10 },
  tiledText: { fontSize: 11, fontWeight: '800', color: '#71717A', letterSpacing: 1, marginRight: 8 },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', width: 140, height: 140, alignSelf: 'center', justifyContent: 'space-between', alignContent: 'space-between' },
  gridCell: { width: 42, height: 42, borderWidth: 1, borderColor: '#3F3F46', borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090B' },
  gridCellActive: { borderColor: '#FF6B00', borderWidth: 2, backgroundColor: 'rgba(255, 107, 0, 0.1)' },
  gridDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#52525B' },
  gridDotActive: { backgroundColor: '#FF6B00' },
  
  sliderGroup: { marginBottom: 25 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sliderLabel: { fontSize: 11, fontWeight: '800', color: '#A1A1AA', letterSpacing: 1 },
  sliderValue: { fontSize: 13, fontWeight: '700', color: '#fff' },
  sliderTrack: { height: 6, backgroundColor: '#27272A', borderRadius: 3, position: 'relative', justifyContent: 'center' },
  sliderFill: { height: '100%', backgroundColor: '#FF6B00', borderRadius: 3, shadowColor: '#FF6B00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 },
  sliderThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', position: 'absolute', marginLeft: -10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }
});
