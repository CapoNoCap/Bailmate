import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BailMate</Text>

      <Text style={styles.subtitle}>
        Fast help. Trusted providers. Get connected in seconds.
      </Text>

      <Text
  style={{
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  }}
  onPress={() => router.push('/bail-process')}
>
  Not sure how bail works? Learn the process here.
</Text>

      <View style={styles.buttonGroup}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/intake')}
        >
          <Text style={styles.primaryText}>Need Help</Text>
        </Pressable>

        <Pressable
          style={styles.outlineButton}
          onPress={() => router.push('/user-signup')}
        >
          <Text style={styles.outlineText}>User Sign Up</Text>
        </Pressable>

        <Pressable
          style={styles.outlineButton}
          onPress={() => router.push('/user-login')}
        >
          <Text style={styles.outlineText}>User Log In</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.secondaryText}>Provider Log In</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => router.push('/signup')}>
        <Text style={styles.linkText}>New provider? Create an account</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/provider-dashboard')}>
        <Text style={styles.testText}>Go to Provider Dashboard (TEST)</Text>
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
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: 'navy',
    textAlign: 'center',
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 28,
  },
  primaryButton: {
    backgroundColor: 'red',
    borderRadius: 14,
    paddingVertical: 18,
  },
  primaryText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  outlineButton: {
    backgroundColor: 'white',
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: 'navy',
  },
  outlineText: {
    color: 'navy',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'navy',
    borderRadius: 14,
    paddingVertical: 18,
  },
  secondaryText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  linkText: {
    color: 'navy',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
  },
  testText: {
    color: 'green',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
});