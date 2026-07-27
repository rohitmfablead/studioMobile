import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from '../../utils/routerShim';

export default function EventGalleryScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Gallery</Text>
      <Text style={styles.subtitle}>Event ID: {id}</Text>
      <Text style={styles.info}>Photos for this event will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#999',
  }
});
