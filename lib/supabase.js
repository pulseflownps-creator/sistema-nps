import { createClient } from '@supabase/supabase-js'

/* =========================
   🔐 VARIÁVEIS
========================= */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/* =========================
   🚀 CLIENTE (SEGURO)
========================= */
let supabase = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  })
} else {
  // ⚠️ NÃO QUEBRA A APP — só avisa
  if (typeof window !== 'undefined') {
    console.error('⚠️ Supabase não configurado. Verifique as variáveis na Vercel.')
  }
}

export { supabase }