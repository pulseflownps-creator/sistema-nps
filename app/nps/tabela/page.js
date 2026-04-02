'use client'

/* =========================
   IMPORTS
========================= */
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/* =========================
   TABELA
========================= */
export default function Tabela() {
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState(null)

  /* =========================
     🔄 CARREGAR DADOS
  ========================= */
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

  /* =========================
     ✏️ ATUALIZAR STATUS
  ========================= */
  const atualizar = async (id, campo) => {
    setLoadingId(id)

    const { error } = await supabase
      .from('atletas')
      .update({ [campo]: true })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar')
    } else {
      carregar()
    }

    setLoadingId(null)
  }

  /* =========================
     🧾 GERAR PDF
  ========================= */
  const gerarPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("Relatório NPS - PulseFlow", 14, 15)

    doc.setFontSize(10)
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 22)

    const tabela = dados.map((a, i) => ([
      i + 1,
      a.nome,
      a.periodo,
      new Date(a.created_at).toLocaleDateString(),
      a.respondido ? 'Sim' : 'Não'
    ]))

    autoTable(doc, {
      startY: 30,
      head: [['#', 'Nome', 'Período', 'Data', 'Respondido']],
      body: tabela,
    })

    doc.save('relatorio_nps.pdf')
  }

  /* =========================
     🗑️ ENCERRAR CICLO
  ========================= */
  const encerrarCiclo = async () => {
    if (!confirm('Encerrar ciclo? Isso irá apagar os dados atuais.')) return

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
    <div className="flex flex-col gap-6">

      <Toaster position="top-right" />

      {/* =========================
         TOPO
      ========================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-semibold">
            Tabela NPS
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acompanhe envios e respostas
          </p>
        </div>

        <button
          onClick={encerrarCiclo}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Encerrar ciclo + PDF
        </button>

      </div>

      {/* =========================
         TABELA
      ========================= */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Carregando dados...
          </div>
        ) : (

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">

              {/* HEADER */}
              <thead className="bg-gray-100 dark:bg-[#0B1F3A] text-sm text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">Período</th>
                  <th className="p-4 text-left">Data</th>
                  <th className="p-4 text-left">Ações</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {dados.map((a, i) => (
                  <tr
                    key={a.id}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#0B1F3A]/50 transition"
                  >

                    <td className="p-4 text-sm text-gray-500">
                      {i + 1}
                    </td>

                    <td className="p-4 font-medium">
                      {a.nome}
                    </td>

                    <td className="p-4">
                      {a.periodo}
                    </td>

                    <td className="p-4">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>

                    {/* AÇÕES */}
                    <td className="p-4 flex gap-2">

                      <button
                        disabled={a.enviado_dia1 || loadingId === a.id}
                        onClick={() => atualizar(a.id, 'enviado_dia1')}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg disabled:opacity-50"
                      >
                        +1
                      </button>

                      <button
                        disabled={a.enviado_semana || loadingId === a.id}
                        onClick={() => atualizar(a.id, 'enviado_semana')}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg disabled:opacity-50"
                      >
                        +7
                      </button>

                      <button
                        disabled={a.respondido || loadingId === a.id}
                        onClick={() => atualizar(a.id, 'respondido')}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg disabled:opacity-50"
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
  )
}