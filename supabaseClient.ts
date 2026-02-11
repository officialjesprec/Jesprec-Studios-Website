
import { createClient } from '@supabase/supabase-js';

// Add type safety for Vite environment variables
interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

const supabaseUrl = (import.meta as unknown as ImportMeta).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as unknown as ImportMeta).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
