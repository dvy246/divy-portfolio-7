import { createClient } from '@supabase/supabase-js';

// Safe initialization to prevent app crash (Black Screen)
let supabaseInstance = null;

try {
    const getEnv = (key: string) => {
        let val = undefined;
        // 1. Try Vite Environment Variables (import.meta.env)
        try {
            // @ts-ignore
            if (typeof import.meta !== 'undefined' && import.meta.env) {
                // @ts-ignore
                val = import.meta.env[key];
            }
        } catch (e) {
            // Ignore errors in environments where import.meta is not supported
        }

        // 2. Try LocalStorage (Admin Dashboard Fallback)
        if (!val) {
            try {
                if (typeof localStorage !== 'undefined') {
                    val = localStorage.getItem(key);
                }
            } catch (e) {
                // Ignore SecurityErrors (e.g. if cookies/storage are blocked)
            }
        }
        return val;
    };

    const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('REACT_APP_SUPABASE_URL');
    const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('REACT_APP_SUPABASE_ANON_KEY');

    // Only attempt creation if we have valid-looking strings
    if (supabaseUrl && supabaseKey && typeof supabaseUrl === 'string' && supabaseUrl.startsWith('http')) {
        supabaseInstance = createClient(supabaseUrl, supabaseKey);
    } else if (supabaseUrl || supabaseKey) {
        console.warn("Supabase credentials detected but appear invalid. Client not initialized.");
    }

} catch (e) {
    console.error("Critical Error initializing Supabase client:", e);
    // App continues running without Supabase (Demo Mode)
}

export const supabase = supabaseInstance;