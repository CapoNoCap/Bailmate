import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function RequestHelpScreen() {
  const params = useLocalSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const providerId = String(params.providerId ?? '');
  const providerName = String(params.providerName ?? '');
  const name = String(params.name ?? '');
  const location = String(params.location ?? '');
  const zipCode = String(params.zipCode ?? '');
  const caseType = String(params.caseType ?? '');
  const description = String(params.description ?? '');
  const needBail = String(params.needBail ?? 'false') === 'true';
  const needAttorney = String(params.needAttorney ?? 'false') === 'true';

const handleSubmit = async () => {
  try {
    setSubmitting(true);

    const { error } = await supabase
      .from('leads')
      .insert([
        {
          provider_id: providerId,
          provider_name: providerName,
          requester_name: name,
          requester_location: `${location} ${zipCode}`.trim(),
          case_type: caseType,
          description,
          need_bail: needBail,
          need_attorney: needAttorney,
          lead_status: 'new',
        },
      ]);

    if (error) {
      throw error;
    }
const { data: userData } = await supabase.auth.getUser();

const { error: dispatchError } = await supabase
  .from('dispatch_requests')
  .insert({
    user_id: userData.user?.id,
    preferred_provider_id: providerId,
    requester_name: name,
    requester_location: `${location} ${zipCode}`.trim(),
    case_type: caseType,
    description,
    status: 'pending_preferred',
    priority_window_expires_at: new Date(
      Date.now() + 3 * 60 * 1000
    ).toISOString(),
  });

if (dispatchError) {
  throw dispatchError;
}
    try {
      const { error: smsError } = await supabase.functions.invoke(
        'send-provider-sms',
        {
          body: {
            providerId,
            name,
            location,
            zipCode,
            caseType,
            description,
            needBail,
            needAttorney,
          },
        }
      );

      if (smsError) {
        console.log('SMS error:', smsError);
      }
    } catch (smsInvokeError) {
      console.log('SMS invoke failed:', smsInvokeError);
    }

   router.replace(`/success?providerName=${encodeURIComponent(providerName)}`);''
  } catch (error: any) {
    console.log('Submit / SMS error:', error);
    Alert.alert(
      'Error',
      error?.message || 'There was a problem sending the request.'
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Request Help</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Provider</Text>
        <Text style={styles.value}>{providerName || 'Not provided'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{name || 'Not provided'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{location || 'Not provided'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>ZIP Code</Text>
        <Text style={styles.value}>{zipCode || 'Not provided'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Case Type</Text>
        <Text style={styles.value}>{caseType || 'Not provided'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{description || 'Not provided'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Needs</Text>
        <Text style={styles.value}>
          {needBail ? 'Bail needed' : 'No bail selected'}
          {'\n'}
          {needAttorney ? 'Attorney needed' : 'No attorney selected'}
        </Text>
      </View>

      <Pressable
        style={[styles.submitButton, submitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Request</Text>
        )}
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: 'navy',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: 'red',
    padding: 18,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: 'navy',
    padding: 18,
    borderRadius: 14,
  },
  backButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
});