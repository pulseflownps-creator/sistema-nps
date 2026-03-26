'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [periodo, setPeriodo] = useState('')

  const salvar = async () => {
    await supabase.from('atletas').insert([{ nome, periodo }])
    alert('Salvo com sucesso!')
    setNome('')
    setPeriodo('')
  }

  return (
    <div className="max-w-xl">

      {/* TÍTULO */}
      <h1 className="text-2xl font-semibold mb-6">
        Cadastro de Atleta
      </h1>

      {/* CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-5">

        {/* INPUT NOME */}
        <div>
          <label className="text-sm text-gray-600">Nome</label>
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Digite o nome do atleta"
            className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-[#C62828]"
          />
        </div>

        {/* INPUT PERÍODO */}
        <div>
          <label className="text-sm text-gray-600">Período</label>
          <input
            value={periodo}
            onChange={e => setPeriodo(e.target.value)}
            placeholder="Ex: Manhã / Tarde / Noite"
            className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-[#C62828]"
          />
        </div>

        {/* BOTÃO */}
        <button
          onClick={salvar}
          className="mt-2 bg-[#C62828] hover:bg-red-700 text-white py-2 rounded-lg transition"
        >
          Salvar atleta
        </button>

      </div>
    </div>
  )
}