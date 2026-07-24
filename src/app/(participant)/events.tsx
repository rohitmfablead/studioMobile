import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const EVENTS = [
  { id: '1', title: "Rahul's Wedding", date: '24 Oct 2026', role: 'Guest', cover: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
  { id: '2', title: "Corporate Summit", date: '15 Sep 2026', role: 'Participant', cover: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=800&q=80' },
];

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Events</Text>
      <FlatList
        data={EVENTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/(participant)/event/${item.id}`)}
          >
            <Image source={{ uri: item.cover }} style={styles.cover} />
            <View style={styles.info}>
              <Text style={styles.eventName}>{item.title}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.role}</Text></View>
            </View>
          </TouchableOpacity>
        )}
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden', marginBottom: 20 },
  cover: { height: 120, backgroundColor: '#ddd' },
  info: { padding: 15 },
  eventName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  eventDate: { color: '#666', marginBottom: 10 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  badgeText: { color: '#1565C0', fontSize: 12, fontWeight: 'bold' }
});
