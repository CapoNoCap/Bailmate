import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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

export default function NewLeadsScreen() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    loadNewLeads();
  }, []);

  const loadNewLeads = async () => {
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
  .or('lead_status.eq.new,lead_status.is.null')
  .order('created_at', { ascending: false });

      if (error) throw error;

      setLeads((data ?? []) as Lead[]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Could not load new leads.');
    } finally {
      setLoading(false);
    }
  };

  const renderLead = ({ item }: { item: Lead }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {item.requester_name || 'Unknown requester'}
      </Text>

      <Text style={styles.meta}>Case: {item.case_type || 'Not provided'}</Text>
      <Text style={styles.meta}>
        Location: {item.requester_location || 'Not provided'} {item.zip_code || ''}
      </Text>
      <Text style={styles.meta}>Status: {item.lead_status || 'new'}</Text>

      <Text style={styles.description}>
        {item.description || 'No description provided.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Leads</Text>

      <Pressable style={styles.refreshButton} onPress={loadNewLeads}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Refresh'}</Text>
      </Pressable>

      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        renderItem={renderLead}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>No New Leads</Text>
              <Text style={styles.meta}>New leads will appear here.</Text>
            </View>
          ) : null
        }
      />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5E7EB', padding: 20 },
  title: { fontSize: 34, fontWeight: '900', color: 'navy', marginBottom: 20 },
  refreshButton: { backgroundColor: '#DC2626', padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 16 },
  card: { backgroundColor: 'white', borderRadius: 18, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 12 },
  meta: { fontSize: 17, color: '#374151', marginBottom: 8 },
  description: { fontSize: 16, color: '#374151', marginTop: 8 },
  listContent: { paddingBottom: 100 },
  backButton: { backgroundColor: 'navy', padding: 16, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 17, fontWeight: '800' },
});