import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ActiveDispatchesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 Active Dispatches</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>New Bail Request</Text>
        <Text style={styles.meta}>Case: DUI</Text>
        <Text style={styles.meta}>Location: B 911</Text>
        <Text style={styles.meta}>Status: Pending</Text>

        <View style={styles.buttonRow}>
          <Pressable style={styles.acceptButton}>
            <Text style={styles.buttonText}>Accept</Text>
          </Pressable>

          <Pressable style={styles.declineButton}>
            <Text style={styles.buttonText}>Decline</Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: 'navy',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
  },
  meta: {
    fontSize: 17,
    color: '#374151',
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'navy',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
  },
});