'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Tabela() {
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState(null)

  useEffect(() => {
    document.title = 'Tabela NPS | PulseFlow'
  }, [])

  const carregar = async () => {
    if (!supabase?.auth) {
      toast.error('Erro de configuração do sistema')
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        toast.error('Usuário não autenticado')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('atletas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at')

      if (error) {
        toast.error('Erro ao carregar dados')
      } else {
        setDados(data)
      }

    } catch (err) {
      console.error(err)
      toast.error('Erro inesperado')
    }

    setLoading(false)
  }

  useEffect(() => {
    carregar()
  }, [])

  const atualizar = async (id, campo) => {
    if (!supabase) return

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

  const gerarPDF = () => {
    const doc = new jsPDF()

    const img = new Image()
    img.src = '/logo.png'

    img.onload = () => {

      doc.addImage(img, 'PNG', 14, 10, 20, 20)

      doc.setFontSize(18)
      doc.text("Relatório NPS", 40, 18)

      doc.setFontSize(11)
      doc.text("PulseFlow - Sistema de Gestão", 40, 24)

      doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 40, 30)

      doc.line(14, 35, 196, 35)

      const total = dados.length
      const respondidos = dados.filter(a => a.respondido).length
      const percentual = total ? ((respondidos / total) * 100).toFixed(1) : 0

      doc.text("Resumo Executivo", 14, 45)
      doc.text(`Total de atletas: ${total}`, 14, 55)
      doc.text(`Respondidos: ${respondidos}`, 14, 62)
      doc.text(`Taxa de resposta: ${percentual}%`, 14, 69)

      const tabela = dados.map((a, i) => ([
        i + 1,
        a.nome,
        a.periodo,
        new Date(a.created_at).toLocaleDateString(),
        a.respondido ? 'Sim' : 'Não'
      ]))

      autoTable(doc, {
        startY: 80,
        head: [['#', 'Nome', 'Período', 'Data', 'Respondido']],
        body: tabela,
      })

      doc.save('relatorio_nps_profissional.pdf')
    }
  }

  const encerrarCiclo = async () => {
    if (!confirm('Encerrar ciclo? Isso irá apagar seus dados.')) return

    if (!supabase?.auth) {
      toast.error('Erro de configuração')
      return
    }

    gerarPDF()

    try {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (error || !user) {
        toast.error('Usuário não autenticado')
        return
      }

      await supabase
        .from('atletas')
        .delete()
        .eq('user_id', user.id)

      toast.success('Ciclo encerrado!')
      setDados([])

    } catch (err) {
      console.error(err)
      toast.error('Erro ao encerrar ciclo')
    }
  }

  return (
    <div className="flex flex-col gap-6">

      <Toaster position="top-right" />

      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Tabela NPS</h1>

        <button
          onClick={encerrarCiclo}
          className="bg-red-600 hover:bg-red-700 hover:scale-105
          text-white px-4 py-2 rounded-lg transition"
        >
          Encerrar ciclo + PDF
        </button>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-6 text-center">Carregando...</div>
        ) : (
          <table className="w-full">

            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Período</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {dados.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.nome}</td>
                  <td>{a.periodo}</td>
                  <td>{new Date(a.created_at).toLocaleDateString()}</td>

                  <td className="flex gap-2">
                    <button disabled={loadingId === a.id} onClick={() => atualizar(a.id, 'enviado_dia1')}>+1</button>
                    <button disabled={loadingId === a.id} onClick={() => atualizar(a.id, 'enviado_semana')}>+7</button>
                    <button disabled={loadingId === a.id} onClick={() => atualizar(a.id, 'respondido')}>OK</button>
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