import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';
import { ChevronLeft, PlayCircle, Download, Share2, BookOpen, Clock, User } from 'lucide-react-native';

const tutorials = [
  { id: 1, title: 'Business Branding Setup', time: '02:15', author: 'FabStudio', category: 'Customization', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80' },
  { id: 2, title: 'Create a Group on Website', time: '03:40', author: 'FabStudio', category: 'Management', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' },
  { id: 3, title: 'Photo Upload Guide', time: '01:50', author: 'FabStudio', category: 'Features', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' },
  { id: 4, title: 'Portfolio Setup', time: '02:30', author: 'FabStudio', category: 'Basics', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80' },
  { id: 5, title: 'Watermark Setup', time: '01:45', author: 'FabStudio', category: 'Advanced', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80' },
  { id: 6, title: 'Share Group Guide', time: '01:30', author: 'FabStudio', category: 'Management', image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80' },
];

export default function TutorialsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tutorials</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionHeaderRow}>
          <PlayCircle color="#111827" size={20} />
          <Text style={styles.sectionTitle}>Video Tutorials</Text>
        </View>

        <View style={styles.grid}>
          {tutorials.map((video) => (
            <TouchableOpacity key={video.id} style={styles.videoCard} activeOpacity={0.9}>
              {/* Thumbnail Container */}
              <View style={styles.thumbnailBox}>
                <Image source={{ uri: video.image }} style={styles.thumbnail} />
                <View style={styles.overlay} />
                <View style={styles.playBtnContainer}>
                  <PlayCircle color="#2563EB" size={48} fill="#FFFFFF" />
                </View>
                <View style={styles.timeBadge}>
                  <Clock color="#FFFFFF" size={12} />
                  <Text style={styles.timeText}>{video.time}</Text>
                </View>
              </View>

              {/* Details Container */}
              <View style={styles.detailsBox}>
                <Text style={styles.videoTitle} numberOfLines={1}>{video.title}</Text>
                <View style={styles.authorRow}>
                  <User color="#9CA3AF" size={14} />
                  <Text style={styles.authorText}>{video.author}</Text>
                </View>
                
                <View style={styles.cardFooter}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{video.category}</Text>
                  </View>
                  <View style={styles.actionIcons}>
                    <TouchableOpacity style={styles.iconBtn}><Download color="#6B7280" size={18} /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}><Share2 color="#6B7280" size={18} /></TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.sectionHeaderRow, { marginTop: 20 }]}>
          <BookOpen color="#111827" size={20} />
          <Text style={styles.sectionTitle}>Step-by-Step Guides</Text>
        </View>
        <View style={styles.emptyGuidesBox}>
          <Text style={styles.emptyGuidesText}>More guides coming soon!</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFD' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  
  scrollContent: { padding: 15, paddingBottom: 50 },
  
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginLeft: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 8 },
  
  grid: { flexDirection: 'column' },
  videoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3, overflow: 'hidden' },
  
  thumbnailBox: { width: '100%', height: 200, position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.25)' },
  playBtnContainer: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  timeBadge: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.7)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  timeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600', marginLeft: 4 },
  
  detailsBox: { padding: 15 },
  videoTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  authorText: { fontSize: 13, color: '#6B7280', marginLeft: 6 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoryText: { color: '#4B5563', fontSize: 11, fontWeight: '600' },
  actionIcons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 15, padding: 4 },
  
  emptyGuidesBox: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F3F4F6', borderStyle: 'dashed' },
  emptyGuidesText: { color: '#9CA3AF', fontSize: 14, fontWeight: '500' }
});
