'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

export default function Login() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <Auth 
        supabaseClient={supabase} 
        appearance={{ theme: ThemeSupa }}
        providers={['google']} // Opcional: Login com Google
      />
    </div>
  )
}