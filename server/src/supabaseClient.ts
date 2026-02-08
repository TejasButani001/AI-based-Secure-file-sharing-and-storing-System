import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-supabase-url' || supabaseKey === 'your-supabase-anon-key') {
    console.error("Error: SUPABASE_URL and SUPABASE_KEY are missing or set to placeholders in .env");
    console.error("Please update .env with your actual Supabase project credentials.");
    process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
