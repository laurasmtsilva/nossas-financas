'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { 
  Home, Utensils, Car, Gift, Heart, Briefcase, 
  DollarSign, Coffee, ShoppingBag, Landmark, Wrench, 
  Droplet, Pizza, FileText, User, Folder, Lightbulb,
  ChevronDown, ChevronRight, ArrowUpRight, ArrowDownLeft, Trash2
} from 'lucide-react'

const iconeComponentes: Record<string, React.ComponentType<any>> = {
  Home, Utensils, Car, Gift, Heart, Briefcase, 
  DollarSign, Coffee, ShoppingBag, Landmark, Wrench, 
  Droplet, Pizza, FileText, User, Folder, Lightbulb
}

interface Categoria {
  id: string
  nome: string
  tipo: 'RECEITA' | 'DESPESA'
  parent_id: string | null
  icone: string
}

export default function Categorias() {
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'RECEITA' | 'DESPESA'>('DESPESA')
  const [parentId, setParentId] = useState<string>('root')
  const [iconeSelecionado, setIconeSelecionado] = useState('Folder')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({})
  const [receitasBlcAberto, setReceitasBlcAberto] = useState(true)
  const [despesasBlcAberto, setDespesasBlcAberto] = useState(true)

  async function carregarCategorias() {
    const { data } = await supabase.from('categorias').select('*').order('nome', { ascending: true })
    if (data) setCategorias(data as Categoria[])
  }

  useEffect(() => { carregarCategorias() }, [])

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('categorias').insert([{
      nome: nome.trim(), tipo,
      parent_id: parentId === 'root' ? null : parentId,
      icone: iconeSelecionado
    }])
    setNome(''); setParentId('root'); carregarCategorias()
  }

  async function handleDeletar(id: string) {
    if (confirm('Excluir esta categoria?')) {
      await supabase.from('categorias').delete().eq('id', id)
      carregarCategorias()
    }
  }

  const renderizarCardCategoriaPai = (pai: Categoria) => {
    const PaiIcone = iconeComponentes[pai.icone] || Folder
    const filhos = categorias.filter(c => c.parent_id === pai.id)
    const estaAberto = expandedParents[pai.id] !== false
    const corTipo = pai.tipo === 'RECEITA' ? 'text-emerald-500' : 'text-red-500'

    return (
      <div key={pai.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div onClick={() => setExpandedParents(prev => ({ ...prev, [pai.id]: !estaAberto }))} className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="text-slate-500">{estaAberto ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</div>
            <div className={`p-2 bg-slate-950 rounded-lg ${corTipo}`}><PaiIcone size={18} /></div>
            <span className="font-semibold text-sm">{pai.nome}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleDeletar(pai.id) }} className="text-slate-600 hover:text-red-400"><Trash2 size={16} /></button>
        </div>
        {estaAberto && filhos.map(filho => {
          const FilhoIcone = iconeComponentes[filho.icone] || Folder
          return (
            <div key={filho.id} className="flex items-center justify-between py-2 px-12 bg-slate-950/50 border-t border-slate-800/50 text-sm">
              <div className="flex items-center gap-2 text-slate-400"><FilhoIcone size={14} /> {filho.nome}</div>
              <button onClick={() => handleDeletar(filho.id)} className="text-slate-700 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8">
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit">
          <h1 className="text-xl font-bold mb-6 text-[#9D4EDD]">Nova Categoria</h1>
          <form onSubmit={handleCadastrar} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Pertence a</label>
              <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm">
                <option value="root">Categoria Principal</option>
                {categorias.filter(c => !c.parent_id).map(c => <option key={c.id} value={c.id}>{c.tipo === 'RECEITA' ? '🟢' : '🔴'} {c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nome</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da Categoria" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tipo de Fluxo</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setTipo('RECEITA')} className={`py-2 text-xs font-bold rounded border ${tipo === 'RECEITA' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>🟢 RECEITA</button>
                <button type="button" onClick={() => setTipo('DESPESA')} className={`py-2 text-xs font-bold rounded border ${tipo === 'DESPESA' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>🔴 DESPESA</button>
              </div>
            </div>
            <button type="submit" className="w-full bg-[#9D4EDD] hover:bg-[#8e40c9] py-2 rounded text-sm font-bold mt-2">Criar Categoria</button>
          </form>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
            <div onClick={() => setReceitasBlcAberto(!receitasBlcAberto)} className="flex justify-between items-center cursor-pointer mb-4">
              <h3 className="font-bold text-emerald-500 flex items-center gap-2"><ArrowUpRight size={18}/> RECEITAS</h3>
              <ChevronDown size={18} />
            </div>
            {receitasBlcAberto && <div className="flex flex-col gap-2">{categorias.filter(c => !c.parent_id && c.tipo === 'RECEITA').map(renderizarCardCategoriaPai)}</div>}
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
            <div onClick={() => setDespesasBlcAberto(!despesasBlcAberto)} className="flex justify-between items-center cursor-pointer mb-4">
              <h3 className="font-bold text-red-500 flex items-center gap-2"><ArrowDownLeft size={18}/> DESPESAS</h3>
              <ChevronDown size={18} />
            </div>
            {despesasBlcAberto && <div className="flex flex-col gap-2">{categorias.filter(c => !c.parent_id && c.tipo === 'DESPESA').map(renderizarCardCategoriaPai)}</div>}
          </div>
        </div>
      </div>
    </main>
  )
}