import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mdrxnycolkuuvszzzwqi.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnhueWNvbGt1dXZzenp6d3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMzkwNTcsImV4cCI6MjEwMjgxNTA1N30.hEl52V14VF47U1hQF6uzJGuMSQ05XLVsBq3x6fcimTI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
