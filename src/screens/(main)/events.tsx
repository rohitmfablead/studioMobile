import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';

const EVENTS = [
  { id: '1', title: "Priya & Rahul Wedding", date: '24 Oct 2026', photos: 1200, cover: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
  { id: '2', title: "Corporate Annual Summit", date: '15 Sep 2026', photos: 850, cover: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=800&q=80' },
];

export default function PhotographerEventsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Manage Events</Text>
        <Text style={styles.subtitle}>Select an event to manage or upload media</Text>

      <FlatList
        data={EVENTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/(main)/event/${item.id}`)}
          >
            <Image source={{ uri: item.cover }} style={styles.cover} />
            <View style={styles.info}>
              <Text style={styles.eventName}>{item.title}</Text>
              <Text style={styles.eventDetails}>{item.date} • {item.photos} Photos</Text>
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
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: 20, fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden', marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cover: { height: 150, backgroundColor: '#ddd' },
  info: { padding: 15 },
  eventName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  eventDetails: { color: '#666', fontSize: 14 }
});
