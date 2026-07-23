'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

interface ContaBancaria {
  id: string
  banco: string
  tipo_pessoa: 'PF' | 'PJ'
  titularidade: 'I' | 'C'
  apelido: string
  saldo_inicial: number
  criado_em: string
}

export default function ContasBancariasPage() {
  const [banco, setBanco] = useState('')
  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ'>('PF')
  const [titularidade, setTitularidade] = useState<'I' | 'C'>('I')
  const [apelido, setApelido] = useState('')
  const [saldoInicial, setSaldoInicial] = useState('0')
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null)
  const [contas, setContas] = useState<ContaBancaria[]>([])
  const [status, setStatus] = useState('')
  const [carregando, setCarregando] = useState(true)

  async function carregarContas() {
    setCarregando(true)
    const { data, error } = await supabase
      .from('contas_bancarias')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) setStatus(`Erro: ${error.message}`)
    else if (data) setContas(data as ContaBancaria[])
    setCarregando(false)
  }

  useEffect(() => { carregarContas() }, [])

  async function prepararEdicao(conta: ContaBancaria) {
    const { count } = await supabase
      .from('transacoes')
      .select('*', { count: 'exact', head: true })
      .eq('conta_bancaria_id', conta.id)

    if (count && count > 0) {
      setStatus('⚠️ Bloqueado: Esta conta já possui movimentações.')
      return
    }

    setIdEmEdicao(conta.id)
    setBanco(conta.banco)
    setTipoPessoa(conta.tipo_pessoa)
    setTitularidade(conta.titularidade)
    setApelido(conta.apelido)
    setSaldoInicial(conta.saldo_inicial.toString())
  }

  function cancelarEdicao() {
    setIdEmEdicao(null)
    setBanco(''); setTipoPessoa('PF'); setTitularidade('I'); setApelido(''); setSaldoInicial('0')
    setStatus('')
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    const dadosConta = { banco, tipo_pessoa: tipoPessoa, titularidade, apelido, saldo_inicial: parseFloat(saldoInicial) || 0 }

    if (idEmEdicao) {
      await supabase.from('contas_bancarias').update(dadosConta).eq('id', idEmEdicao)
    } else {
      await supabase.from('contas_bancarias').insert([dadosConta])
    }
    cancelarEdicao()
    carregarContas()
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 max-w-full overflow-x-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        
        {/* FORMULÁRIO */}
        <div className="w-full lg:w-1/3 bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-800 h-fit">
          <h1 className="text-xl md:text-2xl font-bold text-[#9D4EDD] mb-1">Contas Bancárias</h1>
          <p className="text-slate-400 text-sm mb-6">{idEmEdicao ? 'Editar Conta' : 'Inserir Nova Conta'}</p>

          <form onSubmit={handleSalvar} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Instituição / Banco</label>
              <input type="text" value={banco} onChange={(e) => setBanco(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] text-white transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Apelido</label>
              <input type="text" value={apelido} onChange={(e) => setApelido(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] text-white transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tipo</label>
                <select value={tipoPessoa} onChange={(e) => setTipoPessoa(e.target.value as 'PF' | 'PJ')} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9D4EDD] text-white">
                  <option value="PF">PF</option>
                  <option value="PJ">PJ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Titularidade</label>
                <select value={titularidade} onChange={(e) => setTitularidade(e.target.value as 'I' | 'C')} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9D4EDD] text-white">
                  <option value="I">Individual</option>
                  <option value="C">Conjunta</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Saldo Inicial (R$)</label>
              <input type="number" step="0.01" value={saldoInicial} onChange={(e) => setSaldoInicial(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9D4EDD] text-white" />
            </div>
            <button type="submit" className={`font-bold py-2 rounded text-sm ${idEmEdicao ? 'bg-amber-500 text-slate-950' : 'bg-[#9D4EDD] text-white'}`}>
              {idEmEdicao ? 'Salvar Alterações' : 'Cadastrar Conta'}
            </button>
          </form>
        </div>

        {/* LISTAGEM EM CARDS */}
        <div className="w-full lg:w-2/3 flex flex-col gap-3">
          <h2 className="text-lg font-bold text-slate-200 mb-2">Contas Cadastradas</h2>
          {carregando ? <p className="text-slate-500">Buscando...</p> : contas.map(conta => (
            <div key={conta.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-[#9D4EDD]/30 transition-all">
              <div>
                <h4 className="font-bold text-white text-base">{conta.apelido}</h4>
                <p className="text-xs text-slate-400">{conta.banco}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${conta.tipo_pessoa === 'PF' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>{conta.tipo_pessoa}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${conta.titularidade === 'C' ? 'bg-[#9D4EDD]/10 text-[#9D4EDD]' : 'bg-slate-700/50 text-slate-300'}`}>{conta.titularidade === 'C' ? 'Conjunta' : 'Individual'}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-slate-200 mb-2">R$ {conta.saldo_inicial.toFixed(2)}</p>
                <button onClick={() => prepararEdicao(conta)} className="text-[10px] font-bold uppercase bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-all">Editar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}