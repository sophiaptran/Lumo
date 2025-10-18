import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://zfrwxmhepcnquuglfmoq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmcnd4bWhlcGNucXV1Z2xmbW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzgyMTYsImV4cCI6MjA3NjM1NDIxNn0.K4kvbc-01zWQEbxPy0EUuGaj_At7JEFBykuTJWwDal4'

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;