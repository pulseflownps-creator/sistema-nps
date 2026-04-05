'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Tabela() {
  const [dados, setDados] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState(null)

  const [mes, setMes] = useState('')
  const [periodoFiltro, setPeriodoFiltro] = useState('')
  const [status, setStatus] = useState('')

  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    document.title = 'Tabela NPS | PulseFlow'
  }, [])

  const carregar = async () => {
    if (!supabase?.auth) return

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('atletas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at')

    setDados(data || [])
    setLoading(false)
  }

  useEffect(() => {
    carregar()
  }, [])

  useEffect(() => {
    let temp = [...dados]

    if (mes) {
      temp = temp.filter(a =>
        new Date(a.created_at).getMonth().toString() === mes
      )
    }

    if (periodoFiltro) {
      temp = temp.filter(a => a.periodo === periodoFiltro)
    }

    if (status) {
      temp = temp.filter(a =>
        status === 'sim' ? a.respondido : !a.respondido
      )
    }

    setFiltrados(temp)
  }, [mes, periodoFiltro, status, dados])

  const atualizar = async (id, campo) => {
    setLoadingId(id)

    await supabase
      .from('atletas')
      .update({ [campo]: true })
      .eq('id', id)

    carregar()
    setLoadingId(null)
  }

  /* 🗑️ APAGAR TABELA (CORRIGIDO) */
  const confirmarExclusao = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('atletas')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Tabela apagada com sucesso')
      setOpenModal(false)
      carregar()
    } catch (err) {
      toast.error('Erro ao apagar tabela')
      console.error(err)
    }
  }

  /* 📄 PDF MELHORADO */
  const gerarPDF = () => {
    const doc = new jsPDF()

    const total = filtrados.length
    const respondidos = filtrados.filter(a => a.respondido).length
    const taxa = total ? ((respondidos / total) * 100).toFixed(1) : 0

    // LOGO
    const img = new Image()
    img.src = '/logo-empresa.png'

    doc.addImage(img, 'PNG', 14, 10, 30, 15)

    // TÍTULO
    doc.setFontSize(18)
    doc.setTextColor(33, 150, 243)
    doc.text("Relatório NPS", 105, 20, { align: 'center' })

    // DASHBOARD
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)

    doc.setFillColor(33, 150, 243)
    doc.rect(14, 30, 180, 25, 'F')

    doc.setTextColor(255, 255, 255)
    doc.text(`Total: ${total}`, 20, 40)
    doc.text(`Respondidos: ${respondidos}`, 80, 40)
    doc.text(`Taxa: ${taxa}%`, 150, 40)

    const tabela = filtrados.map((a, i) => ([
      i + 1,
      a.nome,
      a.periodo,
      new Date(a.created_at).toLocaleDateString(),
      a.respondido ? 'Sim' : 'Não'
    ]))

    autoTable(doc, {
      startY: 60,
      head: [['#', 'Nome', 'Período', 'Data', 'Respondido']],
      body: tabela,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [33, 150, 243] }
    })

    doc.save('relatorio_nps.pdf')
  }

  const exportarCSV = () => {
    const linhas = filtrados.map(a =>
      `${a.nome},${a.periodo},${a.respondido ? 'Sim' : 'Não'}`
    )

    const csv = "Nome,Periodo,Respondido\n" + linhas.join("\n")

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'tabela_nps.csv'
    a.click()
  }

  return (
    <div className="w-full flex flex-col gap-6">

      <Toaster position="top-right" />

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl w-full max-w-sm">

            <h2 className="text-lg font-semibold mb-2">
              Confirmar exclusão
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja apagar todos os dados?
            </p>

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpenModal(false)} className="px-4 py-2 rounded-lg bg-gray-300">
                Cancelar
              </button>

              <button onClick={confirmarExclusao} className="px-4 py-2 rounded-lg bg-red-600 text-white">
                Apagar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 items-center">

        <h1 className="text-3xl font-bold text-blue-600">
          Tabela NPS
        </h1>

        <div className="flex gap-2 flex-wrap">
          <button onClick={gerarPDF} className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl shadow">
            PDF
          </button>

          <button onClick={exportarCSV} className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-xl shadow">
            CSV
          </button>

          <button onClick={() => setOpenModal(true)} className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-xl shadow">
            Apagar tabela
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-3 flex-wrap">

        <select onChange={e => setMes(e.target.value)} className="p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500">
          <option value="">Mês</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i}>{i + 1}</option>
          ))}
        </select>

        <select onChange={e => setPeriodoFiltro(e.target.value)} className="p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500">
          <option value="">Período</option>
          {[...new Set(dados.map(a => a.periodo))].map(p => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select onChange={e => setStatus(e.target.value)} className="p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500">
          <option value="">Status</option>
          <option value="sim">Respondido</option>
          <option value="nao">Não respondido</option>
        </select>

      </div>

      {/* TABELA */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-md overflow-x-auto">

        {loading ? (
          <div className="p-6 text-center">Carregando...</div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-blue-50 dark:bg-gray-800">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Período</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((a, i) => (
                <tr key={a.id} className="border-t hover:bg-blue-50 dark:hover:bg-gray-700 transition">

                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{a.nome}</td>
                  <td className="p-3">{a.periodo}</td>
                  <td className="p-3">{new Date(a.created_at).toLocaleDateString()}</td>

                  <td className="p-3 flex gap-2">
                    <button disabled={loadingId === a.id} onClick={() => atualizar(a.id, 'enviado_dia1')} className="bg-blue-500 text-white px-2 rounded">
                      +1
                    </button>

                    <button disabled={loadingId === a.id} onClick={() => atualizar(a.id, 'enviado_semana')} className="bg-blue-400 text-white px-2 rounded">
                      +7
                    </button>

                    <button disabled={loadingId === a.id} onClick={() => atualizar(a.id, 'respondido')} className="bg-blue-700 text-white px-2 rounded">
                      OK
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

    </div>
  )
}