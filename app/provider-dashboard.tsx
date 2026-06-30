import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';

type Lead = {
  id: string;
  provider_id: string | null;
  provider_name: string | null;
  requester_name: string | null;
  requester_location: string | null;
  zip_code: string | null;
  case_type: string | null;
  description: string | null;
  need_bail: boolean | null;
  need_attorney: boolean | null;
  created_at: string;
  lead_status: string | null;
};

export default function ProviderDashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showDispatch, setShowDispatch] = useState(true);
  const [providerEmail, setProviderEmail] = useState('');
  const [providerName, setProviderName] = useState('Provider');
  const [providerId, setProviderId] = useState<string | null>(null);

  const [monitoredCount, setMonitoredCount] = useState(0);
const [dispatchRequests, setDispatchRequests] = useState<any[]>([]);
const [dispatchLoading, setDispatchLoading] = useState(true);
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userEmail = user?.email ?? '';
      setProviderEmail(userEmail);

      if (!userEmail) {
        throw new Error('No logged-in provider email was found.');
      }

      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .select('id, name, email')
        .ilike('email', userEmail)
        .maybeSingle();

      if (providerError) throw providerError;

      if (!provider) {
        throw new Error(
          'No provider record matches this login email. Add the same email to the provider row in Supabase.'
        );
      }

      setProviderId(provider.id);
      setProviderName(provider.name || 'Provider');

      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('provider_id', provider.id)
        .order('created_at', { ascending: false });

      if (leadError) throw leadError;

      const normalized = ((leadData ?? []) as Lead[]).map((lead) => ({
        ...lead,
        lead_status: lead.lead_status ?? 'new',
      }));

      setLeads(normalized);
      const { count } = await supabase
  .from('provider_clients')
  .select('*', { count: 'exact', head: true })
  .eq('provider_id', provider.id)
  .eq('monitoring_enabled', true);

setMonitoredCount(count || 0);
const { count: UnreadCountResult } = await supabase
  .from('notifications')
  .select('*', { count: 'exact', head: true })
  .eq('provider_id', provider.id)
  .eq('read', false);

setUnreadCount(count || 0);
const { data: dispatchData, error: dispatchError } = await supabase
  .from('dispatch_requests')
  .select('*')
  .order('created_at', { ascending: false });

if (dispatchError) {
  throw dispatchError;
}

setDispatchRequests(dispatchData ?? []);

    } catch (error: any) {
      Alert.alert(
        'Dashboard error',
        error?.message || 'Could not load provider leads.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ lead_status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      setLeads((current) =>
        current.map((lead) =>
          lead.id === leadId ? { ...lead, lead_status: newStatus } : lead
        )
      );
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Could not update lead status.');
    }
  };

  const newLeads = useMemo(
    () => leads.filter((lead) => (lead.lead_status ?? 'new') === 'new'),
    [leads]
  );

  const contactedLeads = useMemo(
    () => leads.filter((lead) => lead.lead_status === 'contacted'),
    [leads]
  );

  const closedLeads = useMemo(
    () => leads.filter((lead) => lead.lead_status === 'closed'),
    [leads]
  );

const monitorClient = async (lead: Lead) => {
  if (!providerId) return;

  const { error } = await supabase
    .from('provider_clients')
    .insert({
      provider_id: providerId,
    lead_id: lead.id,
      monitoring_enabled: true,
      alert_priority: 1,
      subscription_status: 'active'
    });

  if (error) {
    Alert.alert('Error', error.message);
    return;
  }

  Alert.alert('Success', 'Client added to monitored list');

  loadDashboard();
};

  const renderLeadCard = ({ item }: { item: Lead }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {item.requester_name || 'Unknown requester'}
        </Text>

        <Text style={styles.meta}>
          Location: {item.requester_location || 'Not provided'}
        </Text>
        <Text style={styles.meta}>ZIP: {item.zip_code || 'Not provided'}</Text>
        <Text style={styles.meta}>
          Case Type: {item.case_type || 'Not provided'}
        </Text>
        <Text style={styles.meta}>
          Needs:{' '}
          {item.need_bail ? 'Bail ' : ''}
          {item.need_attorney ? 'Attorney' : ''}
          {!item.need_bail && !item.need_attorney ? 'None selected' : ''}
        </Text>

        <Text style={styles.statusText}>
          Status: {(item.lead_status ?? 'new').toUpperCase()}
        </Text>

        <Text style={styles.descriptionLabel}>Details</Text>
        <Text style={styles.description}>
          {item.description || 'No description provided.'}
        </Text>

        <Text style={styles.date}>
          Submitted: {new Date(item.created_at).toLocaleString()}
        </Text>

        <View style={styles.buttonRow}>
          {(item.lead_status ?? 'new') === 'new' && (
            <Pressable
              style={styles.contactButton}
              onPress={() => updateLeadStatus(item.id, 'contacted')}
            >
              <Text style={styles.buttonText}>Mark Contacted</Text>
            </Pressable>
          )}

          {(item.lead_status ?? 'new') !== 'closed' && (
            <Pressable
              style={styles.closeButton}
              onPress={() => updateLeadStatus(item.id, 'closed')}
            >
              <Text style={styles.buttonText}>Close Deal</Text>
            </Pressable>
          )}

          <Pressable
  style={styles.monitorButton}
  onPress={() => monitorClient(item)}
>
  <Text style={styles.buttonText}>Monitor Client</Text>
</Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Provider Dashboard</Text>
      <Text style={styles.subtitle}>{providerName}</Text>
      <Text style={styles.emailText}>
        Signed in as: {providerEmail || 'Provider'}
      </Text>

      <View style={styles.summaryRow}>

     <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{newLeads.length}</Text>
          <Text style={styles.summaryLabel}>New</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{contactedLeads.length}</Text>
          <Text style={styles.summaryLabel}>Contacted</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{closedLeads.length}</Text>
          <Text style={styles.summaryLabel}>Closed</Text>
        </View>
      </View>

<View style={styles.summaryCard}>
  <Text style={styles.summaryNumber}>
    {monitoredCount}
  </Text>

  <Text style={styles.summaryLabel}>
    Monitored
  </Text>
</View>

      <View style={styles.topRow}>
        <Pressable style={styles.refreshButton} onPress={loadDashboard}>
          <Text style={styles.topButtonText}>
            {loading ? 'Loading...' : 'Refresh'}
          </Text>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.topButtonText}>Log Out</Text>
        </Pressable>
      </View>

<Pressable
  style={styles.monitorButton}
  onPress={() => router.push('/monitored-clients')}
>
  <Text style={styles.monitorButtonText}>
    View Monitored Clients
  </Text>
</Pressable>

<Pressable
  style={styles.monitorButton}
  onPress={() => router.push('/notifications')}
>
  <Text style={styles.monitorButtonText}>
View Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}  </Text>
</Pressable>

<Pressable
  style={styles.collapseHeader}
onPress={() => router.push('/active-dispatches')}
>
  <Text style={styles.collapseText}>
  ▶ Active Dispatch Requests ({dispatchRequests.length})
</Text>
</Pressable>


     <Pressable
  style={styles.collapseHeader}
onPress={() => router.push('/new-leads')}
>
  <Text style={styles.collapseText}>▶ New Leads ({newLeads.length})</Text>
</Pressable>

<Pressable
  style={styles.collapseHeader}
onPress={() => router.push('/contacted-leads')}
>
  <Text style={styles.collapseText}>▶ Contacted ({contactedLeads.length})</Text>
</Pressable>

<Pressable
  style={styles.collapseHeader}
onPress={() => router.push('/closed-deals')}
>
  <Text style={styles.collapseText}>▶ Closed Deals ({closedLeads.length})</Text>
</Pressable>

<Pressable
  style={styles.collapseHeader}
onPress={() => router.push('/monitored-clients')}
>
  <Text style={styles.collapseText}>▶ Monitored Clients ({monitoredCount})</Text>
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
    fontSize: 28,
    fontWeight: '800',
    color: 'navy',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    width: '31%',
backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: 'navy',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '700',
    marginTop: 4,
  },
  topRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  refreshButton: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 14,
    paddingVertical: 14,
  },
  logoutButton: {
  flex: 1,
  backgroundColor: 'navy',
  borderRadius: 14,
  paddingVertical: 14,
},

monitorButton: {
  backgroundColor: '#111827',
  paddingVertical: 14,
  borderRadius: 14,
  alignItems: 'center',
  marginBottom: 20,
},

monitorButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '800',
},

topButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    marginTop: 6,
  },

collapseHeader: {
  backgroundColor: 'white',
  borderRadius: 14,
  padding: 18,
  marginBottom: 12,
},

collapseText: {
  fontSize: 18,
  fontWeight: '800',
  color: '#111827',
},

  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
    minHeight: 90,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  statusText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '800',
    color: 'navy',
  },
  descriptionLabel: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '800',
    color: 'navy',
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 21,
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: '#6B7280',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  contactButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  emptyBox: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 24,
    marginTop: 8,
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
  },
});