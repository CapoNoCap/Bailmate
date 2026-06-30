import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function IntakeScreen() {
useEffect(() => {
  checkSession();
}, []);

const checkSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    router.replace('/user-login');
  }
};
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [caseType, setCaseType] = useState('');
  const [description, setDescription] = useState('');
  const [needBail, setNeedBail] = useState(false);
  const [needAttorney, setNeedAttorney] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showDescriptionDone, setShowDescriptionDone] = useState(false);

  const dismissAll = () => {
    Keyboard.dismiss();
    setShowDescriptionDone(false);
  };

  const handleSeeMatches = () => {
    if (!consentChecked) {
      Alert.alert(
        'Consent required',
        'Please agree to the Privacy Policy and contact consent before submitting.'
      );
      return;
    }

    dismissAll();

    router.push({
      pathname: '/results',
      params: {
        name,
        location,
        zipCode,
        caseType,
        description,
        needBail: String(needBail),
        needAttorney: String(needAttorney),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={dismissAll} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <Text style={styles.title}>Tell us what happened</Text>

          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            returnKeyType="done"
            onSubmitEditing={dismissAll}
          />

          <TextInput
            style={styles.input}
            placeholder="City or location"
            placeholderTextColor="#9CA3AF"
            value={location}
            onChangeText={setLocation}
            returnKeyType="done"
            onSubmitEditing={dismissAll}
          />

          <TextInput
            style={styles.input}
            placeholder="ZIP code"
            placeholderTextColor="#9CA3AF"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="number-pad"
            returnKeyType="done"
          />

          <TextInput
            style={styles.input}
            placeholder="DUI / Immigration / Other"
            placeholderTextColor="#9CA3AF"
            value={caseType}
            onChangeText={setCaseType}
            returnKeyType="done"
            onSubmitEditing={dismissAll}
          />

          <View style={styles.textAreaWrap}>
            {showDescriptionDone && (
              <Pressable style={styles.inlineDoneButton} onPress={dismissAll}>
                <Text style={styles.inlineDoneButtonText}>Done</Text>
              </Pressable>
            )}

            <TextInput
              style={styles.textArea}
              placeholder="Briefly describe what happened"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              onFocus={() => setShowDescriptionDone(true)}
            />
          </View>

          <View style={styles.switchCard}>
            <Text style={styles.switchLabel}>Need bail now?</Text>
            <Switch value={needBail} onValueChange={setNeedBail} />
          </View>

          <View style={styles.switchCard}>
            <Text style={styles.switchLabel}>Need attorney too?</Text>
            <Switch value={needAttorney} onValueChange={setNeedAttorney} />
          </View>

          <View style={styles.consentContainer}>
            <Switch value={consentChecked} onValueChange={setConsentChecked} />
            <Text style={styles.consentText}>
              I agree to share my information with participating providers and
              to be contacted by phone or SMS regarding my request.
            </Text>
          </View>

          <Pressable onPress={() => router.push('/privacy')}>
            <Text style={styles.privacyLink}>View Privacy Policy</Text>
          </Pressable>

          <Pressable style={styles.submitButton} onPress={handleSeeMatches}>
            <Text style={styles.submitButtonText}>See Matches</Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#E5E7EB',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'navy',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  textAreaWrap: {
    position: 'relative',
    marginBottom: 18,
  },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 18,
    minHeight: 180,
    fontSize: 18,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  inlineDoneButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: 'navy',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  inlineDoneButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  switchCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  consentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  privacyLink: {
    color: 'navy',
    fontWeight: '700',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: 'red',
    paddingVertical: 20,
    borderRadius: 18,
    marginTop: 10,
    marginBottom: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
});