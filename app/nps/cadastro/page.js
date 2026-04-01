'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [loading, setLoading] = useState(false)

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
    <div className="max-w-xl">

      {/* TOAST */}
      <Toaster position="top-right" />

      {/* TÍTULO */}
      <h1 className="text-2xl font-semibold mb-6">
        Cadastro de Atleta
      </h1>

      {/* CARD */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm flex flex-col gap-5 transition">

        {/* INPUT NOME */}
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
            rounded-lg px-4 py-2 transition
            focus:outline-none focus:ring-2 focus:ring-[#C62828]"
          />
        </div>

        {/* INPUT PERÍODO */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Período
          </label>
          <input
            value={periodo}
            onChange={e => setPeriodo(e.target.value)}
            placeholder="Ex: Manhã / Tarde / Noite"
            className="w-full mt-1 border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-[#0B1F3A] 
            text-gray-800 dark:text-white
            rounded-lg px-4 py-2 transition
            focus:outline-none focus:ring-2 focus:ring-[#C62828]"
          />
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
  )
}