import { createClient } from '@supabase/supabase-js';

// Safe environment variable retrieval
const getEnv = (key: string) => {
  // 1. Check localStorage first for runtime overrides (Priority)
  try {
    if (typeof localStorage !== 'undefined') {
      const localVal = localStorage.getItem(key);
      if (localVal) return localVal;
    }
  } catch (e) {}

  // 2. Try Vite's import.meta.env
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  // 3. Try process.env
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (e) {}

  return undefined;
};

const supabaseUrl = getEnv('REACT_APP_SUPABASE_URL');
const supabaseKey = getEnv('REACT_APP_SUPABASE_ANON_KEY');

const createSafeClient = () => {
  if (!supabaseUrl || !supabaseKey) return null;

  try {
    // Validate URL format before attempting to create client
    // invalid URLs cause createClient to throw immediately, crashing the app
    new URL(supabaseUrl); 
    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error("Invalid Supabase URL provided. Falling back to Demo Mode.", error);
    return null;
  }
}

export const supabase = createSafeClient();