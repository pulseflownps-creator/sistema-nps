'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

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
    <div className="bg-white p-6 rounded-xl shadow">
      <Link href="/nps">
        <button className="mb-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
          ← Voltar
        </button>
      </Link>
      <h1 className="text-xl font-bold mb-4">Relatório</h1>

      <button
        onClick={gerar}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Gerar relatório
      </button>

      {dados && (
        <>
          <div className="mb-6">
            <p><b>Total:</b> {dados.total}</p>
            <p><b>Respondidos:</b> {dados.respondidos}</p>
            <p><b>Percentual:</b> {dados.percentual}%</p>
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={dataGrafico}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}