'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // 🔄 REDIRECIONA SE RECARREGAR A PÁGINA
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0]
    if (nav && nav.type === "reload") {
      router.push('/')
    }
  }, [])

  const salvar = async () => {
    if (!nome || !periodo) {
      toast.error('Preencha todos os campos')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('atletas')
      .insert([{ nome, periodo }])

    setLoading(false)

    if (error) {
      toast.error('Erro ao salvar')
      return
    }

    toast.success('Atleta cadastrado!')
    setNome('')
    setPeriodo('')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition">

      <Toaster position="top-right" />

      <div className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow w-[350px]">

        {/* VOLTAR */}
        <Link href="/nps">
          <button className="mb-4 bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white">
            ← Voltar
          </button>
        </Link>

        <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
          Cadastro de Atleta
        </h1>

        <div className="flex flex-col gap-5">

          {/* NOME */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Nome
            </label>
            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite o nome do atleta"
              className="w-full mt-1 border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-[#0B1F3A] 
              text-gray-800 dark:text-white
              rounded-lg px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-[#C62828]"
            />
          </div>

          {/* PERÍODO (SELECT) */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Período
            </label>
            <select
              value={periodo}
              onChange={e => setPeriodo(e.target.value)}
              className="w-full mt-1 border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-[#0B1F3A] 
              text-gray-800 dark:text-white
              rounded-lg px-4 py-2"
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
            className="mt-2 bg-[#C62828] hover:bg-red-700 
            disabled:bg-gray-400
            text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
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
    </div>
  )
}