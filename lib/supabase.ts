import { createClient } from '@supabase/supabase-js';

// Access environment variables. 
// Note: In a real deployment, these would be in .env.local
// For this demo, we check if they exist, otherwise we return null which triggers the fallback mode.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
