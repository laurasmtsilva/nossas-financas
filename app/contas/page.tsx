'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar' // Importação do componente centralizado
import { LayoutDashboard, Wallet, FolderTree, ArrowLeftRight } from 'lucide-react'

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
  // Estados do formulário
  const [banco, setBanco] = useState('')
  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ'>('PF')
  const [titularidade, setTitularidade] = useState<'I' | 'C'>('I')
  const [apelido, setApelido] = useState('')
  const [saldoInicial, setSaldoInicial] = useState('0')

  // Controle de Edição
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null)

  // Estados da lista e status
  const [contas, setContas] = useState<ContaBancaria[]>([])
  const [status, setStatus] = useState('')
  const [carregando, setCarregando] = useState(true)

  // 1. Carregar contas do Supabase
  async function carregarContas() {
    setCarregando(true)
    const { data, error } = await supabase
      .from('contas_bancarias')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) {
      setStatus(`Erro ao carregar contas: ${error.message}`)
    } else if (data) {
      setContas(data as ContaBancaria[])
    }
    setCarregando(false)
  }

  useEffect(() => {
    carregarContas()
  }, [])

  // 2. Ativar o Modo de Edição com Validação (Regra de Negócio)
  async function prepararEdicao(conta: ContaBancaria) {
    setStatus('🔍 Verificando se a conta possui lançamentos...')
    
    // Faz uma busca ultra leve na tabela de transações apenas para contar se há registros vinculados
    const { count, error } = await supabase
      .from('transacoes')
      .select('*', { count: 'exact', head: true })
      .eq('conta_bancaria_id', conta.id)

    if (error) {
      setStatus(`❌ Erro ao verificar transações: ${error.message}`)
      return
    }

    // Se o contador for maior que zero, bloqueia a edição do saldo inicial
    if (count && count > 0) {
      setStatus('⚠️ Bloqueado: Esta conta já possui movimentações financeiras registradas. O saldo inicial não pode mais ser alterado.')
      return
    }

    // Se passou na validação, preenche o formulário com os dados atuais
    setIdEmEdicao(conta.id)
    setBanco(conta.banco)
    setTipoPessoa(conta.tipo_pessoa)
    setTitularidade(conta.titularidade)
    setApelido(conta.apelido)
    setSaldoInicial(conta.saldo_inicial.toString())
    setStatus(`✍️ Editando a conta "${conta.apelido}"`)
  }

  // 3. Cancelar a edição e limpar os campos
  function cancelarEdicao() {
    setIdEmEdicao(null)
    setBanco('')
    setTipoPessoa('PF')
    setTitularidade('I')
    setApelido('')
    setSaldoInicial('0')
    setStatus('')
  }

  // 4. Enviar os dados (Salvar Novo ou Atualizar Existente)
  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()

    if (!banco || !apelido) {
      setStatus('⚠️ Por favor, preencha o Banco e o Apelido/Alias.')
      return
    }

    const dadosConta = {
      banco: banco,
      tipo_pessoa: tipoPessoa,
      titularidade: titularidade,
      apelido: apelido,
      saldo_inicial: parseFloat(saldoInicial) || 0
    }

    if (idEmEdicao) {
      // MODO EDIÇÃO: Executa o UPDATE no Supabase
      setStatus('Atualizando no banco de dados...')
      const { error } = await supabase
        .from('contas_bancarias')
        .update(dadosConta)
        .eq('id', idEmEdicao) // Garante que só vai atualizar a conta certa

      if (error) {
        setStatus(`❌ Erro ao atualizar: ${error.message}`)
      } else {
        setStatus('✅ Conta atualizada com sucesso!')
        cancelarEdicao()
        carregarContas()
      }
    } else {
      // MODO CADASTRO: Executa o INSERT no Supabase
      setStatus('Salvando novo registro...')
      const { error } = await supabase
        .from('contas_bancarias')
        .insert([dadosConta])

      if (error) {
        setStatus(`❌ Erro ao salvar: ${error.message}`)
      } else {
        setStatus('✅ Conta cadastrada com sucesso!')
        cancelarEdicao()
        carregarContas()
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-8">
      
      {/* Chamada do menu simplificada e unificada */}
      <Navbar />

      {/* CONTAINER DAS SEÇÕES (ESTRUTURA ORIGINAL DE GRID PRESERVADA) */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* FORMULÁRIO */}
        <div className="w-full lg:w-1/3 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl h-fit">
          <h1 className="text-2xl font-bold text-emerald-400 mb-1">Contas Bancárias</h1>
          <p className="text-slate-400 text-sm mb-6">
            {idEmEdicao ? '📝 Editar Conta Bancária' : '✨ Inserir Nova Conta Bancária'}
          </p>

          <form onSubmit={handleSalvar} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Instituição / Banco</label>
              <input 
                type="text" 
                value={banco} 
                onChange={(e) => setBanco(e.target.value)}
                placeholder="Ex: Nubank, Caixa"
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nome / Apelido da Conta</label>
              <input 
                type="text" 
                value={apelido} 
                onChange={(e) => setApelido(e.target.value)}
                placeholder="Ex: Conjunta Principal"
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tipo de Pessoa</label>
                <select 
                  value={tipoPessoa} 
                  onChange={(e) => setTipoPessoa(e.target.value as 'PF' | 'PJ')}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
                >
                  <option value="PF">PF (Física)</option>
                  <option value="PJ">PJ (Jurídica)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Titularidade</label>
                <select 
                  value={titularidade} 
                  onChange={(e) => setTitularidade(e.target.value as 'I' | 'C')}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
                >
                  <option value="I">Individual (I)</option>
                  <option value="C">Conjunta (C)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Saldo Inicial (R$)</label>
              <input 
                type="number" 
                step="0.01"
                value={saldoInicial} 
                onChange={(e) => setSaldoInicial(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>

            <div className="flex gap-2 mt-2">
              {idEmEdicao && (
                <button 
                  type="button"
                  onClick={cancelarEdicao}
                  className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded text-sm transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button 
                type="submit"
                className={`font-bold py-2 rounded text-sm transition-colors ${idEmEdicao ? 'w-2/3 bg-amber-500 hover:bg-amber-600 text-slate-950' : 'w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950'}`}
              >
                {idEmEdicao ? 'Salvar Alterações' : 'Cadastrar Conta'}
              </button>
            </div>
          </form>

          {status && (
            <p className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 font-mono break-words">
              {status}
            </p>
          )}
        </div>

        {/* TABELA DE VISUALIZAÇÃO */}
        <div className="w-full lg:w-2/3 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-200 mb-4">Contas Cadastradas</h2>

          {carregando ? (
            <p className="text-slate-400 text-sm font-mono">Buscando dados...</p>
          ) : contas.length === 0 ? (
            <p className="text-slate-500 text-sm italic">Nenhuma conta cadastrada ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Apelido / Alias</th>
                    <th className="px-4 py-3">Banco</th>
                    <th className="px-4 py-3 text-center">Tipo</th>
                    <th className="px-4 py-3 text-center">Titularidade</th>
                    <th className="px-4 py-3 text-right">Saldo Inicial</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {contas.map((conta) => (
                    <tr key={conta.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{conta.apelido}</td>
                      <td className="px-4 py-3 text-slate-400">{conta.banco}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${conta.tipo_pessoa === 'PF' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {conta.tipo_pessoa}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${conta.titularidade === 'C' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>
                          {conta.titularidade === 'C' ? 'Conjunta' : 'Individual'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-mono">
                        R$ {conta.saldo_inicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => prepararEdicao(conta)}
                          className="px-3 py-1 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 rounded text-xs font-semibold transition-all border border-slate-700"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}