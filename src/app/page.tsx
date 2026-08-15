'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import {
  Wallet, AlertCircle, ArrowUpRight, ArrowDownLeft, Landmark, ReceiptText
} from 'lucide-react'

interface TransacaoResumo {
  tipo: 'receita' | 'despesa'
  valor: number
  data_competencia: string
}

export default function Dashboard() {
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [receitaMes, setReceitaMes] = useState(0)
  const [despesaMes, setDespesaMes] = useState(0)

  // Busca e soma as transações do mês atual (competência), diretamente do Supabase.
  // Padrão replicado de `totalFatura` em src/app/faturas/page.tsx: fetch + soma no cliente.
  async function carregarResumoMensal() {
    setCarregando(true)
    setErro(null)

    const agora = new Date()
    const ano = agora.getFullYear()
    const mes = agora.getMonth() + 1 // getMonth() é 0-indexado
    const mesFormatado = mes.toString().padStart(2, '0')

    const primeiroDia = `${ano}-${mesFormatado}-01`
    // new Date(ano, mes, 0) usa "mes" (0-indexado para o mês seguinte) com dia 0,
    // o que retorna o último dia do mês atual.
    const ultimoDiaNumero = new Date(ano, mes, 0).getDate()
    const ultimoDia = `${ano}-${mesFormatado}-${ultimoDiaNumero.toString().padStart(2, '0')}`

    const { data, error } = await supabase
      .from('transacoes')
      .select('tipo, valor, data_competencia')
      .gte('data_competencia', primeiroDia)
      .lte('data_competencia', ultimoDia)

    if (error) {
      setErro(error.message)
      setCarregando(false)
      return
    }

    const transacoes = (data || []) as TransacaoResumo[]

    const receita = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, curr) => acc + curr.valor, 0)

    const despesa = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, curr) => acc + curr.valor, 0)

    setReceitaMes(receita)
    setDespesaMes(despesa)
    setCarregando(false)
  }

  useEffect(() => { carregarResumoMensal() }, [])

  const saldoMes = receitaMes - despesaMes
  const semLancamentos = receitaMes === 0 && despesaMes === 0

  // Barra divergente: cada lado escala em relação ao maior dos dois valores,
  // de forma que o lado "vencedor" sempre ocupe a metade inteira e o outro
  // fique proporcionalmente menor. Evita a distorção de perímetro dos donuts concêntricos.
  const maiorValor = Math.max(receitaMes, despesaMes) || 1
  const percentReceita = (receitaMes / maiorValor) * 100
  const percentDespesa = (despesaMes / maiorValor) * 100

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 max-w-full overflow-x-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#9D4EDD] flex items-center gap-2">
            <Wallet size={26} /> Resumo do Mês
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Receitas e despesas lançadas neste mês.
          </p>
        </div>

        {carregando ? (
          <p className="text-sm font-mono text-slate-400">Calculando o resumo do mês...</p>
        ) : erro ? (
          <div className="bg-slate-900 border border-slate-800 text-center p-12 rounded-xl">
            <AlertCircle className="mx-auto text-red-400 mb-2" size={32} />
            <p className="text-slate-400 text-sm">Não foi possível calcular o resumo deste mês agora.</p>
          </div>
        ) : semLancamentos ? (
          <div className="bg-slate-900 border border-slate-800 text-center p-12 rounded-xl">
            <AlertCircle className="mx-auto text-slate-600 mb-2" size={32} />
            <p className="text-slate-400 text-sm">Você ainda não registrou nenhum lançamento este mês.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-8 flex flex-col gap-6">

            {/* Totais numéricos — leitura direta, sem depender da frase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <ArrowUpRight size={12} className="text-emerald-500" /> Receitas do Mês
                </span>
                <p className="text-2xl font-mono font-black text-emerald-400 mt-1">
                  R$ {receitaMes.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <ArrowDownLeft size={12} className="text-red-500" /> Despesas do Mês
                </span>
                <p className="text-2xl font-mono font-black text-red-400 mt-1">
                  R$ {despesaMes.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  Inclui compras já pagas e parcelas ainda não pagas
                </p>
              </div>
            </div>

            {/* Barra comparativa divergente (Opção B da especificação de UX) */}
            <div className="flex w-full h-3 rounded-full overflow-hidden bg-slate-800">
              <div className="w-1/2 flex justify-end">
                <div
                  style={{ width: `${percentDespesa}%` }}
                  className="h-3 bg-red-500 rounded-l-full transition-all"
                />
              </div>
              <div className="w-1/2 flex justify-start">
                <div
                  style={{ width: `${percentReceita}%` }}
                  className="h-3 bg-emerald-500 rounded-r-full transition-all"
                />
              </div>
            </div>

            {/* Frase de saldo em destaque */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 md:p-5">
              {saldoMes > 0 && (
                <p className="text-base md:text-lg font-bold text-white">
                  Sobram{' '}
                  <span className="font-mono font-black text-2xl text-emerald-400">
                    R$ {saldoMes.toFixed(2)}
                  </span>{' '}
                  este mês para gastar
                </p>
              )}
              {saldoMes < 0 && (
                <p className="text-base md:text-lg font-bold text-white">
                  Faltam{' '}
                  <span className="font-mono font-black text-2xl text-amber-400">
                    R$ {Math.abs(saldoMes).toFixed(2)}
                  </span>{' '}
                  este mês para fechar as contas
                </p>
              )}
              {saldoMes === 0 && (
                <p className="text-base md:text-lg font-bold text-[#9D4EDD]">
                  Suas receitas e despesas se equilibraram este mês
                </p>
              )}
            </div>

          </div>
        )}

        {/* Atalhos rápidos — ações secundárias */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/lancamentos"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <ReceiptText size={16} /> Ver Lançamentos
          </Link>
          <Link
            href="/contas"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Landmark size={16} /> Gerenciar Contas
          </Link>
        </div>

      </div>
    </main>
  )
}