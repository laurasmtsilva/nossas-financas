'use client'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, CreditCard, ReceiptText, Landmark, Tags, WalletCards, LogOut } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 mb-8 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-8">
        {/* Logo/Dashboard */}
        <Link href="/" className="flex items-center gap-3 text-xl font-black text-white hover:text-violet-400 transition-colors">
          <img src="/icon.png" alt="Logo" className="w-8 h-8 rounded-full" />
          FinanceCore
        </Link>
        
        {/* Menu Principal */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link href="/lancamentos" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
            <ReceiptText size={16} /> Lançamentos
          </Link>
          <Link href="/faturas" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
            <CreditCard size={16} /> Faturas
          </Link>
          <Link href="/contas" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
            <Landmark size={16} /> Contas
          </Link>
          <Link href="/cartoes" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
            <WalletCards size={16} /> Cartões
          </Link>
          <Link href="/categorias" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
            <Tags size={16} /> Categorias
          </Link>
        </div>
      </div>
      
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold transition-colors"
      >
        <LogOut size={16} /> Sair
      </button>
    </nav>
  )
}