import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

type Provider = {
  id: string;
  name: string;
  type: string;
  phone: string | null;
  rating: number;
  review_count: number;
  about: string | null;
  latitude: number;
  longitude: number;
  zip_code: string | null;
  is_active: boolean;
};

export default function ProviderDetail() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const id = String(params.id ?? '');
  const caseType = String(params.caseType ?? '');
  const description = String(params.description ?? '');
  const needBail = String(params.needBail ?? 'false') === 'true';
  const needAttorney = String(params.needAttorney ?? 'false') === 'true';
  const userName = String(params.name ?? '');
  const userLocation = String(params.location ?? '');
  const zipCode = String(params.zipCode ?? '');

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProvider = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('providers_deduped')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Provider ID sent to screen:', id);
      console.log('Provider query result:', data);
      console.log('Provider query error:', error);

      if (error) {
        setProvider(null);
      } else {
        setProvider(data as Provider);
      }

      setLoading(false);
    };

    if (id) {
      loadProvider();
    } else {
      setLoading(false);
    }
  }, [id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: provider?.name ?? 'Provider Details',
    });
  }, [navigation, provider]);

  const matchReasons = useMemo(() => {
    if (!provider) return [];

    const reasons: string[] = [];

    if (needBail && provider.type === 'Bail Bondsman') {
      reasons.push('Strong bail match for your situation');
    }

    if (needAttorney && provider.type.toLowerCase().includes('attorney')) {
      reasons.push('Matches your need for legal representation');
    }

    if (provider.rating >= 4.7) {
      reasons.push('Highly rated with strong customer reviews');
    }

    if (reasons.length === 0) {
      reasons.push('Recommended based on your request');
    }

    return reasons;
  }, [provider, needBail, needAttorney]);

  const handleCallNow = async () => {
    if (!provider?.phone) return;

    const phoneUrl = `tel:${provider.phone}`;
    const supported = await Linking.canOpenURL(phoneUrl);

    if (supported) {
      await Linking.openURL(phoneUrl);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading provider...</Text>
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Provider not found</Text>
        <Text style={styles.subText}>The selected provider could not be loaded.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{provider.name}</Text>

      <View style={styles.badgeRow}>
        <Text style={styles.typeBadge}>{provider.type}</Text>
        <Text style={styles.ratingBadge}>
          ⭐ {provider.rating} ({provider.review_count})
        </Text>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.about}>{provider.about ?? 'No description available.'}</Text>

      <Text style={styles.sectionTitle}>Why this is a match</Text>
      <View style={styles.reasonBox}>
        {matchReasons.map((reason, index) => (
          <Text key={index} style={styles.reasonText}>
            • {reason}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.info}>Phone: {provider.phone ?? 'Not available'}</Text>

      <Pressable style={styles.callButton} onPress={handleCallNow}>
        <Text style={styles.callButtonText}>Call Now</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() =>
          router.push({
            pathname: '/request-help',
            params: {
              providerId: provider.id,
              providerName: provider.name,
              name: userName,
              location: userLocation,
              zipCode,
              caseType,
              description,
              needBail: String(needBail),
              needAttorney: String(needAttorney),
            },
          })
        }
      >
        <Text style={styles.secondaryButtonText}>Request Help</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
  },
  subText: {
    marginTop: 8,
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  typeBadge: {
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'navy',
    marginBottom: 10,
    marginTop: 6,
  },
  about: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 14,
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 18,
  },
  reasonBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
  },
  reasonText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#374151',
  },
  info: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 14,
    fontSize: 15,
    color: '#111827',
    marginBottom: 18,
  },
  callButton: {
    backgroundColor: 'red',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  callButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'navy',
    padding: 18,
    borderRadius: 14,
  },
  secondaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
});