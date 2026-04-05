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

  /* =========================
     FILTROS
  ========================= */
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

  /* =========================
     PDF
  ========================= */
  const gerarPDF = () => {
    const doc = new jsPDF()
    const img = new Image()
    img.src = '/logo-empresa.png'

    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 10, 20, 20)
      doc.text("Relatório NPS", 40, 18)

      const tabela = filtrados.map((a, i) => ([
        i + 1,
        a.nome,
        a.periodo,
        new Date(a.created_at).toLocaleDateString(),
        a.respondido ? 'Sim' : 'Não'
      ]))

      autoTable(doc, {
        startY: 40,
        head: [['#', 'Nome', 'Período', 'Data', 'Respondido']],
        body: tabela,
      })

      doc.save('relatorio_nps.pdf')
    }
  }

  /* =========================
     CSV
  ========================= */
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
    <div className="flex flex-col gap-6">

      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row md:justify-between gap-4">

        <h1 className="text-2xl font-semibold">Tabela NPS</h1>

        <div className="flex gap-2 flex-wrap">
          <button onClick={gerarPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            PDF
          </button>

          <button onClick={exportarCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg">
            CSV
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-3 flex-wrap">

        <select onChange={e => setMes(e.target.value)} className="p-2 border rounded">
          <option value="">Mês</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i}>{i + 1}</option>
          ))}
        </select>

        <select onChange={e => setPeriodoFiltro(e.target.value)} className="p-2 border rounded">
          <option value="">Período</option>
          {[...new Set(dados.map(a => a.periodo))].map(p => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select onChange={e => setStatus(e.target.value)} className="p-2 border rounded">
          <option value="">Status</option>
          <option value="sim">Respondido</option>
          <option value="nao">Não respondido</option>
        </select>

      </div>

      {/* TABELA */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm overflow-x-auto">

        {loading ? (
          <div className="p-6 text-center">Carregando...</div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-100 dark:bg-gray-800">
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
                <tr key={a.id} className="border-t">

                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{a.nome}</td>
                  <td className="p-3">{a.periodo}</td>
                  <td className="p-3">{new Date(a.created_at).toLocaleDateString()}</td>

                  <td className="p-3 flex gap-2">
                    <button disabled={loadingId === a.id} onClick={() => atualizar(a.id, 'enviado_dia1')} className="bg-blue-500 text-white px-2 rounded">+1</button>
                    <button disabled={loadingId === a.id} onClick={() => atualizar(a.id, 'enviado_semana')} className="bg-yellow-500 text-white px-2 rounded">+7</button>
                    <button disabled={loadingId === a.id} onClick={() => atualizar(a.id, 'respondido')} className="bg-green-600 text-white px-2 rounded">OK</button>
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