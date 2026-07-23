'use client'

import Navbar from '@/components/Navbar' // Importação do componente centralizado
import Link from 'next/link'
import { LayoutDashboard, Wallet, FolderTree, ArrowLeftRight, TrendingUp } from 'lucide-react'

export default function DashboardPlaceholder() {
  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-8">

      {/* Chamada do menu simplificada e unificada */}
      <Navbar />

      {/* ÁREA DO FUTURO DASHBOARD */}
      <div className="max-w-7xl mx-auto mt-20 flex flex-col items-center justify-center text-center p-12 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full mb-4 animate-pulse">
          <TrendingUp size={40} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Central de Inteligência Financeira
        </h1>
        <p className="text-slate-400 max-w-md text-sm sm:text-base mb-6">
          Este espaço se tornará o seu Dashboard consolidado, exibindo receitas, despesas, faturas de cartão e gráficos de desempenho.
        </p>
        <div className="flex gap-3">
          <Link href="/lancamentos" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium px-4 py-2 rounded-lg text-sm transition-colors">
            Ver Lançamentos
          </Link>
          <Link href="/contas" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
            Gerenciar Contas
          </Link>
        </div>
      </div>
    </main>
  )
}