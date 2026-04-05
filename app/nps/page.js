'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { User, Table, BarChart3 } from 'lucide-react'

export default function NPS() {

  useEffect(() => {
    document.title = 'NPS | PulseFlow'
  }, [])

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">

      <div>
        <h1 className="text-2xl font-semibold">
          Sistema NPS
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gerencie seus envios e métricas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">

        <Link href="/nps/cadastro">
          <div className="bg-green-600 hover:bg-green-700 
          hover:scale-[1.02] transition 
          text-white p-6 rounded-xl flex items-center gap-3 cursor-pointer">

            <User />
            <span>Cadastrar Atleta</span>

          </div>
        </Link>

        <Link href="/nps/tabela">
          <div className="bg-blue-600 hover:bg-blue-700 
          hover:scale-[1.02] transition 
          text-white p-6 rounded-xl flex items-center gap-3 cursor-pointer">

            <Table />
            <span>Ver Tabela</span>

          </div>
        </Link>

        <Link href="/nps/relatorio">
          <div className="bg-purple-600 hover:bg-purple-700 
          hover:scale-[1.02] transition 
          text-white p-6 rounded-xl flex items-center gap-3 cursor-pointer">

            <BarChart3 />
            <span>Relatório</span>

          </div>
        </Link>

      </div>

    </div>
  )
}