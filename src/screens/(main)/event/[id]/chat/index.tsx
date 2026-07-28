import { router, useLocalSearchParams } from '../../../../../utils/routerShim';
import { ChevronLeft, MessageCircle } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetGroupParticipantsQuery } from '../../../../../store/apiSlice';

export default function PhotographerChatParticipantList() {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useGetGroupParticipantsQuery({ id: id as string, params: { page: 1, limit: 100 } });
  
  const participants = data?.data || [];
  const insets = useSafeAreaInsets();

  const handleUserClick = (userId: string) => {
    router.push(`/(main)/event/${id}/chat/${userId}`);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => handleUserClick(item.id)}>
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholderAvatar}>
          <Text style={styles.placeholderText}>{item.firstName?.charAt(0) || 'U'}</Text>
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.userRole}>{item.role}</Text>
      </View>
      <MessageCircle color="#666" size={20} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#111" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select User to Chat</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      ) : (
        <FlatList
          data={participants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { padding: 5, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 15 },
  userCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee' },
  placeholderAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 16, fontWeight: '600', color: '#111' },
  userRole: { fontSize: 12, color: '#666', textTransform: 'capitalize', marginTop: 2 },
});
