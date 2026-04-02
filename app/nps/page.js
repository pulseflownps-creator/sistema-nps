'use client'

import Link from 'next/link'

export default function NPS() {
  return (
    <div className="flex flex-col gap-6">

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
          <div className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl cursor-pointer transition">
            Cadastrar Atleta
          </div>
        </Link>

        <Link href="/nps/tabela">
          <div className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl cursor-pointer transition">
            Ver Tabela
          </div>
        </Link>

        <Link href="/nps/relatorio">
          <div className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl cursor-pointer transition">
            Relatório
          </div>
        </Link>

      </div>

    </div>
  )
}