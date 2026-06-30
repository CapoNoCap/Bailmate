import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function UserDashboardScreen() {
  const [fullName, setFullName] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace('/user-login');
      return;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (error) {
      Alert.alert('Profile error', error.message);
      return;
    }

    setFullName(data.full_name || '');
    setEmergencyName(data.emergency_contact_name || '');
    setEmergencyPhone(data.emergency_contact_phone || '');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.value}>{fullName || 'User'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Emergency Contact</Text>
        <Text style={styles.value}>{emergencyName || 'Not added'}</Text>
        <Text style={styles.subvalue}>{emergencyPhone || ''}</Text>
      </View>

      <Pressable style={styles.redButton} onPress={() => router.push('/intake')}>
        <Text style={styles.buttonText}>Need Help</Text>
      </Pressable>

      <Pressable style={styles.blueButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#E5E7EB',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: 'navy',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  label: {
    color: 'navy',
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700',
  },
  subvalue: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 4,
  },
  redButton: {
    backgroundColor: 'red',
    borderRadius: 14,
    paddingVertical: 18,
    marginTop: 16,
  },
  blueButton: {
    backgroundColor: 'navy',
    borderRadius: 14,
    paddingVertical: 18,
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 18,
  },
});