'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, CreditCard, Layers, Landmark } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/lancamentos', label: 'Lançamentos', icon: PlusCircle },
    { href: '/faturas', label: 'Faturas', icon: CreditCard },
    { href: '/categorias', label: 'Categorias', icon: Layers },
    { href: '/contas', label: 'Contas & Cartões', icon: Landmark },
  ]

  return (
    <nav className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 mb-8 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto shadow-xl">
      {/* Logo / Identidade */}
      <div className="flex items-center gap-2 px-3">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-black tracking-wider text-xs uppercase text-slate-200">
          Finance<span className="text-emerald-400">Core</span>
        </span>
      </div>

      {/* Links de Navegação */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/50'
              }`}
            >
              <Icon size={14} />
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* Indicador de Status Local */}
      <div className="hidden md:flex items-center gap-2 px-3 text-[10px] font-mono text-slate-500">
        <span>Ambiente: Dev Local</span>
      </div>
    </nav>
  )
}