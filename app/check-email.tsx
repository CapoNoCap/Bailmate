import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CheckEmailScreen() {
  const params = useLocalSearchParams();
  const email = String(params.email || '');

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📧</Text>

      <Text style={styles.title}>Check Your Email</Text>

      <Text style={styles.message}>
        We sent a confirmation link to:
      </Text>

      <Text style={styles.email}>{email}</Text>

      <Text style={styles.note}>
        Please confirm your email before logging in to BailMate.
      </Text>

      <Pressable style={styles.button} onPress={() => router.replace('/user-login')}>
        <Text style={styles.buttonText}>Go to User Log In</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/')}>
        <Text style={styles.link}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    padding: 24,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: 'navy',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 17,
    color: '#374151',
    textAlign: 'center',
  },
  email: {
    fontSize: 18,
    color: 'navy',
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 12,
  },
  note: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 14,
    paddingVertical: 18,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  link: {
    color: 'navy',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
});