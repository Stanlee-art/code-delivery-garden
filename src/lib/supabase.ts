
import { createClient } from '@supabase/supabase-js';

// Create a temporary dummy client if no environment variables are available
// This prevents the app from crashing on initial load
const createDummyClient = () => {
  console.warn(
    'Using dummy Supabase client. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  );
  
  // Return a stub client that more closely matches the real Supabase client API
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: { message: "Supabase credentials not configured" } }),
      signUp: async () => ({ data: null, error: { message: "Supabase credentials not configured" } }),
      signOut: async () => ({ error: null }),
    },
    from: (table) => ({
      select: (columns) => {
        const builder = {
          eq: (column, value) => ({
            single: async () => ({ data: null, error: null }),
            order: (column, options) => ({ data: [], error: null }),
            data: [],
            error: null,
          }),
          order: (column, options) => ({ data: [], error: null }),
          data: [],
          error: null,
        };
        return builder;
      },
      insert: (values) => ({
        select: (columns) => ({
          single: async () => ({ data: null, error: null }),
          data: null,
          error: null,
        }),
        data: null,
        error: null,
      }),
      update: (values) => ({
        eq: (column, value) => ({ data: null, error: null }),
        match: (query) => ({ data: null, error: null }),
        data: null,
        error: null,
      }),
      delete: () => ({
        eq: (column, value) => ({ data: null, error: null }),
        match: (query) => ({ data: null, error: null }),
        data: null,
        error: null,
      }),
      upsert: async (values) => ({ data: null, error: null }),
    }),
  };
};

// Get environment variables or use the ones from client.ts if available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://sptwspntkjdvhcpklarp.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdHdzcG50a2pkdmhjcGtsYXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTY4ODAsImV4cCI6MjA1OTQzMjg4MH0.cgbna3vffvxiYDyrncJplTf3s7XPWpjzR_odl0Td2Os";

// Export the Supabase client
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDummyClient();
