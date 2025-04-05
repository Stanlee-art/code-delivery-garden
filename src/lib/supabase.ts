
import { createClient } from '@supabase/supabase-js';

// Create a temporary dummy client if no environment variables are available
// This prevents the app from crashing on initial load
const createDummyClient = () => {
  console.warn(
    'Using dummy Supabase client. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  );
  
  // Return a stub client that matches the shape of the real Supabase client
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: { message: "Supabase credentials not configured" } }),
      signUp: async () => ({ data: null, error: { message: "Supabase credentials not configured" } }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({ data: [], error: null }),
        }),
        order: () => ({ data: [], error: null }),
        data: [],
        error: null,
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
          data: null,
          error: null,
        }),
        data: null,
        error: null,
      }),
      update: () => ({
        eq: () => ({ data: null, error: null }),
        match: () => ({ data: null, error: null }),
        data: null,
        error: null,
      }),
      delete: () => ({
        eq: () => ({ data: null, error: null }),
        match: () => ({ data: null, error: null }),
        data: null,
        error: null,
      }),
      upsert: async () => ({ data: null, error: null }),
    }),
  };
};

// Get environment variables or empty strings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Export either a real client or a dummy client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDummyClient();
