import { createClient } from '@supabase/supabase-js';

// ==================================================================================
// ⚡️ GLOBAL CONNECTION CONFIGURATION
// To make your changes appear on ALL devices (not just this laptop),
// PASTE YOUR KEYS INSIDE THE QUOTES BELOW.
// ==================================================================================

const HARDCODED_URL = ""; // e.g., "https://xyzcompany.supabase.co"
const HARDCODED_KEY = ""; // e.g., "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// ==================================================================================

let supabaseInstance = null;

try {
    const getEnv = (key: string) => {
        let val = undefined;
        // 1. Try Vite Environment Variables
        try {
            // @ts-ignore
            if (typeof import.meta !== 'undefined' && import.meta.env) {
                // @ts-ignore
                val = import.meta.env[key];
            }
        } catch (e) {}

        // 2. Try LocalStorage (Admin Dashboard Fallback - Local Device Only)
        if (!val) {
            try {
                if (typeof localStorage !== 'undefined') {
                    val = localStorage.getItem(key);
                }
            } catch (e) {}
        }
        return val;
    };

    // Priority: 1. Hardcoded (Fixes persistence) -> 2. .env (Best Practice) -> 3. LocalStorage (Admin Panel)
    const supabaseUrl = HARDCODED_URL || getEnv('VITE_SUPABASE_URL') || getEnv('REACT_APP_SUPABASE_URL');
    const supabaseKey = HARDCODED_KEY || getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('REACT_APP_SUPABASE_ANON_KEY');

    // Only attempt creation if we have valid-looking strings to avoid crashes
    if (supabaseUrl && supabaseKey && typeof supabaseUrl === 'string' && supabaseUrl.startsWith('http')) {
        supabaseInstance = createClient(supabaseUrl, supabaseKey);
    } else {
        if (supabaseUrl || supabaseKey) {
            console.warn("Supabase credentials found but appear invalid. App will run in Demo Mode.");
        } else {
            console.info("No Supabase credentials found. App running in Demo Mode (Static Data).");
        }
    }

} catch (e) {
    console.error("Critical Error initializing Supabase client:", e);
}

export const supabase = supabaseInstance;