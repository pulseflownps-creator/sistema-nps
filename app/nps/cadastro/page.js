'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [periodo, setPeriodo] = useState('')

  const salvar = async () => {
    await supabase.from('atletas').insert([{ nome, periodo }])
    alert('Salvo!')
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <Link href="/nps">
        <button className="mb-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
          ← Voltar
        </button>
      </Link>
      <h1 className="text-xl font-bold mb-4">Cadastro de Atleta</h1>

      <input
        className="border p-2 w-full mb-4 rounded"
        placeholder="Nome"
        onChange={e => setNome(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4 rounded"
        placeholder="Período"
        onChange={e => setPeriodo(e.target.value)}
      />

      <button
        onClick={salvar}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Salvar
      </button>
    </div>
  )
}