import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const supabaseUrl = 'https://hajctqjpqszwbmfinxjm.supabase.co'

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhamN0cWpwcXN6d2JtZmlueGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDUxNDcsImV4cCI6MjA5MTYyMTE0N30.vD9G-Y6SXMuH0rraHA7S21tKwyHo3fvbEuYpsdaP6Yo'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)