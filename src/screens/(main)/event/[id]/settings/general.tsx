import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from '../../../../../utils/routerShim';
import { ChevronLeft, Folder, Users, Calendar, Image as ImageIcon, Globe, Lock, CheckCircle2, Droplet, ArrowDownUp } from 'lucide-react-native';

export default function GeneralSettings() {
  const refetch = () => {};
  const isUpdating = false;
  const isLoading = false;

  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>({});
  const updateGroupDetails = async (args?: any) => { console.log("Mock mutation:", args); return { data: {} }; };

  const [groupName, setGroupName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  
  const [visibility, setVisibility] = useState('Public');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [watermark, setWatermark] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (data?.success && data?.group) {
      const g = data.group;
      setGroupName(g.name || '');
      setEventType(g.eventType || '');
      setEventDate(g.eventDate || '');
      setDescription(g.description || '');
      setVisibility(g.type === 'private' ? 'Private' : 'Public');
      setSortOrder(g.sortBy === 'oldest' ? 'Oldest' : 'Newest');
      setWatermark(g.enableWatermark || false);
      setCoverImage(g.coverImage || null);
      setPhotoCount(g.photoCount || 0);
      setParticipantCount(g.memberCount || 0);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      const payload = {
        name: groupName,
        type: visibility === 'Private' ? 'private' : 'public',
        eventType: eventType,
        eventDate: eventDate,
        description: description,
        coverImage: coverImage,
        enableWatermark: watermark,
        sortBy: sortOrder === 'Oldest' ? 'oldest' : 'newest',
      };
      const res = await updateGroupDetails({ id: id as string, body: payload });
      if (res.success) {
        setToastMsg('Settings updated successfully!');
        setTimeout(() => setToastMsg(''), 3000);
        refetch();
      }
    } catch (err) {
      console.error('Update failed:', err);
      setToastMsg('Failed to update settings!');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>General Settings</Text>
            <Text style={styles.headerSubtitle}>Manage your group's basic information</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.saveBtn, isUpdating && { opacity: 0.6 }]} onPress={handleSave} disabled={isUpdating}>
          {isUpdating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>
        {isLoading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <>
            {/* Metric Cards */}
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { backgroundColor: '#EFF6FF' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                  <Folder color="#2563EB" size={16} />
                </View>
                <View>
                  <Text style={styles.metricVal}>{photoCount}</Text>
                  <Text style={styles.metricLabel}>Total Photos</Text>
                </View>
              </View>
              <View style={[styles.metricCard, { backgroundColor: '#F0F5FF' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                  <Users color="#3B82F6" size={16} />
                </View>
                <View>
                  <Text style={styles.metricVal}>{participantCount}</Text>
                  <Text style={styles.metricLabel}>Participants</Text>
                </View>
              </View>
            </View>

            {/* Cover Image */}
            <Text style={styles.sectionTitle}>
              <ImageIcon color="#2563EB" size={16} style={{marginRight: 6}} /> Cover Image
            </Text>
            <TouchableOpacity style={[styles.uploadBox, coverImage ? { padding: 0, overflow: 'hidden' } : {}]}>
              {coverImage ? (
                <Image source={{ uri: coverImage }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
              ) : (
                <>
                  <ImageIcon color="#C7C7CC" size={32} />
                  <Text style={styles.uploadText}>No cover image</Text>
                  <Text style={styles.uploadSub}>Recommended: 1920x600px · Max 5MB · Click to change</Text>
                </>
              )}
            </TouchableOpacity>

        {/* Form Inputs */}
        <Text style={styles.inputLabel}>Group Name</Text>
        <TextInput style={styles.input} value={groupName} onChangeText={setGroupName} />

        <View style={styles.rowInputs}>
          <View style={{flex: 1, marginRight: 10}}>
            <Text style={styles.inputLabel}><Lock color="#2563EB" size={14} /> Group Visibility</Text>
            <View style={styles.toggleGroup}>
              <TouchableOpacity style={[styles.toggleBtn, visibility === 'Public' && styles.toggleBtnActive]} onPress={() => setVisibility('Public')}>
                <Globe color={visibility === 'Public' ? '#111' : '#666'} size={14} />
                <Text style={[styles.toggleText, visibility === 'Public' && styles.toggleTextActive]}> Public</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, visibility === 'Private' && styles.toggleBtnActive]} onPress={() => setVisibility('Private')}>
                <Lock color={visibility === 'Private' ? '#111' : '#666'} size={14} />
                <Text style={[styles.toggleText, visibility === 'Private' && styles.toggleTextActive]}> Private</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.rowInputs}>
          <View style={{flex: 1}}>
            <Text style={styles.inputLabel}>Event Type</Text>
            <TextInput style={styles.input} value={eventType} onChangeText={setEventType} />
          </View>
        </View>

        <Text style={styles.inputLabel}><Calendar color="#2563EB" size={14} /> Event Date</Text>
        <View style={styles.inputIconWrapper}>
          <TextInput style={styles.input} placeholder="dd/mm/yyyy" value={eventDate} onChangeText={setEventDate} />
          <Calendar color="#8E8E93" size={18} style={styles.inputIconRight} />
        </View>

        <Text style={styles.inputLabel}>Description</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Add a description for this group.." value={description} onChangeText={setDescription} multiline />

        {/* Photo Sort Order */}
        <Text style={styles.sectionTitle}>
          <ArrowDownUp color="#2563EB" size={16} /> Photo Sort Order
        </Text>
        <View style={styles.cardsRow}>
          <TouchableOpacity style={[styles.selectionCard, sortOrder === 'Newest' && styles.selectionCardActive]} onPress={() => setSortOrder('Newest')}>
            <Text style={[styles.scTitle, sortOrder === 'Newest' && { color: '#111' }]}>Newest First</Text>
            <Text style={styles.scSub}>Show newest photos first</Text>
            {sortOrder === 'Newest' && <CheckCircle2 color="#2563EB" size={16} style={styles.scCheck} />}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectionCard, sortOrder === 'Oldest' && styles.selectionCardActive]} onPress={() => setSortOrder('Oldest')}>
            <Text style={[styles.scTitle, sortOrder === 'Oldest' && { color: '#111' }]}>Oldest First</Text>
            <Text style={styles.scSub}>Show oldest photos first</Text>
            {sortOrder === 'Oldest' && <CheckCircle2 color="#2563EB" size={16} style={styles.scCheck} />}
          </TouchableOpacity>
        </View>

        {/* Watermark Switch */}
        <View style={styles.switchCard}>
          <View style={styles.switchLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <Droplet color="#2563EB" size={16} />
            </View>
            <View>
              <Text style={styles.switchTitle}>Show Watermark</Text>
              <Text style={styles.switchSub}>Apply your business branding to all photos</Text>
            </View>
          </View>
          <Switch value={watermark} onValueChange={setWatermark} trackColor={{ false: '#E5E5EA', true: '#2563EB' }} />
        </View>
          </>
        )}
      </ScrollView>

      {/* Custom Toast Notification */}
      {toastMsg ? (
        <View style={styles.toastContainer}>
          <View style={styles.toast}>
            <CheckCircle2 color="#fff" size={18} />
            <Text style={styles.toastText}>{toastMsg}</Text>
          </View>
        </View>
      ) : null}
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
  saveBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  content: { flex: 1, padding: 15 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  metricCard: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, marginRight: 10 },
  iconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  metricVal: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  metricLabel: { fontSize: 11, color: '#666', marginTop: 2 },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 12, marginTop: 10, flexDirection: 'row', alignItems: 'center' },
  uploadBox: { height: 160, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  uploadText: { fontSize: 14, fontWeight: '500', color: '#888', marginTop: 10 },
  uploadSub: { fontSize: 11, color: '#AAA', marginTop: 6, paddingHorizontal: 20, textAlign: 'center' },

  inputLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 15, flexDirection: 'row', alignItems: 'center' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 15, color: '#111', marginBottom: 10 },
  rowInputs: { flexDirection: 'row', alignItems: 'center' },
  
  toggleGroup: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 4, marginBottom: 10 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 6 },
  toggleBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  toggleText: { fontSize: 14, color: '#666', fontWeight: '500' },
  toggleTextActive: { color: '#111', fontWeight: '600' },

  inputIconWrapper: { position: 'relative', marginBottom: 10 },
  inputIconRight: { position: 'absolute', right: 15, top: 14 },
  
  textArea: { height: 100, paddingTop: 12, textAlignVertical: 'top' },

  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  selectionCard: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 15, position: 'relative' },
  selectionCardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  scTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 4 },
  scSub: { fontSize: 11, color: '#888', lineHeight: 16 },
  scCheck: { position: 'absolute', top: 12, right: 12 },

  switchCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 30 },
  switchLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  switchTitle: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  switchSub: { fontSize: 11, color: '#666' },

  toastContainer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center', zIndex: 999 },
  toast: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '500', marginLeft: 10 },
});
