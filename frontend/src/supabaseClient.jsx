import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kxzirhavetbjniqgkqtk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4emlyaGF2ZXRiam5pcWdrcXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4ODY0NDUsImV4cCI6MjA1NTQ2MjQ0NX0.LPGlDDKct12cvD1whDSnhl2oMv_AAGUe5l1M53ZHuZU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);