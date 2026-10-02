import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from '../../../../../utils/routerShim';
import { ChevronLeft, BookOpen, Settings, PlayCircle, Hash, Sparkles, Music, UploadCloud, ImageIcon, Eye } from 'lucide-react-native';

export default function FlipbookSettings() {
  const { id } = useLocalSearchParams();
  const [enableFlipbook, setEnableFlipbook] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [bgColor, setBgColor] = useState('#FFFFFF');

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
            <View style={{flexDirection: 'row', gap: 10}}>
               <TouchableOpacity style={styles.demoBtn}>
                 <Eye color="#111" size={14} />
                 <Text style={styles.demoBtnText}>Demo Flipbook</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.saveBtn}>
                 <Text style={styles.saveBtnText}>Save</Text>
               </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Digital Flipbook</Text>
            <Text style={styles.headerSubtitle}>Configure your interactive flipbook</Text>
          </View>
        </View>
      </ImageBackground>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>
        
        <View style={[styles.switchCard, { marginTop: 10 }]}>
          <View style={styles.switchLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <BookOpen color="#2563EB" size={16} />
            </View>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Enable Digital Flipbook</Text>
              <Text style={styles.switchSub}>Create an interactive flipbook from your photos</Text>
            </View>
          </View>
          <Switch value={enableFlipbook} onValueChange={setEnableFlipbook} trackColor={{ false: '#E5E5EA', true: '#2563EB' }} />
        </View>

        {enableFlipbook && (
          <>
            <Text style={styles.sectionTitle}>
              <Settings color="#8E8E93" size={14} style={{marginRight: 6}} /> DISPLAY SETTINGS
            </Text>
            
            <View style={styles.gridContainer}>
              <View style={styles.gridCard}>
                <View style={[styles.iconBoxSmall, { backgroundColor: '#F0F5FF' }]}>
                  <PlayCircle color="#3B82F6" size={14} />
                </View>
                <View style={styles.gridTextContainer}>
                  <Text style={styles.gridTitle}>Auto Play</Text>
                  <Text style={styles.gridSub}>Automatically flip through pages</Text>
                </View>
                <Switch value={autoPlay} onValueChange={setAutoPlay} trackColor={{ false: '#E5E5EA', true: '#2563EB' }} />
              </View>

              <View style={styles.gridCard}>
                <View style={[styles.iconBoxSmall, { backgroundColor: '#ECFDF5' }]}>
                  <Hash color="#10B981" size={14} />
                </View>
                <View style={styles.gridTextContainer}>
                  <Text style={styles.gridTitle}>Show Page Numbers</Text>
                  <Text style={styles.gridSub}>Display page numbers at the bottom</Text>
                </View>
                <Switch value={showPageNumbers} onValueChange={setShowPageNumbers} trackColor={{ false: '#E5E5EA', true: '#2563EB' }} />
              </View>

              <View style={styles.gridCard}>
                <View style={[styles.iconBoxSmall, { backgroundColor: '#F5F3FF' }]}>
                  <Sparkles color="#8B5CF6" size={14} />
                </View>
                <View style={styles.gridTextContainer}>
                  <Text style={styles.gridTitle}>Animation</Text>
                  <Text style={styles.gridSub}>Page turning effect style</Text>
                </View>
                <View style={styles.dropdownBox}>
                  <Text style={styles.dropdownText}>Realistic</Text>
                  <ChevronLeft color="#999" size={14} style={{transform: [{rotate: '-90deg'}], marginLeft: 4}} />
                </View>
              </View>

              <View style={styles.gridCard}>
                <View style={[styles.iconBoxSmall, { backgroundColor: '#EFF6FF' }]}>
                  <Music color="#2563EB" size={14} />
                </View>
                <View style={styles.gridTextContainer}>
                  <Text style={styles.gridTitle}>Background Music</Text>
                  <Text style={styles.gridSub}>Ambient sound while viewing</Text>
                </View>
                <View style={styles.dropdownBox}>
                  <Text style={styles.dropdownText}>None</Text>
                  <ChevronLeft color="#999" size={14} style={{transform: [{rotate: '-90deg'}], marginLeft: 4}} />
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              <UploadCloud color="#8E8E93" size={14} style={{marginRight: 6}} /> FLIPBOOK PHOTOS
            </Text>
            
            <TouchableOpacity style={styles.pickerBox}>
               <View style={styles.pickerLeft}>
                  <View style={[styles.iconBoxSmall, { backgroundColor: '#EFF6FF' }]}>
                    <ImageIcon color="#2563EB" size={14} />
                  </View>
                  <View>
                    <Text style={styles.gridTitle}>Select from Gallery</Text>
                    <Text style={styles.gridSub}>Pick existing group photos</Text>
                  </View>
               </View>
               <Text style={{fontSize: 20, color: '#999'}}>+</Text>
            </TouchableOpacity>

            <View style={styles.uploadBox}>
              <ImageIcon color="#C7C7CC" size={32} />
              <Text style={styles.uploadText}>No photos added yet</Text>
              <Text style={styles.uploadSub}>Select from gallery or upload photos to start your flipbook</Text>
            </View>

            <Text style={styles.sectionTitle}>
              <Settings color="#8E8E93" size={14} style={{marginRight: 6}} /> BACKGROUND
            </Text>
            <View style={styles.bgCard}>
              <View style={styles.colorSwatch} />
              <TextInput value={bgColor} onChangeText={setBgColor} style={styles.colorInput} />
            </View>
            
            <View style={styles.bannerInfo}>
              <View style={[styles.iconBoxSmall, { backgroundColor: '#EFF6FF', marginRight: 10 }]}>
                 <BookOpen color="#1D4ED8" size={14} />
              </View>
              <View style={{flex: 1}}>
                 <Text style={[styles.gridTitle, {color: '#92400E'}]}>Custom Flipbook</Text>
                 <Text style={[styles.gridSub, {color: '#B45309', marginTop: 4, lineHeight: 16}]}>
                   You can manually select and arrange photos to create a curated flipbook experience for your guests. If no photos are uploaded, the flipbook will automatically use the top-rated photos from the gallery.
                 </Text>
              </View>
            </View>
          </>
        )}
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
  demoBtn: { backgroundColor: '#EFF6FF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  demoBtnText: { fontSize: 12, fontWeight: '600', color: '#111', marginLeft: 6 },
  saveBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  headerContent: { paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  content: { flex: 1, padding: 15 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#8E8E93', marginBottom: 12, marginTop: 25, flexDirection: 'row', alignItems: 'center' },
  
  switchCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 15 },
  switchLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconBoxSmall: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  switchTextContainer: { flex: 1, paddingRight: 10 },
  switchTitle: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  switchSub: { fontSize: 11, color: '#666', lineHeight: 14 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: { width: '48%', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center' },
  gridTextContainer: { flex: 1, marginRight: 5 },
  gridTitle: { fontSize: 12, fontWeight: '600', color: '#111' },
  gridSub: { fontSize: 10, color: '#888', marginTop: 2, lineHeight: 12 },
  dropdownBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  dropdownText: { fontSize: 11, color: '#333' },

  pickerBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 15 },
  pickerLeft: { flexDirection: 'row', alignItems: 'center' },

  uploadBox: { height: 160, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  uploadText: { fontSize: 13, fontWeight: '500', color: '#333', marginTop: 10 },
  uploadSub: { fontSize: 11, color: '#888', marginTop: 6, paddingHorizontal: 20, textAlign: 'center' },

  bgCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12 },
  colorSwatch: { width: 30, height: 30, borderRadius: 4, borderWidth: 1, borderColor: '#DDD', backgroundColor: '#fff', marginRight: 15 },
  colorInput: { flex: 1, fontSize: 14, color: '#333' },

  bannerInfo: { flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 15, borderRadius: 12, marginTop: 20 },
});
