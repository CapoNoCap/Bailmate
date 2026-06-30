import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PrivacyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.updated}>Last updated: April 2026</Text>

      <Text style={styles.sectionTitle}>1. Information We Collect</Text>
      <Text style={styles.paragraph}>
        BailMate may collect information you provide, including your name,
        contact information, city, ZIP code, case type, and request details.
      </Text>

      <Text style={styles.sectionTitle}>2. How We Use Information</Text>
      <Text style={styles.paragraph}>
        We use your information to connect you with participating providers,
        process requests, improve the app, and communicate with you about your
        request.
      </Text>

      <Text style={styles.sectionTitle}>3. How We Share Information</Text>
      <Text style={styles.paragraph}>
        By submitting a request, you authorize BailMate to share the
        information you provide with relevant service providers, including bail
        bond companies and related professionals, for the purpose of responding
        to your request.
      </Text>

      <Text style={styles.sectionTitle}>4. SMS and Phone Contact</Text>
      <Text style={styles.paragraph}>
        By submitting your request, you agree that providers may contact you by
        phone call or SMS regarding your request. Message and data rates may
        apply depending on your carrier.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Retention</Text>
      <Text style={styles.paragraph}>
        We retain submitted information for operational, recordkeeping, and
        service improvement purposes unless a longer retention period is
        required by law.
      </Text>

      <Text style={styles.sectionTitle}>6. Your Choices</Text>
      <Text style={styles.paragraph}>
        You may request access to or deletion of your information by contacting
        the application operator at the support contact provided in the app or
        business materials.
      </Text>

      <Text style={styles.sectionTitle}>7. Security</Text>
      <Text style={styles.paragraph}>
        We use reasonable administrative and technical safeguards to protect
        your information. However, no system can be guaranteed to be 100%
        secure.
      </Text>

      <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
      <Text style={styles.paragraph}>
        We may update this Privacy Policy from time to time. Continued use of
        the app after updates means you accept the revised policy.
      </Text>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: 'navy',
    marginBottom: 8,
  },
  updated: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 14,
  },
  spacer: {
    height: 30,
  },
});