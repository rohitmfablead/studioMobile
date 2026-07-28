import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from '../../../../../utils/routerShim';
import { ChevronLeft, FolderPlus, ArrowRightLeft, AlignJustify, Folder, MoreVertical } from 'lucide-react-native';
import { useGetGroupFoldersQuery, useCreateGroupFolderMutation, useUpdateGroupFolderMutation, useDeleteGroupFolderMutation } from '../../../../../store/apiSlice';
import { toast } from '../../../../../utils/toast';

export default function FoldersSettings() {
  const { id } = useLocalSearchParams();
  const { data: foldersData, isLoading, refetch } = useGetGroupFoldersQuery(id as string);
  const [createGroupFolder, { isLoading: isCreating }] = useCreateGroupFolderMutation();
  const [updateGroupFolder, { isLoading: isUpdating }] = useUpdateGroupFolderMutation();
  const [deleteGroupFolder] = useDeleteGroupFolderMutation();
  
  const folders = foldersData?.data || [];
  
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDesc, setFolderDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const openCreateModal = () => {
    setEditingId(null);
    setFolderName('');
    setFolderDesc('');
    setShowModal(true);
  };
  
  const handleSaveFolder = async () => {
    if (!folderName.trim()) return;
    try {
      if (editingId) {
        const res = await updateGroupFolder({ id: id as string, folderId: editingId, body: { name: folderName, description: folderDesc } }).unwrap();
        if (res.success) {
          setShowModal(false);
          refetch();
        }
      } else {
        const res = await createGroupFolder({ id: id as string, body: { name: folderName, description: folderDesc } }).unwrap();
        if (res.success) {
          setShowModal(false);
          refetch();
        }
      }
    } catch (err) {
      console.error('Failed to save folder:', err);
      toast.error('Error', 'Failed to save folder.');
    }
  };

  const handleFolderOptions = (folder: any) => {
    Alert.alert(
      'Folder Options',
      folder.name,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Edit', 
          onPress: () => {
            setEditingId(folder.id);
            setFolderName(folder.name);
            setFolderDesc(folder.description || '');
            setShowModal(true);
          } 
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Confirm Delete', 'Are you sure you want to delete this folder?', [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Delete', 
                style: 'destructive',
                onPress: async () => {
                  try {
                    const res = await deleteGroupFolder({ id: id as string, folderId: folder.id }).unwrap();
                    if (res.success) refetch();
                  } catch (err) {
                    toast.error('Error', 'Failed to delete folder.');
                  }
                }
              }
            ]);
          } 
        }
      ]
    );
  };

  const isSaving = isCreating || isUpdating;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Folders</Text>
            <Text style={styles.headerSubtitle}>Manage and organize your photo folders</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
           <TouchableOpacity style={styles.actionBtnOutline}>
             <ArrowRightLeft color="#333" size={14} />
             <Text style={styles.actionBtnOutlineText}>Transfer</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.actionBtnOutline}>
             <AlignJustify color="#333" size={14} />
             <Text style={styles.actionBtnOutlineText}>Rearrange</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.saveBtn} onPress={openCreateModal}>
             <FolderPlus color="#fff" size={14} />
             <Text style={styles.saveBtnText}>Create</Text>
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 50 }} />
        ) : folders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
               <Folder color="#C7C7CC" size={32} />
            </View>
            <Text style={styles.emptyTitle}>0 folders</Text>
            <Text style={styles.emptySub}>Create a folder to start organizing photos.</Text>
          </View>
        ) : (
          folders.map((folder: any, index: number) => (
            <View key={folder.id || index} style={styles.folderCard}>
              <View style={styles.folderLeft}>
                <View style={styles.folderIconBox}>
                  <Folder color="#FF6B00" size={20} fill="#FFF0E5" />
                </View>
                <View>
                  <Text style={styles.folderName}>{folder.name}</Text>
                  <Text style={styles.folderInfo}>{folder.photoCount || 0} photos</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.moreBtn} onPress={() => handleFolderOptions(folder)}>
                <MoreVertical color="#999" size={20} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Folder Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Folder' : 'Create New Folder'}</Text>
            <Text style={styles.modalSub}>{editingId ? 'Update folder details' : 'Organize your photos into folders'}</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Folder Name" 
              value={folderName} 
              onChangeText={setFolderName} 
            />
            
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Description (Optional)" 
              value={folderDesc} 
              onChangeText={setFolderDesc} 
              multiline
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowModal(false)} disabled={isSaving}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalCreateBtn, isSaving && { opacity: 0.7 }]} onPress={handleSaveFolder} disabled={isSaving}>
                {isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalCreateText}>{editingId ? 'Save' : 'Create'}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backBtn: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  headerSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionBtnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, backgroundColor: '#F9FAFB' },
  actionBtnOutlineText: { fontSize: 13, fontWeight: '600', color: '#333', marginLeft: 6 },
  saveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6B00', paddingVertical: 8, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13, marginLeft: 6 },

  content: { flex: 1, padding: 15 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F2F2F7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  emptySub: { fontSize: 13, color: '#888', marginTop: 4 },

  folderCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 10 },
  folderLeft: { flexDirection: 'row', alignItems: 'center' },
  folderIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF0E5', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  folderName: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 2 },
  folderInfo: { fontSize: 12, color: '#666' },
  moreBtn: { padding: 5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#666', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 14, color: '#111', marginBottom: 15 },
  textArea: { height: 80, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalCancelBtn: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 },
  modalCancelText: { color: '#666', fontWeight: '600', fontSize: 14 },
  modalCreateBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, minWidth: 80, alignItems: 'center' },
  modalCreateText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
