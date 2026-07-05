'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { 
  CreditCard, PlusCircle, Trash2, DollarSign, Calendar, Wallet, Pencil, XCircle
} from 'lucide-react'

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
  
  // Controle de estado para Edição
  const [idEditando, setIdEditando] = useState<string | null>(null)
  
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([])
  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>([])
  const [status, setStatus] = useState('')
  const [carregando, setCarregando] = useState(true)

  async function carregarDados() {
    setCarregando(true)

    // 1. Busca Contas Bancárias para alimentar o select do formulário
    const { data: contasData } = await supabase
      .from('contas_bancarias')
      .select('id, apelido')
      .order('apelido')
    
    if (contasData) setContasBancarias(contasData as ContaBancaria[])

    // 2. Busca Cartões de Crédito incluindo o ID da conta padrão
    const { data: cartoesData, error: errCartoes } = await supabase
      .from('cartoes_credito')
      .select('id, nome, limite, dia_vencimento, dia_fechamento, conta_pagamento_padrao_id')
      .order('nome')

    if (errCartoes) {
      console.error("❌ Erro ao buscar cartões:", errCartoes.message)
    } else if (cartoesData) {
      setCartoes(cartoesData as CartaoCredito[])
    }
    setCarregando(false)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  // Ativa o modo de edição preenchendo os estados com os dados do cartão selecionado
  function handleIniciarEdicao(cartao: CartaoCredito) {
    setIdEditando(cartao.id)
    setNome(cartao.nome)
    setLimite(cartao.limite.toString())
    setDiaVencimento(cartao.dia_vencimento.toString())
    setDiaFechamento(cartao.dia_fechamento.toString())
    setContaPagamentoPadraoId(cartao.conta_pagamento_padrao_id || '')
    setStatus('')
  }

  // Cancela a edição e limpa os campos para o modo de novo cadastro
  function handleCancelarEdicao() {
    setIdEditando(null)
    setNome('')
    setLimite('')
    setDiaVencimento('')
    setDiaFechamento('')
    setContaPagamentoPadraoId('')
    setStatus('')
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Processando...')

    if (!nome.trim() || !limite || !diaVencimento || !diaFechamento || !contaPagamentoPadraoId) {
      setStatus('❌ Preencha todos os campos obrigatórios.')
      return
    }

    const dadosCartao = {
      nome: nome.trim(),
      limite: parseFloat(limite),
      dia_vencimento: parseInt(diaVencimento),
      dia_fechamento: parseInt(diaFechamento),
      conta_pagamento_padrao_id: contaPagamentoPadraoId
    }

    if (idEditando) {
      // MODO EDIÇÃO: Executa o update filtrando pelo id que está sendo editado
      const { error } = await supabase
        .from('cartoes_credito')
        .update(dadosCartao)
        .eq('id', idEditando)

      if (error) {
        setStatus(`❌ Erro ao atualizar: ${error.message}`)
      } else {
        setStatus('✅ Cartão atualizado com sucesso!')
        handleCancelarEdicao()
        carregarDados()
      }
    } else {
      // MODO CADASTRO: Executa o insert tradicional
      const { error } = await supabase
        .from('cartoes_credito')
        .insert([dadosCartao])

      if (error) {
        setStatus(`❌ Erro ao cadastrar: ${error.message}`)
      } else {
        setStatus('✅ Cartão cadastrado com sucesso!')
        handleCancelarEdicao()
        carregarDados()
      }
    }
  }

  async function handleDeletar(id: string) {
    if (!confirm('Deseja remover este cartão de crédito? Isso pode afetar os lançamentos vinculados a ele.')) return
    
    const { error } = await supabase.from('cartoes_credito').delete().eq('id', id)
    
    if (error) {
      alert(`Erro ao deletar: ${error.message}`)
    } else {
      // Se deletar o cartão que estava sendo editado por coincidência, limpa o formulário
      if (idEditando === id) handleCancelarEdicao()
      carregarDados()
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-8">
      
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* FORMULÁRIO DE CADASTRO / EDIÇÃO */}
        <div className="w-full lg:w-1/3 bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit">
          <h1 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${idEditando ? 'text-amber-400' : 'text-violet-400'}`}>
            {idEditando ? <Pencil size={24} /> : <PlusCircle size={24} />}
            {idEditando ? 'Editar Cartão' : 'Novo Cartão'}
          </h1>
          
          <form onSubmit={handleSalvar} className="flex flex-col gap-4">
            {/* NOME DO CARTÃO */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <CreditCard size={12}/> Nome do Cartão / Banco
              </label>
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                placeholder="Ex: Nubank Violeta, XP Visa Infinite" 
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-slate-700 focus:outline-none"
              />
            </div>

            {/* LIMITE */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <DollarSign size={12}/> Limite Total (R$)
              </label>
              <input 
                type="number" 
                step="0.01" 
                value={limite} 
                onChange={(e) => setLimite(e.target.value)} 
                placeholder="0,00" 
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-slate-700 focus:outline-none font-mono"
              />
            </div>

            {/* CONTA PAGAMENTO PADRÃO */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <Wallet size={12}/> Conta Padrão para Débito da Fatura
              </label>
              <select 
                value={contaPagamentoPadraoId} 
                onChange={(e) => setContaPagamentoPadraoId(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="">Selecionar conta bancária...</option>
                {contasBancarias.map(c => (
                  <option key={c.id} value={c.id}>{c.apelido}</option>
                ))}
              </select>
            </div>

            {/* DIAS DE FECHAMENTO E VENCIMENTO */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <Calendar size={12}/> Fechamento (Dia)
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="31"
                  value={diaFechamento} 
                  onChange={(e) => setDiaFechamento(e.target.value)} 
                  placeholder="Ex: 5" 
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <Calendar size={12}/> Vencimento (Dia)
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="31"
                  value={diaVencimento} 
                  onChange={(e) => setDiaVencimento(e.target.value)} 
                  placeholder="Ex: 12" 
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button 
                type="submit" 
                className={`w-full text-white font-bold py-2.5 rounded-lg text-sm shadow-lg transition-colors ${idEditando ? 'bg-amber-600 hover:bg-amber-500' : 'bg-violet-600 hover:bg-violet-500'}`}
              >
                {idEditando ? 'Salvar Alterações' : 'Cadastrar Cartão'}
              </button>

              {idEditando && (
                <button 
                  type="button" 
                  onClick={handleCancelarEdicao}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <XCircle size={14} /> Cancelar Edição
                </button>
              )}
            </div>
          </form>
          
          {status && (
            <p className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 font-mono break-words">
              {status}
            </p>
          )}
        </div>

        {/* LISTAGEM DE CARTÕES */}
        <div className="w-full lg:w-2/3 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-bold text-slate-200 mb-6">Cartões Cadastrados</h2>
          
          {carregando ? (
            <p className="text-slate-400 text-sm font-mono">Buscando cartões no banco de dados...</p>
          ) : cartoes.length === 0 ? (
            <p className="text-slate-500 text-sm italic">Nenhum cartão de crédito cadastrado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cartoes.map((cartao) => (
                <div key={cartao.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all">
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-violet-500/10 text-violet-400 rounded-lg">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-white">{cartao.nome}</h4>
                        <span className="text-xs text-slate-500 font-mono">ID: {cartao.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                    
                    {/* AÇÕES: EDITAR E DELETAR */}
                    <div className="flex items-center gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleIniciarEdicao(cartao)} 
                        className="text-slate-500 hover:text-amber-400 p-1"
                        title="Editar cartão"
                      >
                        <Pencil size={15} />
                      </button>
                      <button 
                        onClick={() => handleDeletar(cartao.id)} 
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Excluir cartão"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-3 mt-2 flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Limite de Crédito:</span>
                      <span className="font-mono font-bold text-slate-200">R$ {cartao.limite.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Conta p/ Pagamento:</span>
                      <span className="font-mono text-sky-400 font-semibold">
                        {contasBancarias.find(c => c.id === cartao.conta_pagamento_padrao_id)?.apelido || 'Não vinculada'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Melhor dia de compra (Fechamento):</span>
                      <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-violet-400">
                        Dia {cartao.dia_fechamento}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Dia de Vencimento:</span>
                      <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-amber-400">
                        Dia {cartao.dia_vencimento}
                      </span>
                    </div>
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