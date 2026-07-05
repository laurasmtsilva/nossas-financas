'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar' // Importação do componente centralizado
import { 
  Home, Utensils, Car, Gift, Heart, Briefcase, 
  DollarSign, Coffee, ShoppingBag, Landmark, Wrench, 
  Droplet, Pizza, FileText, User, Folder, Lightbulb,
  ChevronDown, ChevronRight, ArrowUpRight, ArrowDownLeft,
  LayoutDashboard, Wallet, FolderTree, ArrowLeftRight
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
  const [status, setStatus] = useState('')
  const [carregando, setCarregando] = useState(true)
  
  // Controle de colapso das categorias INDIVIDUAIS
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({})

  // Novos estados para colapsar os BLOCOS GERAIS (Começam abertos)
  const [receitasBlcAberto, setReceitasBlcAberto] = useState(true)
  const [despesasBlcAberto, setDespesasBlcAberto] = useState(true)

  async function carregarCategorias() {
    setCarregando(true)
    const { data } = await supabase.from('categorias').select('*').order('nome', { ascending: true })
    if (data) setCategorias(data as Categoria[])
    setCarregando(false)
  }

  useEffect(() => { carregarCategorias() }, [])

  useEffect(() => {
    if (parentId !== 'root') {
      const pai = categorias.find(c => c.id === parentId)
      if (pai) setTipo(pai.tipo)
    }
  }, [parentId, categorias])

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Salvando...')
    if (!nome) return

    const { error } = await supabase.from('categorias').insert([{
      nome: nome.trim(),
      tipo,
      parent_id: parentId === 'root' ? null : parentId,
      icone: iconeSelecionado
    }])

    if (error) setStatus(`❌ Erro: ${error.message}`)
    else {
      setStatus('✅ Criada com sucesso!')
      setNome('')
      setParentId('root')
      setIconeSelecionado('Folder')
      carregarCategorias()
    }
  }

  async function handleDeletar(id: string, nomeCat: string) {
    if (!confirm(`Excluir "${nomeCat}" e suas subcategorias?`)) return
    await supabase.from('categorias').delete().eq('id', id)
    carregarCategorias()
  }

  const toggleParent = (id: string) => {
    setExpandedParents(prev => ({ ...prev, [id]: prev[id] === false ? true : false }))
  }

  // Separação dos grupos principais
  const receitasPrincipais = categorias.filter(c => !c.parent_id && c.tipo === 'RECEITA')
  const despesasPrincipais = categorias.filter(c => !c.parent_id && c.tipo === 'DESPESA')
  const todasPrincipaisParaSelect = categorias.filter(c => !c.parent_id)

  // Função auxiliar para renderizar os cards de categorias pai
  const renderizarCardCategoriaPai = (pai: Categoria) => {
    const PaiIcone = iconeComponentes[pai.icone] || Folder
    const filhos = categorias.filter(c => c.parent_id === pai.id)
    const estaAberto = expandedParents[pai.id] !== false

    return (
      <div key={pai.id} className="bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden transition-all">
        <div 
          onClick={() => toggleParent(pai.id)}
          className="flex items-center justify-between p-4 bg-slate-950 hover:bg-slate-900/40 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="text-slate-500">
              {estaAberto ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            <div className={`p-2 rounded-lg ${pai.tipo === 'RECEITA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              <PaiIcone size={20} />
            </div>
            <span className="font-bold text-white text-sm">{pai.nome}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDeletar(pai.id, pai.nome) }} 
            className="text-xs text-slate-600 hover:text-red-400 p-1 font-mono"
          >
            [x]
          </button>
        </div>

        {estaAberto && (
          <div className="p-2 bg-slate-900/40 flex flex-col gap-1 border-t border-slate-900/60">
            {filhos.length === 0 ? (
              <p className="text-xs text-slate-600 italic px-8 py-2">↳ Nenhuma subcategoria cadastrada</p>
            ) : (
              filhos.map((filho) => {
                const FilhoIcone = iconeComponentes[filho.icone] || Folder
                return (
                  <div key={filho.id} className="flex items-center justify-between pl-8 pr-4 py-2 hover:bg-slate-800/40 rounded-lg group">
                    <div className="flex items-center gap-2.5">
                      <span className="text-slate-700 text-sm font-mono">↳</span>
                      <div className="text-slate-400"><FilhoIcone size={14} /></div>
                      <span className="text-sm text-slate-200">{filho.nome}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeletar(filho.id, filho.nome) }} 
                      className="text-[11px] text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 font-mono"
                    >
                      [x]
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-8">
      
      {/* Chamada do menu simplificada e unificada */}
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* FORMULÁRIO DE CADASTRO */}
        <div className="w-full lg:w-1/3 bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit">
          <h1 className="text-2xl font-bold text-emerald-400 mb-6">Categorias</h1>
          <form onSubmit={handleCadastrar} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Pertence a</label>
              <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none">
                <option value="root">Nenhuma (Principal)</option>
                {todasPrincipaisParaSelect.map(cat => <option key={cat.id} value={cat.id}>↳ {cat.nome} ({cat.tipo === 'RECEITA' ? '🟢' : '🔴'})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nome</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Restaurantes" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Fluxo</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" disabled={parentId !== 'root'} onClick={() => setTipo('DESPESA')} className={`py-2 text-xs font-bold rounded border ${tipo === 'DESPESA' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>🔴 DESPESA</button>
                <button type="button" disabled={parentId !== 'root'} onClick={() => setTipo('RECEITA')} className={`py-2 text-xs font-bold rounded border ${tipo === 'RECEITA' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>🟢 RECEITA</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ícone</label>
              <div className="grid grid-cols-6 gap-2 p-3 bg-slate-950 rounded border border-slate-800 max-h-32 overflow-y-auto">
                {Object.keys(iconeComponentes).map((nomeIcone) => {
                  const Icone = iconeComponentes[nomeIcone]
                  return (
                    <button key={nomeIcone} type="button" onClick={() => setIconeSelecionado(nomeIcone)} className={`p-2 flex items-center justify-center rounded border ${iconeSelecionado === nomeIcone ? 'border-emerald-500 bg-slate-800 text-emerald-400' : 'border-transparent text-slate-400'}`}><Icone size={18} /></button>
                  )
                })}
              </div>
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-bold py-2 rounded text-sm mt-2">Criar Categoria</button>
          </form>
          {status && <p className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 font-mono break-words">{status}</p>}
        </div>

        {/* LISTAGEM AGRUPADA E TOTALMENTE COLAPSÁVEL */}
        <div className="w-full lg:w-2/3 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col gap-6">
          
          {carregando ? (
            <p className="text-slate-400 text-sm font-mono">Buscando estrutura de categorias...</p>
          ) : (
            <>
              {/* GAVETA 1: RECEITAS */}
              <div className="bg-slate-950/20 rounded-xl p-3 border border-slate-800/40">
                <div 
                  onClick={() => setReceitasBlcAberto(!receitasBlcAberto)}
                  className="flex items-center justify-between border-b border-slate-800 pb-3 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md">
                      <ArrowUpRight size={16} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 group-hover:text-emerald-300 transition-colors">Receitas</h3>
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">{receitasPrincipais.length}</span>
                  </div>
                  <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
                    {receitasBlcAberto ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>
                
                {receitasBlcAberto && (
                  <div className="flex flex-col gap-3 mt-3 transition-all">
                    {receitasPrincipais.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-2">Nenhuma categoria de receita mapeada.</p>
                    ) : (
                      receitasPrincipais.map(renderizarCardCategoriaPai)
                    )}
                  </div>
                )}
              </div>

              {/* GAVETA 2: DESPESAS */}
              <div className="bg-slate-950/20 rounded-xl p-3 border border-slate-800/40">
                <div 
                  onClick={() => setDespesasBlcAberto(!despesasBlcAberto)}
                  className="flex items-center justify-between border-b border-slate-800 pb-3 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-500/10 text-red-400 rounded-md">
                      <ArrowDownLeft size={16} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 group-hover:text-red-300 transition-colors">Despesas</h3>
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">{despesasPrincipais.length}</span>
                  </div>
                  <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
                    {despesasBlcAberto ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>

                {despesasBlcAberto && (
                  <div className="flex flex-col gap-3 mt-3 transition-all">
                    {despesasPrincipais.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-2">Nenhuma categoria de despesa mapeada.</p>
                    ) : (
                      despesasPrincipais.map(renderizarCardCategoriaPai)
                    )}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </main>
  )
}