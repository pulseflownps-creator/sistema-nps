'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

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

  return (
    <div className="flex flex-col gap-6">

      {/* TÍTULO */}
      <h1 className="text-2xl font-semibold">
        Tabela NPS
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <table className="w-full">

          {/* CABEÇALHO */}
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="text-left p-4">#</th>
              <th className="text-left p-4">Nome</th>
              <th className="text-left p-4">Período</th>
              <th className="text-left p-4">Data</th>
              <th className="text-left p-4">Ações</th>
            </tr>
          </thead>

          {/* CORPO */}
          <tbody>
            {dados.map((a, i) => (
              <tr
                key={a.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 text-sm text-gray-500">
                  {i + 1}
                </td>

                <td className="p-4 font-medium">
                  {a.nome}
                </td>

                <td className="p-4 text-gray-600">
                  {a.periodo}
                </td>

                <td className="p-4 text-gray-600">
                  {new Date(a.created_at).toLocaleDateString()}
                </td>

                {/* AÇÕES */}
                <td className="p-4">
                  <div className="flex gap-2">

                    {/* +1 DIA */}
                    <button
                      disabled={a.respondido || a.enviado_dia1}
                      onClick={() => atualizar(a.id, 'enviado_dia1')}
                      className="px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-400 transition"
                    >
                      +1
                    </button>

                    {/* +7 DIAS */}
                    <button
                      disabled={a.respondido || a.enviado_semana}
                      onClick={() => atualizar(a.id, 'enviado_semana')}
                      className="px-3 py-1 rounded-lg text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:bg-gray-200 disabled:text-gray-400 transition"
                    >
                      +7
                    </button>

                    {/* RESPONDIDO */}
                    <button
                      onClick={() => atualizar(a.id, 'respondido')}
                      className={`px-3 py-1 rounded-lg text-sm transition
                        ${a.respondido
                          ? "bg-green-100 text-green-700"
                          : "bg-[#C62828] text-white hover:bg-red-700"
                        }`}
                    >
                      {a.respondido ? "Respondido" : "Marcar"}
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  )
}