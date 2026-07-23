'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { CreditCard, DollarSign, Calendar, Wallet, Pencil } from 'lucide-react'

interface CartaoCredito {
  id: string
  nome: string
  limite: number
  dia_vencimento: number
  dia_fechamento: number
  conta_pagamento_padrao_id: string | null
}

interface ContaBancaria {
  id: string
  apelido: string
}

export default function Cartoes() {
  const [nome, setNome] = useState('')
  const [limite, setLimite] = useState('')
  const [diaVencimento, setDiaVencimento] = useState('')
  const [diaFechamento, setDiaFechamento] = useState('')
  const [contaPagamentoPadraoId, setContaPagamentoPadraoId] = useState('')
  const [idEditando, setIdEditando] = useState<string | null>(null)
  
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([])
  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>([])

  async function carregarDados() {
    const { data: contasData } = await supabase.from('contas_bancarias').select('id, apelido').order('apelido')
    if (contasData) setContasBancarias(contasData as ContaBancaria[])

    const { data: cartoesData } = await supabase.from('cartoes_credito').select('*').order('nome')
    if (cartoesData) setCartoes(cartoesData as CartaoCredito[])
  }

  useEffect(() => { carregarDados() }, [])

  function limparFormulario() {
    setNome('')
    setLimite('')
    setDiaVencimento('')
    setDiaFechamento('')
    setContaPagamentoPadraoId('')
    setIdEditando(null)
  }

  function handleIniciarEdicao(cartao: CartaoCredito) {
    setIdEditando(cartao.id)
    setNome(cartao.nome)
    setLimite(cartao.limite.toString())
    setDiaVencimento(cartao.dia_vencimento.toString())
    setDiaFechamento(cartao.dia_fechamento.toString())
    setContaPagamentoPadraoId(cartao.conta_pagamento_padrao_id || '')
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    const dadosCartao = {
      nome, 
      limite: parseFloat(limite), 
      dia_vencimento: parseInt(diaVencimento),
      dia_fechamento: parseInt(diaFechamento), 
      conta_pagamento_padrao_id: contaPagamentoPadraoId
    }

    if (idEditando) {
      await supabase.from('cartoes_credito').update(dadosCartao).eq('id', idEditando)
    } else {
      await supabase.from('cartoes_credito').insert([dadosCartao])
    }
    
    limparFormulario()
    carregarDados()
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8">
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Formulário */}
        <div className="w-full lg:w-1/3 bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit">
          <h1 className="text-2xl font-bold mb-6 text-[#9D4EDD]">{idEditando ? 'Editar Cartão' : 'Novo Cartão'}</h1>
          <form onSubmit={handleSalvar} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><CreditCard size={12}/> Nome do Cartão</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-[#9D4EDD] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><DollarSign size={12}/> Limite (R$)</label>
              <input type="number" value={limite} onChange={(e) => setLimite(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-[#9D4EDD] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Wallet size={12}/> Conta Padrão</label>
              <select value={contaPagamentoPadraoId} onChange={(e) => setContaPagamentoPadraoId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-[#9D4EDD] focus:outline-none">
                <option value="">Selecione...</option>
                {contasBancarias.map(c => <option key={c.id} value={c.id}>{c.apelido}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Calendar size={12}/> Fechamento</label>
                <input type="number" value={diaFechamento} onChange={(e) => setDiaFechamento(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-[#9D4EDD] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Calendar size={12}/> Vencimento</label>
                <input type="number" value={diaVencimento} onChange={(e) => setDiaVencimento(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-[#9D4EDD] focus:outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#9D4EDD] hover:bg-[#8e40c9] text-white font-bold py-2 rounded text-sm transition-all">
              {idEditando ? 'Salvar Alterações' : 'Cadastrar Cartão'}
            </button>
          </form>
        </div>

        {/* Listagem */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-200">Cartões Cadastrados</h2>
          {cartoes.map(cartao => (
            <div key={cartao.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-[#9D4EDD]/30 transition-all">
              <div>
                <h4 className="font-bold text-white text-base">{cartao.nome}</h4>
                <div className="flex gap-4 mt-2 text-xs text-slate-400">
                  <span>Limite: R$ {cartao.limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span>Fechamento: Dia {cartao.dia_fechamento}</span>
                  <span>Vencimento: Dia {cartao.dia_vencimento}</span>
                </div>
              </div>
              <button 
                onClick={() => handleIniciarEdicao(cartao)} 
                className="p-2 bg-slate-800 hover:bg-[#9D4EDD] text-slate-400 hover:text-white rounded-lg transition-all"
                title="Editar"
              >
                <Pencil size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}