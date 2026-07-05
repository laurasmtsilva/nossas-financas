'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { 
  DollarSign, Calendar, FileText, Tag, Wallet, User,
  CreditCard, ArrowUpRight, ArrowDownLeft, PlusCircle, Trash2, Search
} from 'lucide-react'

interface Categoria {
  id: string
  nome: string
  parent_id: string | null
  tipo: 'RECEITA' | 'DESPESA'
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
  
  const [buscaCategoria, setBuscaCategoria] = useState('')
  const [dropdownCatAberto, setDropdownCatAberto] = useState(false)
  
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
    setBuscaCategoria('')
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

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Processando...')

    if (!descricao || !valor || !categoriaId || !contaId) {
      setStatus('❌ Preencha todos os campos obrigatórios.')
      return
    }

    // Identifica dinamicamente quem é o usuário logado
    const { data: userData } = await supabase.auth.getUser()
    const usuarioNome = userData?.user?.email?.split('@')[0] || 'Usuário Local'

    const valorTotal = parseFloat(valor)
    const totalParcelas = meioPagamento === 'CARTAO' ? parseInt(numeroParcelas) : 1

    // STEP 1: Salvar o registro Mestre em 'lancamentos' com o autor automático
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
      // STEP 2: Tratar a explosão de registros na tabela 'transacoes'
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
      setBuscaCategoria('')
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

  const categoriasFiltradas = categorias.filter(cat => {
    if (tipo !== cat.tipo) return false
    if (buscaCategoria && !cat.nome.toLowerCase().includes(buscaCategoria.toLowerCase())) return false
    return true
  })

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-8">
      
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* FORMULÁRIO (LIMPO - SEM O CAMPO QUEM INCLUIU) */}
        <div className="w-full lg:w-1/2 bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit">
          <h1 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
            <PlusCircle size={24} /> Registrar Fluxo
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
                    className={`py-2 flex items-center justify-center gap-2 text-xs font-bold rounded border ${meioPagamento === 'CARTAO' ? 'bg-violet-500/20 border-violet-500 text-violet-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                  >
                    <CreditCard size={14} /> Cartão de Crédito
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><DollarSign size={12}/> Valor (R$)</label>
                <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none font-mono"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Calendar size={12}/> Data</label>
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none font-mono"/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><FileText size={12}/> Descrição / Estabelecimento</label>
              <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Mercado Central, Posto..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Tag size={12}/> Categoria</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={buscaCategoria}
                    onFocus={() => setDropdownCatAberto(true)}
                    onBlur={() => setTimeout(() => setDropdownCatAberto(false), 250)}
                    onChange={(e) => {
                      setBuscaCategoria(e.target.value)
                      setDropdownCatAberto(true)
                      if (!e.target.value) setCategoriaId('')
                    }}
                    placeholder="Buscar..."
                    className="w-full bg-slate-950 border border-slate-800 rounded pl-3 pr-8 py-2 text-sm text-white focus:outline-none"
                  />
                  <Search size={14} className="absolute right-2.5 top-3 text-slate-600" />
                </div>

                {dropdownCatAberto && (
                  <div className="absolute z-50 w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg max-h-48 overflow-y-auto shadow-2xl">
                    {categoriasFiltradas.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => { setCategoriaId(cat.id); setBuscaCategoria(cat.nome); setDropdownCatAberto(false); }}
                        className={`w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 border-b border-slate-900 last:border-0 ${categoriaId === cat.id ? 'bg-emerald-500/10 text-emerald-400 font-bold' : ''}`}
                      >
                        {cat.parent_id ? `↳ ${cat.nome}` : cat.nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  {meioPagamento === 'CARTAO' ? <CreditCard size={12}/> : <Wallet size={12}/>}
                  {meioPagamento === 'CARTAO' ? 'Qual Cartão?' : 'Qual Conta?'}
                </label>
                <select value={contaId} onChange={(e) => setContaId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="">Selecionar...</option>
                  {opcoesPagamentoFiltradas.map(c => <option key={c.id} value={c.id}>{c.exibicao}</option>)}
                </select>
              </div>
            </div>

            {meioPagamento === 'CARTAO' && tipo === 'DESPESA' && (
              <div className="bg-violet-950/20 border border-violet-900/40 p-3 rounded-lg">
                <label className="block text-xs font-semibold text-violet-400 uppercase mb-1">Parcelamento</label>
                <select value={numeroParcelas} onChange={(e) => setNumeroParcelas(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none font-mono">
                  <option value="1">À vista (1x)</option>
                  {[2,3,4,5,6,7,8,9,10,11,12].map(p => (
                    <option key={p} value={p}>{p}x de R$ {(parseFloat(valor || '0') / p).toFixed(2)}</option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-lg text-sm mt-2 shadow-lg hover:bg-emerald-400 transition-colors">
              Confirmar Lançamento
            </button>
          </form>
          {status && <p className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 font-mono break-words">{status}</p>}
        </div>

        {/* HISTÓRICO MESTRE (MANTÉM O CAMPO "POR: USUÁRIO") */}
        <div className="w-full lg:w-1/2 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-bold text-slate-200 mb-6">Últimas Movimentações (Mestre)</h2>
          
          {carregando ? (
            <p className="text-slate-400 text-sm font-mono">Buscando histórico...</p>
          ) : lancamentos.length === 0 ? (
            <p className="text-slate-500 text-sm italic">Nenhum lançamento encontrado.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {lancamentos.map((item) => (
                <div key={item.id} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.tipo === 'RECEITA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {item.tipo === 'RECEITA' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white line-clamp-1">{item.descricao}</h4>
                      <div className="flex items-center flex-wrap gap-2 mt-1 text-[11px] text-slate-400">
                        <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold border ${item.tipo_pessoa === 'PJ' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                          {item.tipo_pessoa || 'PF'}
                        </span>
                        
                        {/* Exibição Clara do Autor Coletado Automaticamente */}
                        <span className="text-slate-400 bg-slate-900 px-1.5 py-0.5 border border-slate-800/80 rounded flex items-center gap-1 text-[10px]">
                          <User size={10} className="text-slate-500" /> {item.criado_por_nome || 'Sistema'}
                        </span>
                        
                        <span>•</span>
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] border border-slate-800">{item.categoria?.nome || 'Sem Cat.'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {item.meio_pagamento === 'CARTAO' ? <CreditCard size={10} className="text-violet-400" /> : <Wallet size={10} />}
                          {item.meio_pagamento === 'CARTAO' 
                            ? cartoesCredito.find(c => c.id === item.conta_id)?.nome || 'Cartão'
                            : contasBancarias.find(c => c.id === item.conta_id)?.apelido || 'Conta'
                          } {item.parcelas > 1 && `(${item.parcelas}x)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={`font-mono text-sm font-bold ${item.tipo === 'RECEITA' ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {item.tipo === 'RECEITA' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.data.split('-').reverse().join('/')}</p>
                    </div>
                    <button onClick={() => handleDeletar(item.id)} className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={14} />
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