// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Vite 환경 변수에서 불러오기 (prefix VITE_ 필수)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
