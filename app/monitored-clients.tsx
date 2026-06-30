import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { supabase } from '../lib/supabase';

type MonitoredClient = {
  id: string;
  created_at: string;
  provider_id: string;
  monitoring_enabled: boolean;
  alert_priority: number | null;
  subscription_status: string | null;

  leads?: {
    requester_name?: string;
    requester_location?: string;
    zip_code?: string;
    case_type?: string;
    phone?: string;
  };
};

export default function MonitoredClientsScreen() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<MonitoredClient[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('provider_clients')
        .select(`
  *,
  leads (
    requester_name,
    requester_location,
    case_type
  )
`)
        .eq('monitoring_enabled', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClients((data ?? []) as MonitoredClient[]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not load monitored clients.');
    } finally {
      setLoading(false);
    }
  };

  const removeMonitoring = async (id: string) => {
    const { error } = await supabase
      .from('provider_clients')
      .update({ monitoring_enabled: false })
      .eq('id', id);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Removed', 'Client monitoring has been turned off.');
    loadClients();
  };

 const renderClient = ({ item }: { item: MonitoredClient }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      {item.leads?.requester_name || 'Unknown Client'}
    </Text>

    <Text style={styles.meta}>
      Location: {item.leads?.requester_location || 'Not provided'}
    </Text>

    <Text style={styles.meta}>
      Case Type: {item.leads?.case_type || 'Not provided'}
    </Text>

    <Pressable
      style={styles.removeButton}
      onPress={() => removeMonitoring(item.id)}
    >
      <Text style={styles.buttonText}>
        Remove Monitoring
      </Text>
    </Pressable>
  </View>
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitored Clients</Text>
      <Text style={styles.subtitle}>
        Active clients being tracked by this provider.
      </Text>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </Pressable>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={renderClient}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No monitored clients yet</Text>
              <Text style={styles.emptyText}>
                Tap “Monitor Client” from a lead to add someone here.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: 'navy',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 18,
  },
  backButton: {
    backgroundColor: 'navy',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },
  meta: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 5,
  },
  activeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
    marginTop: 10,
    marginBottom: 14,
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyBox: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 24,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#4B5563',
  },
});