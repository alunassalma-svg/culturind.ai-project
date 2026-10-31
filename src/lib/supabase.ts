import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const authConfigured = Boolean(supabaseUrl?.startsWith('https://') && supabaseAnonKey && !supabaseAnonKey.includes('your-'));
// A safe inert client allows guest learning when account configuration is absent.
export const supabase = createClient(authConfigured ? supabaseUrl : 'https://unconfigured.invalid', authConfigured ? supabaseAnonKey : 'not-configured', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type AuthSession = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];
export type AuthUser = Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];
