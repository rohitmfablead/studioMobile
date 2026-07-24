import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Detailed insights for your studio</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Views</Text>
        <Text style={styles.cardValue}>12,450</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Downloads</Text>
        <Text style={styles.cardValue}>3,210</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>QR Scans</Text>
        <Text style={styles.cardValue}>890</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Storage Usage</Text>
        <Text style={styles.cardValue}>45 GB / 100 GB</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '45%' }]} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: 30, fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15 },
  cardTitle: { fontSize: 16, color: '#666', marginBottom: 5 },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  progressBar: { height: 10, backgroundColor: '#eee', borderRadius: 5, marginTop: 15 },
  progressFill: { height: '100%', backgroundColor: '#34C759', borderRadius: 5 }
});
