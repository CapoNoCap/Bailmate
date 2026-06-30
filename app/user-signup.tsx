import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function UserSignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [emergencyConsent, setEmergencyConsent] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const userId = data?.user?.id;

      if (!userId) {
        Alert.alert(
          'Check your email',
          'Account created. Verify your email, then log in.'
        );
        router.replace('/login');
        return;
      }

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            auth_user_id: userId,
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            emergency_contact_name: emergencyName.trim(),
            emergency_contact_phone: emergencyPhone.trim(),
            emergency_contact_relationship: relationship.trim(),
            emergency_contact_consent: emergencyConsent,
          },
        ]);

      if (profileError) throw profileError;

      Alert.alert(
        'Account created',
        'Your BailMate user account is ready.'
      );

router.replace(`/check-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);router.replace(`/check-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);    } catch (error: any) {
      Alert.alert(
        'Signup failed',
        error?.message || 'Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create User Account</Text>

      <Text style={styles.subtitle}>
        Save your information and add an emergency contact.
      </Text>

      {/* USER INFO */}
      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="#6B7280"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#6B7280"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor="#6B7280"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#6B7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* EMERGENCY CONTACT */}
      <Text style={styles.sectionTitle}>Emergency Contact</Text>

      <TextInput
        style={styles.input}
        placeholder="Emergency contact name"
        placeholderTextColor="#6B7280"
        value={emergencyName}
        onChangeText={setEmergencyName}
      />

      <TextInput
        style={styles.input}
        placeholder="Emergency contact phone"
        placeholderTextColor="#6B7280"
        value={emergencyPhone}
        onChangeText={setEmergencyPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Relationship (e.g. Mother, Friend)"
        placeholderTextColor="#6B7280"
        value={relationship}
        onChangeText={setRelationship}
      />

      <View style={styles.consentBox}>
        <Switch
          value={emergencyConsent}
          onValueChange={setEmergencyConsent}
        />
        <Text style={styles.consentText}>
          I authorize BailMate to notify my emergency contact if I submit a help request.
        </Text>
      </View>

      {/* BUTTON */}
      <Pressable
        style={[styles.button, loading && styles.disabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#E5E7EB',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: 'navy',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'navy',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 14,
    fontSize: 16,
    color: '#111827',
  },
  consentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 14,
    paddingVertical: 18,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: 'navy',
    fontWeight: '700',
  },
});