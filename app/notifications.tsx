import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
const loadNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    Alert.alert('Error', error.message);
    return;
  }
 
  setNotifications((data ?? []) as Notification[]);
};

 const markAsRead = async (id: string) => {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);

  loadNotifications();
};

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
       renderItem={({ item }) => (
  <Pressable
    style={[styles.card, !item.read && styles.unreadCard]}
    onPress={() => markAsRead(item.id)}
  >
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.body}>{item.body}</Text>
    <Text style={styles.date}>
      {new Date(item.created_at).toLocaleString()}
    </Text>
  </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F3F4F6' },
  title: { fontSize: 32, fontWeight: '900', color: 'navy', marginBottom: 16 },
  button: {
    backgroundColor: 'navy',
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  buttonText: { color: 'white', fontWeight: '800', textAlign: 'center' },
  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  unreadCard: {
    borderLeftWidth: 6,
    borderLeftColor: 'red'
  },
  cardTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
  body: { fontSize: 15, color: '#374151', marginTop: 6 },
  date: { fontSize: 12, color: '#6B7280', marginTop: 10 },
});