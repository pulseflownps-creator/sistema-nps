'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function Tabela() {
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState(null)

  const carregar = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('atletas')
      .select('*')
      .order('created_at')

    if (error) {
      toast.error('Erro ao carregar dados')
    } else {
      setDados(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    carregar()
  }, [])

  const atualizar = async (id, campo) => {
    setLoadingId(id)

    const { error } = await supabase
      .from('atletas')
      .update({ [campo]: true })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar')
    } else {
      toast.success('Atualizado com sucesso')
      carregar()
    }

    setLoadingId(null)
  }

  return (
    <div className="flex flex-col gap-6">

      <Toaster position="top-right" />

      {/* TÍTULO */}
      <h1 className="text-2xl font-semibold">
        Tabela NPS
      </h1>

      {/* CARD */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm overflow-hidden transition">

        {/* LOADING */}
        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-300">
            Carregando dados...
          </div>
        ) : (

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">

              {/* CABEÇALHO */}
              <thead className="bg-gray-100 dark:bg-[#0B1F3A] text-gray-600 dark:text-gray-300 text-sm">
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
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#0B1F3A]/50 transition"
                  >
                    <td className="p-4 text-sm text-gray-500">
                      {i + 1}
                    </td>

                    <td className="p-4 font-medium text-gray-800 dark:text-white">
                      {a.nome}
                    </td>

                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      {a.periodo}
                    </td>

                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>

                    {/* AÇÕES */}
                    <td className="p-4">
                      <div className="flex gap-2">

                        {/* +1 */}
                        <button
                          disabled={a.respondido || a.enviado_dia1 || loadingId === a.id}
                          onClick={() => atualizar(a.id, 'enviado_dia1')}
                          className="px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 
                          disabled:bg-gray-200 disabled:text-gray-400 transition flex items-center gap-1"
                        >
                          {loadingId === a.id ? "..." : "+1"}
                        </button>

                        {/* +7 */}
                        <button
                          disabled={a.respondido || a.enviado_semana || loadingId === a.id}
                          onClick={() => atualizar(a.id, 'enviado_semana')}
                          className="px-3 py-1 rounded-lg text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 
                          disabled:bg-gray-200 disabled:text-gray-400 transition"
                        >
                          {loadingId === a.id ? "..." : "+7"}
                        </button>

                        {/* RESPONDIDO */}
                        <button
                          disabled={loadingId === a.id}
                          onClick={() => atualizar(a.id, 'respondido')}
                          className={`px-3 py-1 rounded-lg text-sm transition
                            ${
                              a.respondido
                                ? "bg-green-100 text-green-700"
                                : "bg-[#C62828] text-white hover:bg-red-700"
                            }`}
                        >
                          {loadingId === a.id
                            ? "..."
                            : a.respondido
                            ? "Respondido"
                            : "Marcar"}
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        )}
      </div>
    </div>
  )
}