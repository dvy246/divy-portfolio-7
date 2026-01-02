import { createClient } from '@supabase/supabase-js';

// ==================================================================================
// ⚡️ GLOBAL CONNECTION CONFIGURATION
// Keys hardcoded as requested for instant fix.
// ==================================================================================

const HARDCODED_URL = "https://nbpykghpwxajkaycyygo.supabase.co";
const HARDCODED_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5icHlrZ2hwd3hhamtheWN5eWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzODAsImV4cCI6MjA4MjY4NTM4MH0.8EMwI3Z2N35uBqF9JXMN-JVFjPqUtmlGuIzGDEkHZsc";

// ==================================================================================

let supabaseInstance = null;

try {
    const getEnv = (key: string) => {
        let val = undefined;
        try {
            // @ts-ignore
            if (typeof import.meta !== 'undefined' && import.meta.env) {
                // @ts-ignore
                val = import.meta.env[key];
            }
        } catch (e) {}
        
        if (!val) {
            try {
                if (typeof localStorage !== 'undefined') {
                    val = localStorage.getItem(key);
                }
            } catch (e) {}
        }
        return val;
    };

    // Priority: 1. Hardcoded (Instant Fix) -> 2. Env -> 3. LocalStorage
    const supabaseUrl = HARDCODED_URL || getEnv('VITE_SUPABASE_URL') || getEnv('REACT_APP_SUPABASE_URL');
    const supabaseKey = HARDCODED_KEY || getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('REACT_APP_SUPABASE_ANON_KEY');

    if (supabaseUrl && supabaseKey && typeof supabaseUrl === 'string' && supabaseUrl.startsWith('http')) {
        supabaseInstance = createClient(supabaseUrl, supabaseKey);
    } else {
        console.warn("Supabase credentials missing or invalid.");
    }

} catch (e) {
    console.error("Critical Error initializing Supabase client:", e);
}

export const supabase = supabaseInstance;