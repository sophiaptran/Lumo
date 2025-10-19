// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://soyjakxzflnwoliwhgmb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNveWpha3h6Zmxud29saXdoZ21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzgwMDMsImV4cCI6MjA3NjM1NDAwM30.D-9RkAkmmuOIdBzrvMxDpbUWaMaDQMQt2GdPdG_PytA'

export const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase