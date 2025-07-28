// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://eweqwpqgmzyvemwpwric.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZXF3cHFnbXp5dmVtd3B3cmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MjE4NDAsImV4cCI6MjA2Nzk5Nzg0MH0.9Jf2Zoqu6DJMQnnyBwf8KQSkxU4A2K87YJD7ug2c3Ys'

// export const supabase = createClient(supabaseUrl, supabaseKey,
//     // {
//     //     auth: {
//     //         persistSession: true,
//     //         autoRefreshToken: true,
//     //         detectSessionInUrl: true,
//     //     }
//     // }
// );




import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://cqadqqkaytwyebidszti.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYWRxcWtheXR3eWViaWRzenRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MDk3NzksImV4cCI6MjA2OTE4NTc3OX0.1YNnI7wInIHe2enFlkn0PvA4F-BTf7ejVi9hA6GyoU4'
const supabaseUrl = import.meta.env.VITE_supabase_Url
const supabaseKey = import.meta.env.VITE_supabase_Key

export const supabase = createClient(supabaseUrl, supabaseKey)