'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

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

  const gerar = async () => {
    const { data } = await supabase.from('atletas').select('*')

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
  }

  const dataGrafico = dados
    ? [
      { name: 'Total', valor: dados.total },
      { name: 'Respondidos', valor: dados.respondidos }
    ]
    : []

  return (
    <div className="flex flex-col gap-6">

      {/* TOPO */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Relatório NPS
        </h1>

        <button
          onClick={gerar}
          className="bg-[#C62828] hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Gerar relatório
        </button>
      </div>

      {/* MÉTRICAS */}
      {dados && (
        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Total</p>
            <h2 className="text-2xl font-bold">{dados.total}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Respondidos</p>
            <h2 className="text-2xl font-bold">{dados.respondidos}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Percentual</p>
            <h2 className="text-2xl font-bold">{dados.percentual}%</h2>
          </div>

        </div>
      )}

      {/* GRÁFICO */}
      {dados && (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Desempenho
          </h2>

          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <BarChart data={dataGrafico}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  )
}