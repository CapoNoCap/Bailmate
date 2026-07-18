import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

type DispatchRequest = {
  id: string;
  requester_name: string | null;
  requester_location: string | null;
  case_type: string | null;
  description: string | null;
  status: string | null;
  created_at: string;
  assigned_provider_id?: string | null;
};

function buildEligibilityFilter(providerId: string) {
  return `status.eq.overflow_open,status.eq.pending,and(status.eq.pending_preferred,preferred_provider_id.eq.${providerId})`;
}

export default function ActiveDispatchesScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dispatches, setDispatches] = useState<DispatchRequest[]>([]);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [providerName, setProviderName] = useState('Provider');

  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'No logged-in provider was found.');
        return;
      }

      const { data: provider, error } = await supabase
        .from('providers')
        .select('id, name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!active) return;

      if (error || !provider) {
        Alert.alert('Error', 'No provider record is linked to this login.');
        return;
      }

      setProviderId(provider.id);
      setProviderName(provider.name || 'Provider');
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!providerId) return;

    loadDispatches(providerId);

    const channel = supabase
      .channel('dispatch-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dispatch_requests',
        },
        () => {
          loadDispatches(providerId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [providerId]);

  async function loadDispatches(pid: string) {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('dispatch_requests')
        .select('*')
        .or(buildEligibilityFilter(pid))
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDispatches((data ?? []) as DispatchRequest[]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not load dispatches.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    if (!providerId) return;
    setRefreshing(true);
    await loadDispatches(providerId);
  }

  async function acceptDispatch(item: DispatchRequest) {
    if (!providerId) return;

    try {
      setLoading(true);

      const { data: claimed, error: dispatchError } = await supabase
        .from('dispatch_requests')
        .update({
          status: 'assigned',
          assigned_provider_id: providerId,
        })
        .eq('id', item.id)
        .or(buildEligibilityFilter(providerId))
        .select();

      if (dispatchError) throw dispatchError;

      if (!claimed || claimed.length === 0) {
        Alert.alert('Already claimed', 'This dispatch was already accepted by another provider.');
        await loadDispatches(providerId);
        return;
      }

      const { error: createLeadError } = await supabase
        .from('leads')
        .insert({
          requester_name: item.requester_name,
          requester_location: item.requester_location,
          case_type: item.case_type,
          description: item.description,
          lead_status: 'new',
          provider_id: providerId,
          provider_name: providerName,
        });

      if (createLeadError) throw createLeadError;

      Alert.alert('Accepted', 'Dispatch moved to New Leads.');
      await loadDispatches(providerId);
      router.push('/new-leads');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not accept dispatch.');
    } finally {
      setLoading(false);
    }
  }

  async function declineDispatch(id: string) {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('dispatch_requests')
        .update({
          status: 'declined',
        })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Declined', 'Dispatch declined.');
      if (providerId) await loadDispatches(providerId);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not decline dispatch.');
    } finally {
      setLoading(false);
    }
  }

  function renderDispatch({ item }: { item: DispatchRequest }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚨 New Bail Request</Text>

        <Text style={styles.meta}>
          Name: {item.requester_name || 'Not provided'}
        </Text>

        <Text style={styles.meta}>
          Case: {item.case_type || 'Not provided'}
        </Text>

        <Text style={styles.meta}>
          Location: {item.requester_location || 'Not provided'}
        </Text>

        <Text style={styles.meta}>
          Status: {item.status || 'Pending'}
        </Text>

        <Text style={styles.description}>
          Notes: {item.description || 'No description provided.'}
        </Text>

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.acceptButton}
            onPress={() => acceptDispatch(item)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </Pressable>

          <Pressable
            style={styles.declineButton}
            onPress={() => declineDispatch(item.id)}
          >
            <Text style={styles.buttonText}>Decline</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 Active Dispatches</Text>

      <Pressable style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Refresh'}
        </Text>
      </Pressable>

      {loading && dispatches.length === 0 ? (
        <ActivityIndicator size="large" color="navy" />
      ) : (
        <FlatList
          data={dispatches}
          keyExtractor={(item) => item.id}
          renderItem={renderDispatch}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.card}>
              <Text style={styles.cardTitle}>No Active Dispatches</Text>
              <Text style={styles.meta}>Waiting for new requests...</Text>
            </View>
          }
        />
      )}

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: 'navy',
    marginBottom: 20,
  },

  refreshButton: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
  },

  meta: {
    fontSize: 17,
    color: '#374151',
    marginBottom: 6,
  },

  description: {
    fontSize: 16,
    color: '#374151',
    marginTop: 8,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },

  acceptButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  declineButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  backButton: {
    backgroundColor: 'navy',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
  },

  list: {
    paddingBottom: 100,
  },
});