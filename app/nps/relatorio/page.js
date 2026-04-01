'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function Relatorio() {
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(false)

  const gerar = async () => {
    setLoading(true)

    const { data, error } = await supabase.from('atletas').select('*')

    if (error) {
      toast.error('Erro ao gerar relatório')
      setLoading(false)
      return
    }

    const mesAtual = new Date().getMonth()

    const filtrados = data.filter(a =>
      new Date(a.created_at).getMonth() === mesAtual
    )

    const total = filtrados.length
    const respondidos = filtrados.filter(a => a.respondido).length

    setDados({
      total,
      respondidos,
      percentual: total ? ((respondidos / total) * 100).toFixed(1) : 0
    })

    toast.success('Relatório gerado!')
    setLoading(false)
  }

  const dataGrafico = dados
    ? [
        { name: 'Total', valor: dados.total },
        { name: 'Respondidos', valor: dados.respondidos }
      ]
    : []

  return (
    <div className="flex flex-col gap-6">

      <Toaster position="top-right" />

      {/* TOPO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold">
          Relatório NPS
        </h1>

        <button
          onClick={gerar}
          disabled={loading}
          className="bg-[#C62828] hover:bg-red-700 
          disabled:bg-gray-400
          text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Gerando...
            </>
          ) : (
            "Gerar relatório"
          )}
        </button>
      </div>

      {/* MÉTRICAS */}
      {dados && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl shadow-sm transition">
            <p className="text-sm text-gray-500 dark:text-gray-300">Total</p>
            <h2 className="text-3xl font-bold">{dados.total}</h2>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl shadow-sm transition">
            <p className="text-sm text-gray-500 dark:text-gray-300">Respondidos</p>
            <h2 className="text-3xl font-bold">{dados.respondidos}</h2>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl shadow-sm transition">
            <p className="text-sm text-gray-500 dark:text-gray-300">Percentual</p>
            <h2 className="text-3xl font-bold">{dados.percentual}%</h2>
          </div>

        </div>
      )}

      {/* GRÁFICO */}
      {dados && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm transition">
          <h2 className="text-lg font-semibold mb-4">
            Desempenho
          </h2>

          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <BarChart data={dataGrafico}>
                <XAxis stroke="#888" dataKey="name" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="valor" fill="#C62828" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  )
}