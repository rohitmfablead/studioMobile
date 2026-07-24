import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, ChevronRight, Settings as SettingsIcon, User, Lock, Folder, Download, BookOpen, Star, LogOut, Trash2 } from 'lucide-react-native';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  const MENU_ITEMS = [
    { icon: <SettingsIcon color="#666" size={22} />, label: 'General Settings', type: 'nav', onPress: () => router.push(`/(photographer)/event/${id}/settings/general`) },
    { icon: <User color="#666" size={22} />, label: 'Participants', type: 'nav', onPress: () => router.push(`/(photographer)/event/${id}/settings/participants`) },
    { icon: <Lock color="#666" size={22} />, label: 'Privacy Settings', type: 'nav', onPress: () => router.push(`/(photographer)/event/${id}/settings/privacy`) },
    { icon: <Folder color="#666" size={22} />, label: 'Folders', type: 'nav', onPress: () => router.push(`/(photographer)/event/${id}/settings/folders`) },
    { icon: <Download color="#666" size={22} />, label: 'View & Download', type: 'nav', onPress: () => router.push(`/(photographer)/event/${id}/settings/view-download`) },
    { icon: <Download color="#666" size={22} />, label: 'Download History', type: 'nav', onPress: () => router.push(`/(photographer)/event/${id}/settings/download-history`) },
    { icon: <BookOpen color="#666" size={22} />, label: 'Digital Flipbook', type: 'nav', onPress: () => router.push(`/(photographer)/event/${id}/settings/flipbook`) },
    { icon: <Star color="#666" size={22} />, label: 'Branding & Sponsors', type: 'nav', onPress: () => router.push(`/(photographer)/event/${id}/settings/branding`) },
    { icon: <Star color="#666" size={22} />, label: 'Client Favorite', type: 'nav', onPress: () => router.push(`/(photographer)/event/${id}/settings/favorite`) },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80' }} 
          style={styles.headerBanner}
          imageStyle={{ opacity: 0.3 }}
        >
          <View style={[styles.headerBannerOverlay, { paddingTop: insets.top + 20 }]}>
            <View style={styles.headerNav}>
              <TouchableOpacity style={styles.backBtnBlur} onPress={() => router.back()}>
                <ChevronLeft color="#333" size={20} />
                <Text style={styles.backText}>Back to Gallery</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleLarge}>Event Settings</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
                <SettingsIcon color="#FF6B00" size={14} />
                <Text style={styles.headerSubtitle}> Manage configurations, design, and access</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>CONFIGURATION</Text>
          
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.menuItem, index === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }]}
                onPress={item.onPress}
              >
                <View style={styles.menuLeft}>
                  {item.icon}
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <ChevronRight color="#C7C7CC" size={20} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <LogOut color="#FF6B00" size={22} />
                <Text style={[styles.menuLabel, { color: '#FF6B00' }]}>Leave Group</Text>
              </View>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
              <View style={styles.menuLeft}>
                <Trash2 color="#FF3B30" size={22} />
                <Text style={[styles.menuLabel, { color: '#FF3B30' }]}>Delete Group</Text>
              </View>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBanner: { width: '100%', backgroundColor: '#fff', minHeight: 220, justifyContent: 'flex-end' },
  headerBannerOverlay: { paddingHorizontal: 15, paddingBottom: 50 },
  headerNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backBtnBlur: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  backText: { fontSize: 13, fontWeight: '600', color: '#333', marginLeft: 4 },
  headerTitleLarge: { fontSize: 28, fontWeight: 'bold', color: '#111' },
  headerSubtitle: { fontSize: 13, color: '#666' },
  content: { padding: 15, marginTop: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#8E8E93', marginBottom: 10, marginLeft: 5 },
  menuCard: { backgroundColor: '#F9FAFB', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F2F2F7', marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F2F2F7', backgroundColor: '#fff' },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '500', color: '#333', marginLeft: 15 }
});
