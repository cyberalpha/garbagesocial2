// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ioyzldxlukjjxwafhqjw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveXpsZHhsdWtqanh3YWZocWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NTQwMzcsImV4cCI6MjA1OTEzMDAzN30.0NQ0wfBwRwizoFB9MHYK__tTgJWUmdm7hZPBUwi5XHA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);