'use client'

/* =========================
   IMPORTS
========================= */
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

/* =========================
   RELATÓRIO
========================= */
export default function Relatorio() {
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState('mes')

  /* =========================
     📊 GERAR RELATÓRIO
  ========================= */
  const gerar = async () => {
    setLoading(true)

    const { data, error } = await supabase.from('atletas').select('*')

    if (error) {
      toast.error('Erro ao gerar relatório')
      setLoading(false)
      return
    }

    const hoje = new Date()

    let filtrados = []

    if (filtro === 'mes') {
      filtrados = data.filter(a =>
        new Date(a.created_at).getMonth() === hoje.getMonth()
      )
    }

    if (filtro === '3meses') {
      filtrados = data.filter(a =>
        (hoje - new Date(a.created_at)) <= (90 * 24 * 60 * 60 * 1000)
      )
    }

    if (filtro === '6meses') {
      filtrados = data.filter(a =>
        (hoje - new Date(a.created_at)) <= (180 * 24 * 60 * 60 * 1000)
      )
    }

    if (filtro === 'todos') {
      filtrados = data
    }

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

  /* =========================
     📈 DADOS DO GRÁFICO
  ========================= */
  const dataGrafico = dados
    ? [
        { name: 'Total', valor: dados.total },
        { name: 'Respondidos', valor: dados.respondidos }
      ]
    : []

  return (
    <div className="flex flex-col gap-6">

      <Toaster position="top-right" />

      {/* =========================
         TOPO
      ========================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-semibold">
            Relatório NPS
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analise o desempenho dos envios
          </p>
        </div>

        <div className="flex gap-2">

          {/* FILTRO */}
          <select
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-[#0B1F3A] 
            text-gray-800 dark:text-white
            px-3 py-2 rounded-lg"
          >
            <option value="mes">Mês atual</option>
            <option value="3meses">Últimos 3 meses</option>
            <option value="6meses">Últimos 6 meses</option>
            <option value="todos">Todos</option>
          </select>

          {/* BOTÃO */}
          <button
            onClick={gerar}
            disabled={loading}
            className="bg-[#C62828] hover:bg-red-700 
            disabled:bg-gray-400
            text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {loading ? 'Gerando...' : 'Gerar relatório'}
          </button>

        </div>

      </div>

      {/* =========================
         MÉTRICAS
      ========================= */}
      {dados && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-300">Total</p>
            <h2 className="text-3xl font-bold">{dados.total}</h2>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-300">Respondidos</p>
            <h2 className="text-3xl font-bold">{dados.respondidos}</h2>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-300">Taxa</p>
            <h2 className="text-3xl font-bold">{dados.percentual}%</h2>
          </div>

        </div>
      )}

      {/* =========================
         GRÁFICO
      ========================= */}
      {dados && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm">

          <h2 className="text-lg font-semibold mb-4">
            Desempenho
          </h2>

          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <BarChart data={dataGrafico}>
                <XAxis dataKey="name" />
                <YAxis />
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