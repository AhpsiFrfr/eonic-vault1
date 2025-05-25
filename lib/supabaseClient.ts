import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// Mock client for development when environment variables are missing
const createMockSupabase = () => {
  console.log('[MOCK] Using mock Supabase implementation');
  
  return {
    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            console.log(`[MOCK] ${table}.select('${columns}').eq('${column}', '${value}').single()`);
            return { data: null, error: null };
          },
          then: (callback: any) => callback({ data: [], error: null })
        }),
        then: (callback: any) => callback({ data: [], error: null })
      }),
      insert: (data: any) => ({
        select: (columns: string = '*') => ({
          single: async () => {
            console.log(`[MOCK] ${table}.insert().select('${columns}').single()`);
            return { data: { id: `mock-${Date.now()}`, ...data }, error: null };
          },
          then: (callback: any) => callback({ data: null, error: null })
        }),
        then: (callback: any) => callback({ data: null, error: null })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
        then: (callback: any) => callback({ data: null, error: null })
      }),
      upsert: (data: any) => ({
        select: (columns: string = '*') => ({
          single: async () => {
            console.log(`[MOCK] ${table}.upsert().select('${columns}').single()`);
            return { data: { id: `mock-${Date.now()}`, ...data }, error: null };
          },
          then: (callback: any) => callback({ data: null, error: null })
        }),
        then: (callback: any) => callback({ data: null, error: null })
      })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null })
    }
  } as any;
};

// Create the client - use mock if credentials are placeholders
export const supabase = (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder'))
  ? createMockSupabase()
  : createClient(supabaseUrl, supabaseAnonKey); 