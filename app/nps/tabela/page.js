'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Tabela() {
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState(null)

  const router = useRouter()

  // 🔄 REDIRECIONA SE RECARREGAR
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0]
    if (nav && nav.type === "reload") {
      router.push('/')
    }
  }, [])

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

  // 🧾 GERAR PDF
  const gerarPDF = () => {
    const doc = new jsPDF()

    const tabela = dados.map((a, i) => ([
      i + 1,
      a.nome,
      a.periodo,
      new Date(a.created_at).toLocaleDateString(),
      a.respondido ? 'Sim' : 'Não'
    ]))

    autoTable(doc, {
      head: [['#', 'Nome', 'Período', 'Data', 'Respondido']],
      body: tabela
    })

    doc.save('relatorio_nps.pdf')
  }

  // 🗑️ RESETAR TABELA
  const encerrarCiclo = async () => {
    if (!confirm('Deseja encerrar o ciclo e apagar os dados?')) return

    gerarPDF()

    const { error } = await supabase
      .from('atletas')
      .delete()
      .neq('id', 0)

    if (error) {
      toast.error('Erro ao limpar tabela')
    } else {
      toast.success('Ciclo encerrado!')
      setDados([])
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">

      <Toaster position="top-right" />

      <div className="w-full max-w-5xl">

        {/* VOLTAR */}
        <Link href="/nps">
          <button className="mb-4 bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white">
            ← Voltar
          </button>
        </Link>

        <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          Tabela NPS
        </h1>

        {/* BOTÃO ENCERRAR */}
        <button
          onClick={encerrarCiclo}
          className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Encerrar ciclo (gerar PDF)
        </button>

        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow overflow-hidden">

          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Carregando...
            </div>
          ) : (

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">

                <thead className="bg-gray-100 dark:bg-[#0B1F3A]">
                  <tr>
                    <th className="p-4 text-left">#</th>
                    <th className="p-4 text-left">Nome</th>
                    <th className="p-4 text-left">Período</th>
                    <th className="p-4 text-left">Data</th>
                    <th className="p-4 text-left">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {dados.map((a, i) => (
                    <tr key={a.id} className="border-t dark:border-gray-700">

                      <td className="p-4">{i + 1}</td>
                      <td className="p-4">{a.nome}</td>
                      <td className="p-4">{a.periodo}</td>
                      <td className="p-4">
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>

                      <td className="p-4 flex gap-2">

                        <button
                          disabled={loadingId === a.id}
                          onClick={() => atualizar(a.id, 'enviado_dia1')}
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                          +1
                        </button>

                        <button
                          disabled={loadingId === a.id}
                          onClick={() => atualizar(a.id, 'enviado_semana')}
                          className="px-3 py-1 bg-purple-500 text-white rounded"
                        >
                          +7
                        </button>

                        <button
                          onClick={() => atualizar(a.id, 'respondido')}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          OK
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
    </div>
  )
}