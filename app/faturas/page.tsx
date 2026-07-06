'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { 
  CreditCard, Calendar, CheckCircle2, AlertCircle, 
  ChevronRight, DollarSign, User, Tag 
} from 'lucide-react'

interface CartaoCredito {
  id: string
  nome: string
  dia_fechamento: number
  dia_vencimento: number
}

interface Fatura {
  id: string
  cartao_credito_id: string
  ano: number
  mes: number
  status: 'ABERTA' | 'FECHADA' | 'PAGA'
}

interface TransacaoParcela {
  id: string
  descricao: string
  valor: number
  numero_parcela: number
  total_parcelas: number
  data_competencia: string
  criado_por_nome: string
  categoria: { nome: string }
  lancamento?: { data: string }
}

export default function FaturasPage() {
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([])
  const [cartaoSelecionado, setCartaoSelecionado] = useState<string>('')
  
  const [faturas, setFaturas] = useState<Fatura[]>([])
  const [faturaSelecionada, setFaturaSelecionada] = useState<Fatura | null>(null)
  
  const [parcelas, setParcelas] = useState<TransacaoParcela[]>([])
  const [carregando, setCarregando] = useState(true)
  const [carregandoParcelas, setCarregandoParcelas] = useState(false)

  // 1. Carrega os cartões disponíveis
  async function carregarCartoes() {
    setCarregando(true)
    const { data } = await supabase.from('cartoes_credito').select('*').order('nome')
    if (data && data.length > 0) {
      setCartoes(data)
      setCartaoSelecionado(data[0].id) // Seleciona o primeiro por padrão
    }
    setCarregando(false)
  }

  // 2. Carrega as faturas do cartão selecionado
  async function carregarFaturas(cartaoId: string) {
    if (!cartaoId) return
    const { data } = await supabase
      .from('faturas')
      .select('*')
      .eq('cartao_credito_id', cartaoId)
      .order('ano', { ascending: false })
      .order('mes', { ascending: false })

    if (data) {
      setFaturas(data)
      // Seleciona a fatura mais recente (geralmente a primeira da lista ordenada desc)
      if (data.length > 0) {
        setFaturaSelecionada(data[0])
      } else {
        setFaturaSelecionada(null)
        setParcelas([])
      }
    }
  }

  // 3. Carrega os itens/parcelas dentro da fatura selecionada
  async function carregarItensFatura(faturaId: string) {
    setCarregandoParcelas(true)
    
    // 💡 Ajustado: Forçamos a relação explicitando a coluna 'categoria_id'
    const { data, error } = await supabase
      .from('transacoes')
      .select(`
        id, 
        descricao, 
        valor, 
        numero_parcela, 
        total_parcelas, 
        data_competencia, 
        criado_por_nome,
        categoria:categoria_id ( nome ),
        lancamento:lancamento_id ( data )
      `)
      .eq('fatura_id', faturaId)
      .order('data_competencia', { ascending: true })

    if (error) {
      console.error("Erro ao buscar parcelas:", error.message)
    }

    // O 'unknown' garante o bypass do strict type do TypeScript para objetos aninhados do Supabase
    if (data) setParcelas(data as unknown as TransacaoParcela[])
    setCarregandoParcelas(false)
  }

  // Alternar o status de pagamento da fatura inteira
  async function handleAlternarStatusFatura(fatura: Fatura) {
    const novoStatus = fatura.status === 'PAGA' ? 'ABERTA' : 'PAGA'
    const { error } = await supabase
      .from('faturas')
      .update({ status: novoStatus })
      .eq('id', fatura.id)

    if (!error) {
      // Atualiza o estado local da fatura selecionada
      setFaturaSelecionada({ ...fatura, status: novoStatus })
      // Atualiza também na listagem lateral de faturas
      setFaturas(prev => prev.map(f => f.id === fatura.id ? { ...f, status: novoStatus } : f))
      
      // Também atualiza o status das transações filhas para bater com o pagamento
      await supabase
        .from('transacoes')
        .update({ status: novoStatus === 'PAGA' ? 'pago' : 'pendente' })
        .eq('fatura_id', fatura.id)
    }
  }

  useEffect(() => {
    carregarCartoes()
  }, [])

  useEffect(() => {
    carregarFaturas(cartaoSelecionado)
  }, [cartaoSelecionado])

  useEffect(() => {
    if (faturaSelecionada) {
      carregarItensFatura(faturaSelecionada.id)
    }
  }, [faturaSelecionada])

  // Função auxiliar para formatar o nome do mês
  const obterNomeMes = (numMes: number) => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return meses[numMes - 1] || 'Mês Inválido'
  }

  // Calcula o valor consolidado total da fatura que está em exibição
  const totalFatura = parcelas.reduce((acc, curr) => acc + curr.valor, 0)

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 max-w-full overflow-x-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#9D4EDD] flex items-center gap-2">
              <CreditCard size={26} /> Controle de Faturas
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Visualize os desmembramentos de compras parceladas e gerencie os fechamentos.
            </p>
          </div>

          {/* Seletor de Cartão */}
          <div className="w-full md:w-64 bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Selecione o Cartão</label>
            <select 
              value={cartaoSelecionado}
              onChange={(e) => setCartaoSelecionado(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] text-[#9D4EDD] transition-colors"
            >
              {cartoes.map(c => <option key={c.id} value={c.id}>💳 {c.nome}</option>)}
            </select>
          </div>
        </div>

        {carregando ? (
          <p className="text-sm font-mono text-slate-400">Estruturando painel de crédito...</p>
        ) : cartoes.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 text-center p-12 rounded-xl">
            <AlertCircle className="mx-auto text-slate-600 mb-2" size={32} />
            <p className="text-slate-400 text-sm">Nenhum cartão cadastrado no sistema ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            
            {/* COLUNA ESQUERDA: HISTÓRICO DE FATURAS DISPONÍVEIS DO CARTÃO */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 h-fit">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
                <Calendar size={12}/> Faturas Geradas
              </h3>
              
              {faturas.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-2">Nenhuma fatura pendente ou gerada.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {faturas.map((f) => {
                    const ativo = faturaSelecionada?.id === f.id
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFaturaSelecionada(f)}
                        className={`w-full text-left p-3 rounded-lg border text-sm flex items-center justify-between transition-all ${
                          ativo 
                            ? 'bg-[#9D4EDD]/10 border-[#9D4EDD] text-[#9D4EDD] font-bold shadow-sm' 
                            : 'bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-400'
                        }`}
                      >
                        <div>
                          <span>{obterNomeMes(f.mes)}</span>
                          <span className="text-[10px] font-mono block opacity-60">{f.ano}</span>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                          f.status === 'PAGA' 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                          {f.status}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* COLUNA DIREITA: DETALHAMENTO (ITENS INTERNOS DA FATURA SELECIONADA) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {faturaSelecionada ? (
                <>
                  {/* Banner de Resumo da Fatura Selecionada */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Fatura em Detalhe</span>
                      <h2 className="text-xl md:text-2xl font-black text-white mt-0.5">
                        {obterNomeMes(faturaSelecionada.mes)} <span className="text-slate-500 font-light">/ {faturaSelecionada.ano}</span>
                      </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-slate-500 uppercase block">Total Consolidado</span>
                        <span className="text-2xl font-mono font-black text-[#9D4EDD]">
                          R$ {totalFatura.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAlternarStatusFatura(faturaSelecionada)}
                        className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all ${
                          faturaSelecionada.status === 'PAGA'
                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                            : 'bg-slate-950 border border-slate-800 text-amber-400 hover:border-amber-500'
                        }`}
                      >
                        {faturaSelecionada.status === 'PAGA' ? (
                          <> <CheckCircle2 size={14}/> Paga </>
                        ) : (
                          <> <AlertCircle size={14}/> Marcar como Paga </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Listagem das Parcelas Explodidas */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6">
                    <h3 className="text-sm font-bold text-slate-300 mb-4">Extrato Detalhado da Fatura</h3>

                    {carregandoParcelas ? (
                      <p className="text-xs font-mono text-slate-500">Separando parcelas...</p>
                    ) : parcelas.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">Nenhuma transação vinculada a este período.</p>
                    ) : (
                      <div className="flex flex-col gap-3 md:gap-2">
                        {parcelas.map((item) => (
                          <div key={item.id} className="bg-slate-950 border border-slate-900/60 p-3 md:p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-slate-800 transition-colors">
                            
                            <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                              <div className="bg-[#9D4EDD]/5 text-[#9D4EDD] p-2 rounded-lg border border-[#9D4EDD]/10 shrink-0 mt-0.5 sm:mt-0">
                                <ChevronRight size={16} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-bold text-white break-words">
                                  {item.descricao}
                                </h4>
                                {/* Adicionado flex-wrap para evitar overflow das tags */}
                                <div className="flex items-center flex-wrap gap-2 mt-1 text-[11px] text-slate-500">
                                  <span className="flex items-center gap-0.5 text-slate-400 shrink-0">
                                    <User size={10} className="text-slate-600" /> {item.criado_por_nome || 'Local'}
                                  </span>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] border border-slate-800 text-slate-400 font-medium shrink-0">
                                    <Tag size={8} className="inline mr-1 text-slate-500" />
                                    {item.categoria?.nome || 'Geral'}
                                  </span>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="font-mono text-[10px] flex flex-wrap gap-1 sm:gap-2 shrink-0">
                                    <span className="text-slate-500">
                                      Compra: {item.lancamento?.data ? item.lancamento.data.split('-').reverse().join('/') : 'Retroativa'}
                                    </span>
                                    <span>•</span>
                                    <span className="text-[#9D4EDD] font-semibold">
                                        Fatura: {item.data_competencia.split('-').reverse().join('/')}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-left sm:text-right border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0 w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                              <span className="font-mono font-bold text-sm text-slate-200">
                                R$ {item.valor.toFixed(2)}
                              </span>
                              {item.total_parcelas > 1 && (
                                <p className="text-[9px] text-[#9D4EDD] font-bold bg-[#9D4EDD]/10 px-1.5 py-0.5 rounded border border-[#9D4EDD]/20 sm:mt-0.5 w-fit">
                                  {item.numero_parcela}/{item.total_parcelas}
                                </p>
                              )}
                            </div>
                            
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-slate-900 border border-slate-800 text-center p-16 rounded-xl italic text-slate-500 text-sm">
                  Selecione uma fatura na barra lateral para ver o extrato.
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  )
}