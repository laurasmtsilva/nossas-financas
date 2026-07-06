'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { IconeCategorias, ICONES_DISPONIVEIS } from '@/components/IconeCategorias'
import { 
  DollarSign, Calendar, FileText, Tag, Wallet, User,
  CreditCard, ArrowUpRight, ArrowDownLeft, Trash2, ChevronDown
} from 'lucide-react'

interface Categoria {
  id: string
  nome: string
  parent_id: string | null
  tipo: 'RECEITA' | 'DESPESA'
  icone?: string
}

interface Lancamento {
  id: string
  descricao: string
  valor: number
  data: string
  tipo: 'RECEITA' | 'DESPESA'
  meio_pagamento: 'CONTA' | 'CARTAO'
  parcelas: number
  conta_id: string 
  tipo_pessoa: 'PF' | 'PJ'
  criado_por_nome: string
  categoria: { nome: string }
}

interface ContaBancaria {
  id: string
  apelido: string
}

interface CartaoCredito {
  id: string
  nome: string
  dia_fechamento: number
  dia_vencimento: number
}

export default function Lancamentos() {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [tipo, setTipo] = useState<'RECEITA' | 'DESPESA'>('DESPESA')
  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ'>('PF')
  
  const [categoriaId, setCategoriaId] = useState('')
  const [contaId, setContaId] = useState('')
  
  // Novos estados para a Categoria em Árvore
  const [dropdownCatAberto, setDropdownCatAberto] = useState(false)
  const [novaCatNome, setNovaCatNome] = useState('')
  const [novaCatParentId, setNovaCatParentId] = useState('')
  const [novaCatIcone, setNovaCatIcone] = useState('📁')
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({})
  
  const [meioPagamento, setMeioPagamento] = useState<'CONTA' | 'CARTAO'>('CONTA')
  const [numeroParcelas, setNumeroParcelas] = useState('1')

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>([])
  const [cartoesCredito, setCartoesCredito] = useState<CartaoCredito[]>([])
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [status, setStatus] = useState('')
  const [carregando, setCarregando] = useState(true)

  async function carregarDados() {
    setCarregando(true)
    
    const { data: catData } = await supabase.from('categorias').select('*').order('nome')
    if (catData) setCategorias(catData)

    const { data: contasData } = await supabase.from('contas_bancarias').select('id, apelido').order('apelido')
    if (contasData) setContasBancarias(contasData as ContaBancaria[])

    const { data: cartoesData } = await supabase.from('cartoes_credito').select('id, nome, dia_fechamento, dia_vencimento').order('nome')
    if (cartoesData) setCartoesCredito(cartoesData as CartaoCredito[])

    const { data: lancData } = await supabase
      .from('lancamentos')
      .select(`
        id, descricao, valor, data, tipo, meio_pagamento, parcelas, conta_id, tipo_pessoa, criado_por_nome,
        categoria:categoria_id(nome)
      `)
      .order('data', { ascending: false })
      .limit(15)

    if (lancData) setLancamentos(lancData as unknown as Lancamento[])
    
    setCarregando(false)
  }

  useEffect(() => { carregarDados() }, [])

  useEffect(() => {
    if (meioPagamento === 'CARTAO') setTipo('DESPESA')
  }, [meioPagamento])

  useEffect(() => {
    setCategoriaId('')
    if (tipo === 'RECEITA') setMeioPagamento('CONTA')
  }, [tipo])

  function calcularMesAnoFatura(dataCompraStr: string, diaFechamento: number, parcelaIndex: number) {
    const parts = dataCompraStr.split('-')
    let ano = parseInt(parts[0])
    let mes = parseInt(parts[1])
    const dia = parseInt(parts[2])

    if (dia > diaFechamento) {
      mes += 1
    }

    mes += (parcelaIndex - 1)

    while (mes > 12) {
      mes -= 12
      ano += 1
    }

    return { ano, mes }
  }

  async function handleCriarCategoriaRapida() {
    if (!novaCatNome.trim()) return
    
    setStatus('Processando categoria...')
    
    const { data: novaCategoria, error } = await supabase
      .from('categorias')
      .insert([{ 
        nome: novaCatNome.trim(), 
        tipo: tipo,
        parent_id: novaCatParentId || null,
        icone: novaCatIcone
      }])
      .select()
      .single()

    if (error) {
      setStatus(`❌ Erro ao criar categoria: ${error.message}`)
      return
    }

    setNovaCatNome('')
    setNovaCatParentId('')
    setNovaCatIcone('📁')
    
    if (novaCategoria) {
      setCategoriaId(novaCategoria.id)
      setDropdownCatAberto(false)
    }
    
    setStatus('')
    carregarDados()
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Processando...')

    if (!descricao || !valor || !categoriaId || !contaId) {
      setStatus('❌ Preencha todos os campos obrigatórios.')
      return
    }

    const { data: userData } = await supabase.auth.getUser()
    const usuarioNome = userData?.user?.email?.split('@')[0] || 'Usuário Local'

    const valorTotal = parseFloat(valor)
    const totalParcelas = meioPagamento === 'CARTAO' ? parseInt(numeroParcelas) : 1

    const { data: novoLancamento, error: errLanc } = await supabase
      .from('lancamentos')
      .insert([{
        descricao: descricao.trim(),
        valor: valorTotal,
        data,
        tipo,
        categoria_id: categoriaId,
        conta_id: contaId,
        meio_pagamento: meioPagamento,
        parcelas: totalParcelas,
        tipo_pessoa: tipoPessoa,
        criado_por_nome: usuarioNome
      }])
      .select()
      .single()

    if (errLanc || !novoLancamento) {
      setStatus(`❌ Erro no lançamento mestre: ${errLanc?.message}`)
      return
    }

    try {
      if (meioPagamento === 'CONTA') {
        await supabase.from('transacoes').insert([{
          lancamento_id: novoLancamento.id,
          descricao: descricao.trim(),
          valor: valorTotal,
          tipo: tipo.toLowerCase(),
          status: 'pago',
          data_competencia: data,
          categoria_id: categoriaId,
          conta_bancaria_id: contaId,
          numero_parcela: 1,
          total_parcelas: 1,
          criado_por_nome: usuarioNome
        }])
      } else {
        const cartaoSelecionado = cartoesCredito.find(c => c.id === contaId)
        if (!cartaoSelecionado) throw new Error("Cartão não encontrado.")

        const valorDaParcela = parseFloat((valorTotal / totalParcelas).toFixed(2))

        for (let i = 1; i <= totalParcelas; i++) {
          const { ano, mes } = calcularMesAnoFatura(data, cartaoSelecionado.dia_fechamento, i)

          let faturaId = null
          const { data: faturaExistente } = await supabase
            .from('faturas')
            .select('id')
            .eq('cartao_credito_id', cartaoSelecionado.id)
            .eq('ano', ano)
            .eq('mes', mes)
            .maybeSingle()

          if (faturaExistente) {
            faturaId = faturaExistente.id
          } else {
            const { data: novaFatura, error: errFat } = await supabase
              .from('faturas')
              .insert([{ cartao_credito_id: cartaoSelecionado.id, ano, mes, status: 'ABERTA' }])
              .select()
              .single()
            
            if (errFat) throw errFat
            faturaId = novaFatura.id
          }

          const mesFormatado = mes.toString().padStart(2, '0')
          const diaFormatado = cartaoSelecionado.dia_vencimento.toString().padStart(2, '0')
          const dataCompetenciaFatura = `${ano}-${mesFormatado}-${diaFormatado}`

          await supabase.from('transacoes').insert([{
            lancamento_id: novoLancamento.id,
            fatura_id: faturaId,
            cartao_credito_id: cartaoSelecionado.id,
            descricao: totalParcelas > 1 ? `${descricao.trim()} (${i}/${totalParcelas})` : descricao.trim(),
            valor: valorDaParcela,
            tipo: 'despesa',
            status: 'pendente',
            data_competencia: dataCompetenciaFatura,
            categoria_id: categoriaId,
            numero_parcela: i,
            total_parcelas: totalParcelas,
            criado_por_nome: usuarioNome
          }])
        }
      }

      setStatus('✅ Lançamento processado com sucesso!')
      setDescricao('')
      setValor('')
      setCategoriaId('')
      setNumeroParcelas('1')
      setContaId('')
      carregarDados()

    } catch (error: any) {
      console.error(error)
      setStatus(`❌ Erro ao processar desmembramento: ${error.message}`)
    }
  }

  async function handleDeletar(id: string) {
    if (!confirm('Remover este lançamento? Isso apagará automaticamente todas as parcelas e transações vinculadas.')) return
    await supabase.from('lancamentos').delete().eq('id', id)
    carregarDados()
  }

  const opcoesPagamentoFiltradas = meioPagamento === 'CARTAO' 
    ? cartoesCredito.map(c => ({ id: c.id, exibicao: c.nome }))
    : contasBancarias.map(c => ({ id: c.id, exibicao: c.apelido }))

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 max-w-full overflow-x-hidden">
      
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        
        {/* FORMULÁRIO */}
        <div className="w-full lg:w-1/2 bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-800 h-fit">
          <h1 className="text-xl md:text-2xl font-bold text-[#9D4EDD] mb-6 flex items-center gap-2">
            Registrar Fluxo
          </h1>
          
          <form onSubmit={handleSalvar} className="flex flex-col gap-4">
            
            {/* 1. TIPO DE LANÇAMENTO */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Tipo de Lançamento</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button" 
                  disabled={meioPagamento === 'CARTAO'} 
                  onClick={() => setTipo('DESPESA')} 
                  className={`py-2.5 text-xs font-bold rounded-lg border transition-all ${tipo === 'DESPESA' ? 'bg-red-500/10 border-red-500 text-red-400 font-extrabold shadow-lg shadow-red-500/5' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  🔴 DESPESA
                </button>
                <button 
                  type="button" 
                  onClick={() => setTipo('RECEITA')} 
                  className={`py-2.5 text-xs font-bold rounded-lg border transition-all ${tipo === 'RECEITA' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-extrabold shadow-lg shadow-emerald-500/5' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  🟢 RECEITA
                </button>
              </div>
            </div>

            {/* 2. PERFIL DO LANÇAMENTO */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Perfil do Lançamento</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoPessoa('PF')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${tipoPessoa === 'PF' ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-extrabold shadow-lg shadow-blue-500/5' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  👤 Pessoa Física (PF)
                </button>
                <button
                  type="button"
                  onClick={() => setTipoPessoa('PJ')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${tipoPessoa === 'PJ' ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-extrabold shadow-lg shadow-amber-500/5' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  🏢 Pessoa Jurídica (PJ)
                </button>
              </div>
            </div>

            {tipo === 'DESPESA' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Como foi pago?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setMeioPagamento('CONTA'); setContaId(''); }} 
                    className={`py-2 flex items-center justify-center gap-2 text-xs font-bold rounded border ${meioPagamento === 'CONTA' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                  >
                    <Wallet size={14} /> Saldo / Dinheiro
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setMeioPagamento('CARTAO'); setContaId(''); }} 
                    className={`py-2 flex items-center justify-center gap-2 text-xs font-bold rounded border ${meioPagamento === 'CARTAO' ? 'bg-[#9D4EDD]/20 border-[#9D4EDD] text-[#9D4EDD]' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                  >
                    <CreditCard size={14} /> Cartão de Crédito
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><DollarSign size={12}/> Valor (R$)</label>
                <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] font-mono transition-colors"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Calendar size={12}/> Data</label>
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] font-mono transition-colors"/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><FileText size={12}/> Descrição / Estabelecimento</label>
              <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Mercado Central, Posto..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] transition-colors"/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Categoria com ícone */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Tag size={12}/> Categoria</label>
                
                <div 
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white cursor-pointer flex justify-between items-center focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] transition-colors"
                  onClick={() => setDropdownCatAberto(!dropdownCatAberto)}
                >
                  <span className={categoriaId ? "text-white flex items-center gap-2" : "text-slate-500"}>
                    {categoriaId ? (
                      <>
                        <span>{categorias.find(c => c.id === categoriaId)?.nome}</span>
                      </>
                    ) : "Selecionar categoria..."}
                  </span>
                  <ChevronDown size={14} className="text-slate-600" />
                </div>

                {dropdownCatAberto && (
                  <div className="absolute z-50 w-full mt-1 bg-slate-950 border border-[#9D4EDD]/50 rounded-lg max-h-80 overflow-y-auto shadow-2xl p-3 flex flex-col gap-3">
                    
                    {/* Painel de Cadastro Rápido com Seletor de Ícone */}
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Cadastro Rápido</span>
                      
                        <div className="bg-slate-900 p-3 rounded border border-slate-800 mb-4">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Novo Ícone</label>
                          <div className="grid grid-cols-8 gap-1 my-2 h-24 overflow-y-auto p-1 bg-slate-950 rounded border border-slate-800">
                            {ICONES_DISPONIVEIS.map(ic => (
                            <button key={ic} type="button" onClick={() => setNovaCatIcone(ic)} className={`p-1.5 rounded ${novaCatIcone === ic ? 'bg-[#9D4EDD]' : 'bg-slate-900'}`}>
                              <IconeCategorias nome={ic} size={16} />
                            </button>
                            ))}
                          </div>
                          <input value={novaCatNome} onChange={(e) => setNovaCatNome(e.target.value)} placeholder="Nome da categoria" className="w-full bg-slate-950 p-2 rounded border border-slate-800 text-sm mb-2" />
                          <button type="button" onClick={handleCriarCategoriaRapida} className="w-full bg-[#9D4EDD] py-2 rounded text-sm font-bold">Criar Categoria</button>
                        </div>

                     <div className="flex gap-2">
                        <select 
                          value={novaCatParentId} 
                          onChange={(e) => setNovaCatParentId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#9D4EDD] truncate"
                        >
                          <option value="">Principal (Sem Pai)</option>
                          {categorias.filter(c => !c.parent_id && c.tipo === tipo).map(pai => (
                            <option key={pai.id} value={pai.id}>Pai: {pai.nome}</option>
                          ))}
                        </select>
                        <button 
                          type="button"
                          onClick={handleCriarCategoriaRapida}
                          className="bg-[#9D4EDD] hover:bg-[#8e40c9] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shrink-0"
                        >
                          Criar
                        </button>
                      </div>
                    </div>

                    {/* Árvore de Categorias Existentes */}
                    <div className="flex flex-col gap-1">
                      {categorias.filter(c => !c.parent_id && c.tipo === tipo).map(pai => (
                        <div key={pai.id} className="flex flex-col">
                          <div className="flex items-center justify-between group">
                            <button
                              type="button"
                              onClick={() => { setCategoriaId(pai.id); setDropdownCatAberto(false); }}
                              className={`flex-1 text-left px-2 py-1.5 text-sm font-bold rounded transition-colors flex items-center gap-2 ${categoriaId === pai.id ? 'text-[#9D4EDD] bg-[#9D4EDD]/10' : 'text-slate-200 hover:bg-slate-900'}`}
                            >
                              <span>{pai.nome}</span>
                            </button>
                            {categorias.some(f => f.parent_id === pai.id) && (
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setExpandedParents(prev => ({...prev, [pai.id]: !prev[pai.id]})) }}
                                className="p-1.5 text-slate-500 hover:text-white transition-colors"
                              >
                                <ChevronDown size={14} className={`transition-transform ${expandedParents[pai.id] ? "rotate-180" : ""}`} />
                              </button>
                            )}
                          </div>
                          
                          {expandedParents[pai.id] && (
                            <div className="flex flex-col ml-3 mt-1 border-l border-slate-800 pl-2 gap-1">
                              {categorias.filter(f => f.parent_id === pai.id).map(filho => (
                                <button
                                  key={filho.id}
                                  type="button"
                                  onClick={() => { setCategoriaId(filho.id); setDropdownCatAberto(false); }}
                                  className={`text-left px-2 py-1.5 text-sm rounded transition-colors flex items-center gap-2 ${categoriaId === filho.id ? 'text-[#9D4EDD] bg-[#9D4EDD]/10 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
                                >
                                  <span>{filho.nome}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {categorias.filter(c => c.tipo === tipo).length === 0 && (
                        <p className="text-xs text-slate-500 italic px-2 py-1">Nenhuma categoria encontrada para este tipo.</p>
                      )}
                    </div>

                  </div>
                )}
              </div>
              {/* FIM DA LÓGICA DE CATEGORIA */}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  {meioPagamento === 'CARTAO' ? <CreditCard size={12}/> : <Wallet size={12}/>}
                  {meioPagamento === 'CARTAO' ? 'Qual Cartão?' : 'Qual Conta?'}
                </label>
                <select value={contaId} onChange={(e) => setContaId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] transition-colors">
                  <option value="">Selecionar...</option>
                  {opcoesPagamentoFiltradas.map(c => <option key={c.id} value={c.id}>{c.exibicao}</option>)}
                </select>
              </div>
            </div>

            {meioPagamento === 'CARTAO' && tipo === 'DESPESA' && (
              <div className="bg-[#9D4EDD]/10 border border-[#9D4EDD]/30 p-3 rounded-lg mt-2">
                <label className="block text-xs font-semibold text-[#9D4EDD] uppercase mb-1">Parcelamento</label>
                <select value={numeroParcelas} onChange={(e) => setNumeroParcelas(e.target.value)} className="w-full bg-slate-950 border border-[#9D4EDD]/30 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] font-mono transition-colors">
                  <option value="1">À vista (1x)</option>
                  {[2,3,4,5,6,7,8,9,10,11,12].map(p => (
                    <option key={p} value={p}>{p}x de R$ {(parseFloat(valor || '0') / p).toFixed(2)}</option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" className="w-full bg-[#9D4EDD] hover:bg-[#8e40c9] text-white font-bold py-3 rounded-lg text-sm mt-3 shadow-lg transition-colors">
              Confirmar Lançamento
            </button>
          </form>
          {status && <p className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 font-mono break-words">{status}</p>}
        </div>

        {/* HISTÓRICO MESTRE */}
        <div className="w-full lg:w-1/2 bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-800 h-fit">
          <h2 className="text-lg md:text-xl font-bold text-slate-200 mb-6">Últimas Movimentações</h2>
          
          {carregando ? (
            <p className="text-slate-400 text-sm font-mono">Buscando histórico...</p>
          ) : lancamentos.length === 0 ? (
            <p className="text-slate-500 text-sm italic">Nenhum lançamento encontrado.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {lancamentos.map((item) => (
                <div key={item.id} className="bg-slate-950 p-3 md:p-4 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between group gap-3">
                  <div className="flex items-start md:items-center gap-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-1 sm:mt-0 ${item.tipo === 'RECEITA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {item.tipo === 'RECEITA' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white break-words">{item.descricao}</h4>
                      
                      <div className="flex items-center flex-wrap gap-1.5 mt-1 text-[11px] text-slate-400">
                        <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold border ${item.tipo_pessoa === 'PJ' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                          {item.tipo_pessoa || 'PF'}
                        </span>
                        
                        <span className="text-slate-400 bg-slate-900 px-1.5 py-0.5 border border-slate-800/80 rounded flex items-center gap-1 text-[10px]">
                          <User size={10} className="text-slate-500" /> {item.criado_por_nome || 'Sistema'}
                        </span>
                        
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] border border-slate-800">
                          {item.categoria?.nome || 'Sem Cat.'}
                        </span>
                        
                        <span className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded text-[10px] border border-slate-800">
                          {item.meio_pagamento === 'CARTAO' ? <CreditCard size={10} className="text-[#9D4EDD]" /> : <Wallet size={10} />}
                          {item.meio_pagamento === 'CARTAO' 
                            ? cartoesCredito.find(c => c.id === item.conta_id)?.nome || 'Cartão'
                            : contasBancarias.find(c => c.id === item.conta_id)?.apelido || 'Conta'
                          } {item.parcelas > 1 && `(${item.parcelas}x)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className={`font-mono text-sm font-bold block ${item.tipo === 'RECEITA' ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {item.tipo === 'RECEITA' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.data.split('-').reverse().join('/')}</p>
                    </div>
                    <button onClick={() => handleDeletar(item.id)} className="text-slate-600 hover:text-red-400 p-2 md:p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-slate-900 md:bg-transparent rounded md:rounded-none">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}