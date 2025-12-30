import { createClient } from '@supabase/supabase-js';

// ✅ CORRECT: Vite uses import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only connect if keys exist, otherwise fallback to null (Demo Mode)
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
