import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from '../../../../../utils/routerShim';
import { ChevronLeft, Download, Share2, Smartphone, MonitorSmartphone, Monitor, LayoutGrid, CheckCircle2 } from 'lucide-react-native';

export default function ViewDownloadSettings() {
  const { id } = useLocalSearchParams();
  const [allowDownload, setAllowDownload] = useState(true);
  const [enableShare, setEnableShare] = useState(true);
  const [enableScreenshot, setEnableScreenshot] = useState(true);
  const [bulkDownload, setBulkDownload] = useState(false);
  
  const [quality, setQuality] = useState('Original');
  const [viewingPlatform, setViewingPlatform] = useState('Both');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>View & Download Settings</Text>
            <Text style={styles.headerSubtitle}>Configure viewing and download options for your group</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Download Settings */}
        <Text style={styles.sectionTitle}>
          <Download color="#FF6B00" size={14} style={{marginRight: 6}} /> Download Settings
        </Text>
        
        <View style={styles.switchGrid}>
          <View style={styles.switchCard}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Allow Downloading</Text>
              <Text style={styles.switchSub}>Users can download photos from this group</Text>
            </View>
            <Switch value={allowDownload} onValueChange={setAllowDownload} trackColor={{ false: '#E5E5EA', true: '#FF6B00' }} />
          </View>

          <View style={styles.switchCard}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Enable Sharing</Text>
              <Text style={styles.switchSub}>Users can share photos via social media</Text>
            </View>
            <Switch value={enableShare} onValueChange={setEnableShare} trackColor={{ false: '#E5E5EA', true: '#FF6B00' }} />
          </View>

          <View style={styles.switchCard}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Enable Screenshots</Text>
              <Text style={styles.switchSub}>Allow users to take screenshots of photos</Text>
            </View>
            <Switch value={enableScreenshot} onValueChange={setEnableScreenshot} trackColor={{ false: '#E5E5EA', true: '#FF6B00' }} />
          </View>
        </View>

        {/* Download Quality */}
        <Text style={styles.subLabel}>Download Quality</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCards} style={{marginBottom: 20}}>
          {['Original', 'High', 'Medium', 'Low'].map((q) => (
            <TouchableOpacity 
              key={q} 
              style={[styles.smallCard, quality === q && styles.smallCardActive]} 
              onPress={() => setQuality(q)}
            >
              <Text style={[styles.scTitle, quality === q && { color: '#111' }]}>{q}</Text>
              <Text style={styles.scSub}>{q === 'Original' ? 'Full resolution' : q + ' quality'}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.switchCard}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchTitle}>Bulk Downloads</Text>
            <Text style={styles.switchSub}>Allow users to download all photos at once</Text>
          </View>
          <Switch value={bulkDownload} onValueChange={setBulkDownload} trackColor={{ false: '#E5E5EA', true: '#FF6B00' }} />
        </View>

        {/* Viewing Settings */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
          <MonitorSmartphone color="#FF6B00" size={14} style={{marginRight: 6}} /> Viewing Settings
        </Text>
        <Text style={styles.subLabel}>Viewing Platforms</Text>

        <View style={styles.cardsRow}>
          <TouchableOpacity style={[styles.selectionCard, viewingPlatform === 'Web' && styles.selectionCardActive]} onPress={() => setViewingPlatform('Web')}>
            <View style={[styles.cardIconBox, { backgroundColor: viewingPlatform === 'Web' ? '#FFB075' : '#F2F2F7' }]}>
              <Monitor color={viewingPlatform === 'Web' ? '#fff' : '#666'} size={18} />
            </View>
            <Text style={[styles.platformTitle, viewingPlatform === 'Web' && { color: '#111' }]}>Web Only</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.selectionCard, viewingPlatform === 'App' && styles.selectionCardActive]} onPress={() => setViewingPlatform('App')}>
             <View style={[styles.cardIconBox, { backgroundColor: viewingPlatform === 'App' ? '#FFB075' : '#F2F2F7' }]}>
              <Smartphone color={viewingPlatform === 'App' ? '#fff' : '#666'} size={18} />
            </View>
            <Text style={[styles.platformTitle, viewingPlatform === 'App' && { color: '#111' }]}>App Only</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.selectionCard, viewingPlatform === 'Both' && styles.selectionCardActive]} onPress={() => setViewingPlatform('Both')}>
             <View style={[styles.cardIconBox, { backgroundColor: viewingPlatform === 'Both' ? '#FF6B00' : '#F2F2F7' }]}>
              <LayoutGrid color={viewingPlatform === 'Both' ? '#fff' : '#666'} size={18} />
            </View>
            <Text style={[styles.platformTitle, viewingPlatform === 'Both' && { color: '#111' }]}>Both Web & App</Text>
            {viewingPlatform === 'Both' && <CheckCircle2 color="#FF6B00" size={16} style={styles.scCheck} />}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Save Button */}
      <View style={styles.floatingFooter}>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
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

  content: { flex: 1, padding: 15 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 15, marginTop: 10, flexDirection: 'row', alignItems: 'center' },
  subLabel: { fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 10 },
  
  switchGrid: { marginBottom: 10 },
  switchCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 10 },
  switchTextContainer: { flex: 1, paddingRight: 15 },
  switchTitle: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  switchSub: { fontSize: 11, color: '#666', lineHeight: 14 },

  horizontalCards: { paddingRight: 20, gap: 10 },
  smallCard: { width: 140, padding: 15, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#fff' },
  smallCardActive: { borderColor: '#FF6B00', backgroundColor: '#FFF9F2' },
  
  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  selectionCard: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 15, position: 'relative', backgroundColor: '#fff' },
  selectionCardActive: { borderColor: '#FF6B00', backgroundColor: '#FFF9F2' },
  cardIconBox: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  
  scTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 2 },
  scSub: { fontSize: 11, color: '#888' },
  platformTitle: { fontSize: 13, fontWeight: '600', color: '#555' },
  scCheck: { position: 'absolute', top: 10, right: 10 },

  floatingFooter: { position: 'absolute', bottom: 0, width: '100%', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  saveBtn: { backgroundColor: '#FF6B00', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
