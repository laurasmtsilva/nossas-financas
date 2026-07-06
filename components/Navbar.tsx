'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, CreditCard, ReceiptText, Landmark, Tags, WalletCards, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-4 mb-6 rounded-none md:rounded-xl relative">
      <div className="flex items-center justify-between">
        {/* Logo/Dashboard */}
        <Link href="/" className="flex items-center gap-3 text-xl font-black text-white hover:text-violet-400 transition-colors">
          <img src="/icon.png" alt="Logo" className="w-8 h-8 rounded-full" />
            <div>
              <span className="text-white">Nossas</span>
              <span className="text-[#9D4EDD]">Finanças</span>
            </div>
        </Link>
        
        {/* Botão Hambúrguer para Mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-slate-300 hover:text-white p-1"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
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
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold transition-colors ml-4"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      {/* Menu Mobile Retrátil */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 z-50 flex flex-col p-4 gap-4 shadow-xl">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm font-medium text-slate-300 py-2 border-b border-slate-800/50">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link href="/lancamentos" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm font-medium text-slate-300 py-2 border-b border-slate-800/50">
            <ReceiptText size={16} /> Lançamentos
          </Link>
          <Link href="/faturas" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm font-medium text-slate-300 py-2 border-b border-slate-800/50">
            <CreditCard size={16} /> Faturas
          </Link>
          <Link href="/contas" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm font-medium text-slate-300 py-2 border-b border-slate-800/50">
            <Landmark size={16} /> Contas
          </Link>
          <Link href="/cartoes" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm font-medium text-slate-300 py-2 border-b border-slate-800/50">
            <WalletCards size={16} /> Cartões
          </Link>
          <Link href="/categorias" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm font-medium text-slate-300 py-2 border-b border-slate-800/50">
            <Tags size={16} /> Categorias
          </Link>
          
          <button 
            onClick={() => { setIsOpen(false); handleLogout(); }} 
            className="flex items-center gap-2 text-red-400 text-sm font-bold py-2 mt-2"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      )}
    </nav>
  )
}