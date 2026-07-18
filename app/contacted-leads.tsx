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

type Lead = {
  id: string;
  requester_name: string | null;
  requester_location: string | null;
  zip_code: string | null;
  case_type: string | null;
  description: string | null;
  lead_status: string | null;
  created_at: string;
};

export default function ContactedLeadsScreen() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    loadContactedLeads();
  }, []);

  async function loadContactedLeads() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No logged-in provider was found.');
      }

      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (providerError) throw providerError;

      if (!provider) {
        throw new Error('No provider record is linked to this login.');
      }

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('provider_id', provider.id)
        .eq('lead_status', 'contacted')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLeads(data || []);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  }

  function renderLead({ item }: { item: Lead }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {item.requester_name || 'Unknown'}
        </Text>

        <Text style={styles.meta}>
          Case: {item.case_type || 'Not provided'}
        </Text>

        <Text style={styles.meta}>
          Location: {item.requester_location || 'Not provided'} {item.zip_code ?? ''}
        </Text>

        <Text style={styles.meta}>
          Status: {item.lead_status}
        </Text>

        <Text style={styles.description}>
          {item.description || 'No description provided.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>📞 Contacted Leads</Text>

      <Pressable
        style={styles.refreshButton}
        onPress={loadContactedLeads}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Refresh'}
        </Text>
      </Pressable>

      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        renderItem={renderLead}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                No Contacted Leads
              </Text>
              <Text style={styles.meta}>
                Contacted leads will appear here.
              </Text>
            </View>
          ) : null
        }
      />

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>
          Back to Dashboard
        </Text>
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
    fontSize: 34,
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
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },

  meta: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 6,
  },

  description: {
    fontSize: 15,
    color: '#4B5563',
    marginTop: 10,
  },

  list: {
    paddingBottom: 100,
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
});