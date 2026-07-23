'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Landmark } from 'lucide-react'

export default function LoginPage() {
  const [emailAuth, setEmailAuth] = useState('')
  const [senhaAuth, setSenhaAuth] = useState('')
  const [modoLogin, setModoLogin] = useState(true) 
  
  const router = useRouter()

  const lidarComLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailAuth || !senhaAuth) return alert("Preencha todos os campos!")
    
    try { 
      const { error } = await supabase.auth.signInWithPassword({
        email: emailAuth,
        password: senhaAuth,
      })
      
      if (error) throw error
      
      window.location.href = '/'
      
    } catch (error: any) { 
      alert("Erro ao entrar. Verifique suas credenciais.") 
    }
  }

  const lidarComRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailAuth || !senhaAuth) return alert("Preencha todos os campos!")
    
    try { 
      const { error } = await supabase.auth.signUp({
        email: emailAuth,
        password: senhaAuth,
      })
      if (error) throw error
      
      alert("Sucesso! A conta foi criada.")
      setModoLogin(true) 
    } catch (error: any) { 
      alert("Erro ao registrar: " + error.message) 
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
        
        {/* Cabeçalho com o Novo Botão Home / Identidade Visual */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-[#9D4EDD]/10 text-[#9D4EDD] rounded-full mb-4">
            <img src="/icon.png" alt="Logo" className="w-28 h-28 rounded-full" />
          </div>
          
          <Link href="/" className="text-2xl font-extrabold tracking-tight hover:opacity-80 transition-opacity">
            <span className="text-white">Nossas</span>
            <span className="text-[#9D4EDD]">Finanças</span>
          </Link>

          <p className="text-slate-400 text-sm mt-1">
            {modoLogin ? 'Acesse sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={modoLogin ? lidarComLogin : lidarComRegistro} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
            <input 
              type="email" 
              value={emailAuth}
              onChange={(e) => setEmailAuth(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] transition-colors"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
            <input 
              type="password" 
              value={senhaAuth}
              onChange={(e) => setSenhaAuth(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#9D4EDD] hover:bg-[#8e40c9] text-white font-bold py-3 rounded-lg transition-colors mt-2"
          >
            {modoLogin ? 'Entrar' : 'Registrar'}
          </button>
        </form>

        {/* Alternância entre Login e Registro */}
        <div className="mt-6 text-center text-sm text-slate-400">
          {modoLogin ? "Ainda não tem conta? " : "Já possui conta? "}
          <button 
            onClick={() => setModoLogin(!modoLogin)}
            className="text-[#9D4EDD] font-bold hover:underline"
          >
            {modoLogin ? 'Registre-se' : 'Faça login'}
          </button>
        </div>

      </div>
    </main>
  )
}