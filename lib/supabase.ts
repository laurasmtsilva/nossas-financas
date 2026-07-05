import { createClient } from '@supabase/supabase-js'

// Buscamos as variáveis. Se não existirem, usamos um texto vazio provisório para não travar a compilação
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Inicializa o cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)