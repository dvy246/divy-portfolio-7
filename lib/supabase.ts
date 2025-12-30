import { createClient } from '@supabase/supabase-js';

// Safe environment variable retrieval that checks:
// 1. LocalStorage (for runtime config in the browser)
// 2. Vite import.meta.env (if available)
// 3. process.env (for Node/Build environments)
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

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;