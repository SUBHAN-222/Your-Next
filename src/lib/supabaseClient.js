import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Don't crash the app in dev if keys aren't set yet — just warn loudly.
  console.warn(
    '[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing. ' +
    'Copy .env.example to .env and fill in your project keys from ' +
    'Supabase Dashboard → Project Settings → API.'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

export default supabase
