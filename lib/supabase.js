import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qtwrluqtwnwfesagdwfp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3JsdXF0d253ZmVzYWdkd2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzIzODMsImV4cCI6MjA4OTkwODM4M30.df0zQQwRS1T_CD5bnG5LcRsRTRjgcdm0XHlZuLXXzvE'

export const supabase = createClient(supabaseUrl, supabaseKey)