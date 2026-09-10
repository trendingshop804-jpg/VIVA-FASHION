import { createClient } from '@supabase/supabase-js';

// Fallback active project credentials (public publishable key) if env vars are not set at build time
const DEFAULT_URL = 'https://khpajkbkvmhsmmklnapt.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable__63ABrRcohqtL4SS-psFug_PVIoEgg0';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

const supabaseUrl = (rawUrl || '').trim().replace(/^["']|["']$/g, '') || DEFAULT_URL;
const supabaseAnonKey = (rawKey || '').trim().replace(/^["']|["']$/g, '') || DEFAULT_ANON_KEY;

let clientInstance: any;

try {
  clientInstance = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.warn('[Supabase Config Alert] Failed to initialize custom Supabase client, using default fallback:', err);
  clientInstance = createClient(DEFAULT_URL, DEFAULT_ANON_KEY);
}

export const supabase = clientInstance;
