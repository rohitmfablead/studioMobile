import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from '../utils/routerShim';

export default function FaceRegistrationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Your Face</Text>
      <Text style={styles.subtitle}>Take a selfie so we can find your photos automatically.</Text>
      
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>Camera Preview Here</Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.replace('/(main)/home')}
      >
        <Text style={styles.buttonText}>Capture & Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  cameraPlaceholder: {
    width: 300,
    height: 400,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 40,
  },
  placeholderText: {
    color: '#999',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});
