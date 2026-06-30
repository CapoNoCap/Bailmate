import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

type Provider = {
  id: string;
  name: string;
  type: string;
  phone: string | null;
  sms_phone: string | null;
  rating: number;
  review_count: number;
  about: string | null;
  latitude: number;
  longitude: number;
  zip_code: string | null;
  is_active: boolean;
};

export default function ResultsScreen() {
  const params = useLocalSearchParams();

  const name = String(params.name ?? '');
  const location = String(params.location ?? '');
  const zipCode = String(params.zipCode ?? '');
  const caseType = String(params.caseType ?? '');
  const description = String(params.description ?? '');
  const needBail = String(params.needBail ?? 'false') === 'true';
  const needAttorney = String(params.needAttorney ?? 'false') === 'true';

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviders = async () => {
      setLoading(true);

      const { data, error } = await supabase
  .from('providers_deduped')
  .select('*')
  .order('name', { ascending: true });

      if (error) {
        console.error('Load providers error:', error);
        setProviders([]);
      } else {
        setProviders((data ?? []) as Provider[]);
      }

      setLoading(false);
    };

    loadProviders();
  }, []);

  const uniqueProviders = useMemo(() => {
    const seen = new Map<string, Provider>();

    for (const provider of providers) {
      const key = provider.name.trim().toLowerCase();

      if (!seen.has(key)) {
        seen.set(key, provider);
        continue;
      }

      const existing = seen.get(key)!;
      if (Number(provider.rating ?? 0) > Number(existing.rating ?? 0)) {
        seen.set(key, provider);
      }
    }

    return Array.from(seen.values()).sort(
      (a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0)
    );
  }, [providers]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Searching for providers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Matches</Text>

      <Pressable
        style={styles.mapButton}
        onPress={() =>
          router.push({
            pathname: '/map',
            params: {
              name,
              location,
              zipCode,
              caseType,
              description,
              needBail: String(needBail),
              needAttorney: String(needAttorney),
            },
          })
        }
      >
        <Text style={styles.mapButtonText}>View Map</Text>
      </Pressable>

      {uniqueProviders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No providers found</Text>
          <Text style={styles.emptyText}>
            Add active providers in Supabase to continue testing.
          </Text>
        </View>
      ) : (
        <FlatList
          data={uniqueProviders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/provider/[id]',
                  params: {
                    id: item.id,
                    providerName: item.name,
                    name,
                    location,
                    zipCode,
                    caseType,
                    description,
                    needBail: String(needBail),
                    needAttorney: String(needAttorney),
                  },
                })
              }
            >
              <Text style={styles.providerName}>{item.name}</Text>
              <Text style={styles.providerType}>{item.type}</Text>
              <Text style={styles.providerMeta}>
                ⭐ {item.rating} ({item.review_count})
              </Text>
              {index === 0 && <Text style={styles.bestMatch}>Best Match</Text>}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    padding: 20,
  },
  centered: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'navy',
    marginBottom: 16,
  },
  mapButton: {
    backgroundColor: 'navy',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 18,
  },
  mapButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  providerType: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '700',
    marginBottom: 6,
  },
  providerMeta: {
    fontSize: 15,
    color: '#4B5563',
  },
  bestMatch: {
    marginTop: 10,
    color: '#B91C1C',
    fontWeight: '800',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
});