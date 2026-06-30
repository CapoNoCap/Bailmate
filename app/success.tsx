import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SuccessScreen() {
  const params = useLocalSearchParams();

  const providerName = String(params.providerName ?? 'the provider');

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.check}>✅</Text>
      </View>

      <Text style={styles.title}>Request Sent</Text>

      <Text style={styles.message}>
        Your request has been sent to {providerName}.
      </Text>

      <Text style={styles.subMessage}>
        They should contact you shortly.
      </Text>

      <Pressable
        style={styles.primaryButton}
        onPress={() => router.replace('/intake')}
      >
        <Text style={styles.primaryButtonText}>Request More Help</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.back()}
      >
        <Text style={styles.secondaryButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconWrap: {
    marginBottom: 20,
  },
  check: {
    fontSize: 64,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: 'navy',
    marginBottom: 14,
  },
  message: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
  },
  subMessage: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: 'red',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 14,
  },
  primaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'navy',
    paddingVertical: 18,
    borderRadius: 16,
  },
  secondaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
  },
});