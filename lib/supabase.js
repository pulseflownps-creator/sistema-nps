import { createClient } from '@supabase/supabase-js'

/* =========================
   🔐 VARIÁVEIS
========================= */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/* =========================
   ⚠️ VALIDAÇÃO (IMPORTANTE)
========================= */
if (!supabaseUrl || !supabaseKey) {
  throw new Error('⚠️ Supabase não configurado. Verifique o .env.local')
}

/* =========================
   🚀 CLIENTE
========================= */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})