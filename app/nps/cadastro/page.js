'use client'

/* =========================
   IMPORTS
========================= */
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

/* =========================
   CADASTRO
========================= */
export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [loading, setLoading] = useState(false)

  /* =========================
     🧠 TITLE
  ========================= */
  useEffect(() => {
    document.title = 'Cadastro | PulseFlow'
  }, [])

  /* =========================
     💾 SALVAR
  ========================= */
  const salvar = async () => {
    if (!nome || !periodo) {
      toast.error('Preencha todos os campos')
      return
    }

    // 🔥 CORREÇÃO: valida supabase
    if (!supabase?.auth) {
      toast.error('Erro de configuração do sistema')
      console.error('Supabase inválido')
      return
    }

    setLoading(true)

    try {
      // 🔐 pegar usuário logado
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        toast.error('Usuário não autenticado')
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from('atletas')
        .insert([
          {
            nome,
            periodo,
            user_id: user.id
          }
        ])

      if (error) {
        toast.error('Erro ao salvar')
        setLoading(false)
        return
      }

      toast.success('Atleta cadastrado com sucesso!')

      setNome('')
      setPeriodo('')
    } catch (err) {
      console.error(err)
      toast.error('Erro inesperado')
    }

    setLoading(false)
  }

  /* =========================
     ⌨️ ENTER PARA SALVAR
  ========================= */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) salvar()
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">

      <Toaster position="top-right" />

      {/* =========================
         TÍTULO
      ========================= */}
      <div>
        <h1 className="text-2xl font-semibold">
          Cadastro de Atleta
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Adicione novos atletas ao controle NPS
        </p>
      </div>

      {/* =========================
         CARD
      ========================= */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm flex flex-col gap-5">

        {/* NOME */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Nome do atleta
          </label>

          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: João Silva"
            className="w-full mt-1 border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-[#0B1F3A] 
            text-gray-800 dark:text-white
            rounded-lg px-4 py-2
            transition
            focus:outline-none focus:ring-2 focus:ring-[#C62828]
            hover:border-[#C62828]"
          />
        </div>

        {/* PERÍODO */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Período de acompanhamento
          </label>

          <select
            value={periodo}
            onChange={e => setPeriodo(e.target.value)}
            className="w-full mt-1 border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-[#0B1F3A] 
            text-gray-800 dark:text-white
            rounded-lg px-4 py-2
            transition hover:border-[#C62828]"
          >
            <option value="">Selecione um período</option>
            <option value="7 dias">7 dias</option>
            <option value="1 mês">1 mês</option>
            <option value="3 meses">3 meses</option>
            <option value="6 meses">6 meses</option>
            <option value="9 meses">9 meses</option>
            <option value="1 ano">1 ano</option>
          </select>
        </div>

        {/* BOTÃO */}
        <button
          onClick={salvar}
          disabled={loading}
          className="mt-2 bg-[#C62828] hover:bg-red-700 hover:scale-105
          disabled:bg-gray-400
          text-white py-2 rounded-lg transition-all duration-200
          flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Salvando...
            </>
          ) : (
            "Salvar atleta"
          )}
        </button>

      </div>

    </div>
  )
}