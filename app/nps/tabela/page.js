'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default function Tabela() {
  const [dados, setDados] = useState([])

  const carregar = async () => {
    const { data } = await supabase
      .from('atletas')
      .select('*')
      .order('created_at')

    setDados(data)
  }

  useEffect(() => {
    carregar()
  }, [])

  const atualizar = async (id, campo) => {
    await supabase
      .from('atletas')
      .update({ [campo]: true })
      .eq('id', id)

    carregar()
  }

  const addDias = (data, dias) => {
    const d = new Date(data)
    d.setDate(d.getDate() + dias)
    return d.toLocaleDateString()
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Tabela NPS</h1>

      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-[#0B1F3A] text-white">
          <tr>
            <th className="p-3">#</th>
            <th>Nome</th>
            <th>Período</th>
            <th>Data</th>
            <th>+1</th>
            <th>+7</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {dados.map((a, i) => (
            <tr key={a.id} className="text-center border-t hover:bg-gray-100">
              <td className="p-2">{i + 1}</td>
              <td>{a.nome}</td>
              <td>{a.periodo}</td>
              <td>{new Date(a.created_at).toLocaleDateString()}</td>

              <td>
                <button className="bg-blue-500 text-white px-2 py-1 rounded">
                  +1
                </button>
              </td>

              <td>
                <button className="bg-purple-500 text-white px-2 py-1 rounded">
                  +7
                </button>
              </td>

              <td>
                <button className="bg-green-500 text-white px-2 py-1 rounded">
                  ✔
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}