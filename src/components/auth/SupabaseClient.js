
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_supabase_Url
const supabaseKey = import.meta.env.VITE_supabase_Key

export const supabase = createClient(supabaseUrl, supabaseKey)