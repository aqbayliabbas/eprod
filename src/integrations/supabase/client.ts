// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rnfrmobqjqiponkzlmmv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZnJtb2JxanFpcG9ua3psbW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNjE3NTMsImV4cCI6MjA2MzczNzc1M30.FIJmFIEtdaCQS4b3lhHFHmSDik-33HgGOPhk-VsXRCI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);