import { createClient } from '@supabase/supabase-js';

// Safe environment variable retrieval with aggressive trimming
const getEnv = (key: string) => {
  let value = undefined;

  // 1. Check localStorage first for runtime overrides (Priority)
  try {
    if (typeof localStorage !== 'undefined') {
      const localVal = localStorage.getItem(key);
      if (localVal) value = localVal;
    }
  } catch (e) {}

  // 2. Try Vite's import.meta.env if not found in local storage
  if (!value) {
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        // @ts-ignore
        value = import.meta.env[key];
      }
    } catch (e) {}
  }

  // 3. Try process.env
  if (!value) {
    try {
      if (typeof process !== 'undefined' && process.env) {
        value = process.env[key];
      }
    } catch (e) {}
  }

  // CRITICAL FIX: Trim whitespace which causes new URL() to fail
  return value ? value.trim() : undefined;
};

const supabaseUrl = getEnv('REACT_APP_SUPABASE_URL');
const supabaseKey = getEnv('REACT_APP_SUPABASE_ANON_KEY');

const createSafeClient = () => {
  if (!supabaseUrl || !supabaseKey) return null;

  try {
    // Validate URL format before attempting to create client
    // invalid URLs cause createClient to throw immediately, crashing the app
    const urlObj = new URL(supabaseUrl); 
    // Ensure it's actually an HTTP/HTTPS url
    if (!urlObj.protocol.startsWith('http')) {
        console.warn("Supabase URL must start with http/https");
        return null;
    }
    
    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error("Invalid Supabase URL provided. Falling back to Demo Mode.", error);
    return null;
  }
}

export const supabase = createSafeClient();