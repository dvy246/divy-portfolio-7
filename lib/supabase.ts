import { createClient } from '@supabase/supabase-js';

// Helper to find the key from any possible source
const getEnv = (key: string) => {
  // 1. Check Vite Environment Variables (The Standard Way)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // 2. Check LocalStorage (The Admin Dashboard Way)
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return undefined;
};

// Check for VITE_ prefix (Priority) or REACT_APP_ (Fallback)
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('REACT_APP_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('REACT_APP_SUPABASE_ANON_KEY');

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;